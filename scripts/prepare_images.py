"""현장 사진 → public/img/f01~f11.webp(사이트) + .jpg(og 배경) + data/photos.json

  python -I scripts/prepare_images.py

원본: source/raw/30~40 (홈페이지 '작업사진' 게시판, 2026-07-30 업로드, 실제 촬영 사진 11장).
10~17(갤러리, 스톡·AI 의심), 28·50(AI 생성 의심 통 이미지), 배너·아이콘은 쓰지 않는다 — source/facts.md.
설명은 사진에 보이는 것만 적는다(장소·날짜는 원본에 없어서 쓰지 않음).
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'source' / 'raw'
OUT = ROOT / 'public' / 'img'

# (원본 번호, 무엇이 보이나, 종류: egi=EGI휀스 / perf=타공 패널 / prep=설치 전·중)
PHOTOS = [
    ('30', '고가도로 옆 부지에 강관 지주와 버팀대로 세운 타공 패널 가설울타리', 'perf'),
    ('31', '보도를 따라 길게 이어 세운 평판 EGI휀스', 'egi'),
    ('32', '흙바닥 부지 경계를 따라 세운 타공 패널 울타리와 위쪽 방진망', 'perf'),
    ('33', '비탈 위 부지 경계에 울타리 지주 파이프를 세우는 단계', 'prep'),
    ('34', '도로 옆 비탈 위에서 내려다본 울타리 설치 구간', 'prep'),
    ('35', '비탈면 아래 도로를 따라 이어진 EGI휀스', 'egi'),
    ('36', '낮은 기존 울타리를 따라 흙바닥을 고른 설치 전 구간', 'prep'),
    ('37', '지주에 EGI 패널을 붙이고 버팀대를 대는 설치 중 모습', 'prep'),
    ('38', '흙 비탈을 따라 세운 EGI휀스', 'egi'),
    ('39', '건물 옆 흙바닥 경계를 따라 세운 EGI휀스', 'egi'),
    ('40', '콘크리트 바닥 부지 둘레에 세운 EGI휀스와 출입 통제용 라바콘', 'egi'),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    items = []
    for i, (no, scene, kind) in enumerate(PHOTOS, 1):
        src = next(RAW.glob(f'{no}_*.jpg'))
        im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
        im.thumbnail((1400, 1400), Image.LANCZOS)
        pid = f'f{i:02d}'
        im.save(OUT / f'{pid}.webp', 'WEBP', quality=72, method=6)
        og = im.copy(); og.thumbnail((1200, 1200), Image.LANCZOS)
        og.save(OUT / f'{pid}.jpg', 'JPEG', quality=78, optimize=True)
        items.append(dict(id=pid, src=src.name, scene=scene, kind=kind, w=im.width, h=im.height))
    json.dump({'photos': items}, open(ROOT / 'data' / 'photos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('사진', len(items))


if __name__ == '__main__':
    main()
