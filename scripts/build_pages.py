"""키워드 엑셀 → data/site-pages.json (사이트 라우트의 단일 출처) + keywords/에이비씨산업개발_키워드_페이지.xlsx

  python -I scripts/build_pages.py                 # '생성 대상' = O 인 행 → 묶음 1~4
  python -I scripts/build_pages.py --extra 400,400 # 오픈 뒤 추가: O 가 아닌 행을 엑셀 순서대로 400개씩 묶음 5, 6

원본: keywords/(주)에이비씨산업개발_키워드.xlsx (region_kw_prj 에서 복사, 키워드 시트 12,774행 중 생성 대상 O 2,000행)
순서 = 엑셀 행 순서(우선순위 순으로 이미 정렬됨). 묶음 = O 행을 4등분(누적 25→50→75→100%, post-launch 규칙).
추가 묶음(extra)은 data/drip.json 의 extra 날짜와 함께 쓴다 (scripts/drip/drip_status.py).
"""
import argparse, json, sys
from collections import Counter
from pathlib import Path
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'keywords' / '(주)에이비씨산업개발_키워드.xlsx'
OUT_XLSX = ROOT / 'keywords' / '에이비씨산업개발_키워드_페이지.xlsx'
SITE_URL = 'https://xn--h49al71ajsb4wdo4h70adc49p.kr'  # lib/site.ts 와 같게 (도메인 미정)

# 엑셀 '단어' → 본문 조합기 서비스 (lib/compose.ts SVC 키)
SERVICE = {'비계': '비계', '아시바': '비계', '비계설치': '비계', '비계임대': '비계', '강관비계': '강관', '시스템비계': '시스템',
           '이지아이휀스': 'egi', 'EGI휀스': 'egi', '가설울타리': '울타리', '가설휀스': '울타리'}


def place_key(label, parent, unit, places):
    if unit != '동·읍면':
        return label
    name = label[len(parent) + 1:] if label.startswith(parent + ' ') else label
    return f'{parent}::{name}'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--extra', default='', help='추가 묶음 크기 목록, 예: 400,400')
    a = ap.parse_args()
    places = json.load(open(ROOT / 'data' / 'places.json', encoding='utf-8'))['places']
    rows = []
    for r in list(load_workbook(SRC, read_only=True)['키워드'].iter_rows(values_only=True))[1:]:
        n, kw, prio, target, _req, label, parent, unit, word, mod, alts, slug = r[:12]
        if not kw:
            continue
        key = place_key(label, parent, unit, places)
        assert key in places, f'지역 데이터 없음: {key} ({kw})'
        assert word in SERVICE, word
        rows.append(dict(n=n, kw=kw, slug=slug, label=label, place=key, hub=places[key]['hub'], word=word, service=SERVICE[word],
                         mod=mod or '', unit=unit, prio=prio, target=target == 'O',
                         alts=[x.strip() for x in (alts or '').split('|') if x.strip()]))
    base = [r for r in rows if r['target']]
    rest = [r for r in rows if not r['target']]
    assert len(base) == 2000, len(base)
    pages = []
    for i, r in enumerate(base):
        pages.append({**r, 'wave': 1 + i * 4 // len(base)})
    sizes = [int(x) for x in a.extra.split(',') if x.strip()]
    k = 0
    for w, size in enumerate(sizes, 5):
        for r in rest[k:k + size]:
            pages.append({**r, 'wave': w})
        k += size
    for i, p in enumerate(pages, 1):
        p['no'] = i
        del p['target']
    assert all(v == 1 for v in Counter(p['slug'] for p in pages).values()), '슬러그 중복'
    json.dump({'pages': pages}, open(ROOT / 'data' / 'site-pages.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

    # ---- 페이지 엑셀 (첫 시트 = 키워드, 요약 시트 없음). 행 순서 = 엑셀 순서 ----
    wb = Workbook()
    ws = wb.active
    ws.title = '키워드'
    head = ['순번', '키워드', '우선순위', '지역', '상위지역', '지역단위', '단어', '수식어', 'URL', '오픈 묶음']
    ws.append(head)
    for p in pages:
        ws.append([p['n'], p['kw'], p['prio'], p['label'], places[p['place']]['parent'] or '', p['unit'], p['word'], p['mod'],
                   f"{SITE_URL}/{p['slug']}/", p['wave']])
    for c in ws[1]:
        c.font = Font(bold=True, color='FFFFFF')
        c.fill = PatternFill('solid', fgColor='24272B')
        c.alignment = Alignment(horizontal='center')
    for col, w in zip('ABCDEFGHIJ', [7, 30, 9, 18, 12, 10, 13, 10, 60, 9]):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = 'A2'
    ws.auto_filter.ref = f'A1:J{len(pages) + 1}'
    wb.save(OUT_XLSX)

    sys.stdout.reconfigure(encoding='utf-8')
    c = Counter(p['wave'] for p in pages)
    acc = 0
    for w in sorted(c):
        acc += c[w]
        print(f'묶음 {w}: {c[w]} (누적 {acc}) {dict(Counter(p["unit"] for p in pages if p["wave"] == w))}')
    print('엑셀:', OUT_XLSX.name, len(pages), '행')


if __name__ == '__main__':
    main()
