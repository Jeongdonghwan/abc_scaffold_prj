"""오픈일이 정해지면 블로그 45편의 공개일(date·publishedAt)을 채운다 — 하루 1편·2편 번갈아(30일 45편).

  python -I scripts/drip/schedule_posts.py 2026-12-01            # 글 파일 + 큐 + data/drip.json launch 갱신
  python -I scripts/drip/schedule_posts.py 2026-12-01 --dry-run  # 날짜표만 출력

순서 = content/blog/_data/keywordQueue.json 의 done 항목 순서(비계·울타리·견적 주제가 섞여 있음).
날짜 규칙은 drip_status.py 의 postsPerDay 1.5 와 같다: k번째 날 floor((k+1)*1.5) - floor(k*1.5) 편.
lib/blog.ts 는 date 가 빌드일(KST)보다 미래인 글을 목록·sitemap·rss 에서 빼므로, 채워 두면 날짜가 되는 날 빌드에 자동으로 들어간다.
이미 날짜가 있는 글도 새 오픈일 기준으로 다시 쓴다(오픈일이 바뀌면 다시 돌리면 됨).
"""
import datetime as dt, json, math, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
BLOG = ROOT / 'content' / 'blog'
QUEUE = BLOG / '_data' / 'keywordQueue.json'
DRIP = ROOT / 'data' / 'drip.json'


def plan(launch, n, per_day=1.5):
    out, k = [], 0
    while len(out) < n:
        cnt = math.floor((k + 1) * per_day) - math.floor(k * per_day)
        out += [launch + dt.timedelta(days=k)] * cnt
        k += 1
    return out[:n]


def set_date(text, d):
    for key in ('date', 'publishedAt'):
        text, c = re.subn(rf'^{key}:.*$', f'{key}: {d}', text, count=1, flags=re.M)
        assert c == 1, key
    return text


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        sys.exit(__doc__)
    launch = dt.date.fromisoformat(args[0])
    dry = '--dry-run' in sys.argv
    q = json.loads(QUEUE.read_text(encoding='utf-8'))
    items = [x for x in q['queue'] if x['status'] == 'done' and x.get('publishedSlug')]
    dates = plan(launch, len(items))
    for x, d in zip(items, dates):
        f = BLOG / f"{x['publishedSlug']}.md"
        print(d, f.stem)
        if dry:
            continue
        f.write_text(set_date(f.read_text(encoding='utf-8'), d.isoformat()), encoding='utf-8', newline='\n')
        x['publishedAt'] = d.isoformat()
    if dry:
        return
    QUEUE.write_text(json.dumps(q, ensure_ascii=False, indent=1), encoding='utf-8', newline='\n')
    cfg = json.loads(DRIP.read_text(encoding='utf-8'))
    cfg['launch'] = launch.isoformat()
    DRIP.write_text(json.dumps(cfg, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    print(f'{len(items)}편 {dates[0]} ~ {dates[-1]}, data/drip.json launch = {launch}')


if __name__ == '__main__':
    d = plan(dt.date(2026, 12, 1), 45)
    assert len(d) == 45 and d[0] == d[0] and d.count(dt.date(2026, 12, 1)) == 1 and d.count(dt.date(2026, 12, 2)) == 2
    assert d[-1] == dt.date(2026, 12, 30)
    assert set_date('date:\npublishedAt:\n', '2026-12-01') == 'date: 2026-12-01\npublishedAt: 2026-12-01\n'
    main()
