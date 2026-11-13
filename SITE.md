# 에이비씨산업개발 SEO 사이트 — 기획·운영

(주)에이비씨산업개발 비계·시스템비계·이지아이휀스(EGI휀스)·방음벽 지역 SEO 사이트. Next.js 14 정적 export.
코드 구조는 woori_prj(우리배관설비)를 그대로 따르고(키워드 조합기·OPEN_WAVE·블로그 날짜 공개·deploy·og·drip), 디자인은 새 템플릿.
키워드 원본 `keywords/(주)에이비씨산업개발_키워드.xlsx`(region_kw_prj 에서 복사) 12,774행 중 **생성 대상 = O 2,000행**이 페이지.

## 구조
| 경로 | 내용 |
|---|---|
| `/` | 메인: 사진 전면 히어로(EGI휀스 사진 + 아래 작업·지역·견적 띠) · 소개 2단(큰 사진+걸친 사진) · 맡는 일 카드 4장 · 강관/시스템비계 비교표 · 현장 사진 가로 레일 · 진행 순서 · 작업 지역 · FAQ · 블로그 · 오렌지 마무리 띠 |
| `/<키워드>/` | 키워드 페이지 2,000 (슬러그 = 엑셀 '슬러그' 열) |
| `/area/`, `/area/<구·시>/` | 작업 지역 허브 27곳(서울 25개 구 · 파주 · 김포). 허브가 그 구·시의 열린 페이지 전부로 가는 크롤 경로. 서울 전체 키워드는 `/area/` 에 |
| `/work/` | 현장 사진 11장(홈페이지 작업사진 게시판 30~40번) |
| `/blog/`, `/blog/<슬러그>/` | 블로그 45편 `content/blog/*.md` — **date 비어 있음 = 비공개**. 공개일이 정해지면 `schedule_posts.py` |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml` | 열린 묶음 페이지만 |

## 데이터·스크립트
```bash
python -I scripts/places_src.py       # 엑셀 '지역목록' + 구·시 사실 → data/places.json (311곳: 시 3 · 구 25 · 생활권 14 · 동 269)
python -I scripts/build_pages.py      # 엑셀 → data/site-pages.json + keywords/에이비씨산업개발_키워드_페이지.xlsx
python -I scripts/build_pages.py --extra 400,400   # 오픈 뒤 추가: O 아닌 행을 엑셀 순서대로 400개씩 묶음 5·6
python -I scripts/prepare_images.py   # source/raw/30~40 → public/img/f01~f11.webp·.jpg + data/photos.json
python -I scripts/make_og.py          # 페이지별 og (public/og, 없는 것만, --force 전부)
OPEN_WAVE=4 SITE_URL=https://도메인 npx next build && rm -rf out/blog/_none
bash scripts/deploy.sh <묶음> <https://도메인>   # git remote(origin) 필요 — 아직 없음
python -I scripts/drip/drip_status.py data/drip.json        # 오늘 열 묶음·글 수 (launch null → WAVE=0 POST=0)
python -I scripts/drip/schedule_posts.py <YYYY-MM-DD>       # 오픈일 확정 시: 45편 date·publishedAt 하루 1·2편 번갈아 + drip.json launch
```
- 본문 조합기 `lib/compose.ts`: 서비스 5종(비계[비계·아시바·비계설치·비계임대] · 강관비계 · 시스템비계 · egi[이지아이휀스·EGI휀스] · 울타리[가설울타리·가설휀스]) × 수식어 5묶음(비용류·업체류·설치류·임대류·없음) × 지역 사실. 긴 문장마다 지역 이름을 넣고 슬러그 해시로 변형·현장 메모 15개 중 3~4개를 고른다.
- 추가 묶음: `build_pages.py --extra` 후 `data/drip.json` 의 `extra: [{"wave":5,"date":"YYYY-MM-DD"}]` (drip_status.py 가 지원).

## 오픈 묶음 (`OPEN_WAVE`, post-launch 7일 안 4묶음)
엑셀 순서(우선순위 순) 그대로 2,000행을 4등분.

| 묶음 | 페이지 | 누적 | 내용 |
|---|---|---|---|
| 1 | 500 | 25% | 서울 + 25개 구 기본·비용·업체류 (시·군 43 · 구 457) |
| 2 | 500 | 50% | 구 468 · 시·군 32 |
| 3 | 500 | 75% | 동 452 · 생활권 12 · 시·군 36 |
| 4 | 500 | 100% | 동 355 · 시·군 75 · 구 40 · 생활권 30 (강관비계·가설울타리 포함) |

`data/drip.json`: siteUrl 임시 `http://127.0.0.1:18990`, launch null → drip_status 가 WAVE=0 으로 처리(확인함).

## 사실 근거 (지어낸 수치 없음)
- `source/facts.md` — 홈페이지(01040145719.m7114.kr) 문구: 비계 설계·설치·해체, 시스템비계 맞춤 설계·시공, 이지아이휀스 설치·철거, 방음벽 설치·해체, 푸터 '가설임대', 전화 010-4014-5719
- 지역: 서울 25개 구·파주·김포(사용자 확정). 구·시 사실(`scripts/places_src.py`)은 도시 성격·건물·도로·대표 동네만, 숫자 없음. 동은 엑셀 행정동 원본 + 소속 구 사실
- 비계 구조(강관=파이프+클램프, 시스템=규격 부재+핀), EGI휀스 구성, 법규(산업안전보건기준에 관한 규칙의 작업발판·안전난간·벽이음, 도로점용 허가, 비산먼지 억제 시설)는 일반 사실만, 조항 번호·수치 없음
- 가격·기간·경력·건수·장비 대수 없음. "비용 = 현장 확인 뒤 항목별 견적"
- 사진: 30~40번 11장만(EGI휀스·타공 패널 울타리). 설명은 사진에 보이는 것만. 10~17(스톡/AI 의심)·28·50(AI 의심)·배너는 쓰지 않음. 비계 현장 사진이 없어 비계 페이지 히어로는 사진 없는 회색 글 머리(지어낸 선 도면은 2026-11-13 삭제)
- 상호는 '에이비씨산업개발'(법인명 (주)에이비씨산업개발). 홈페이지 상호 '경기비계'는 쓰지 않음

## 디자인 (2026-11-13 개편 — 종합 건설 기업형)
- 레퍼런스: `C:\side_Prj\web_Agency\public\references\construction\` (index·about·business·products·contact). 빌린 것 — 흰 헤더(메뉴 호버 오렌지 밑줄·오른쪽 전화), 사진 전면 히어로(왼쪽 어둡게·큰 흰 제목), 가운데 섹션 머리(영문 한 단어 + 큰 제목 + 부제), 소개 2단(큰 사진 + 걸친 작은 사진), 회색 바탕 흰 사업 카드(호버 시 떠오름·아래 오렌지 선·아이콘 칸 반전), 현장 가로 레일(←→ 버튼), 오렌지 가운데 마무리 띠, 짙은 3단 푸터, 서브 페이지 회색 머리. 참고 사이트의 스톡 사진·숫자 띠(연혁·실적 카운트)·배지·둥근 점 페이지네이션·인트로 화면은 쓰지 않음
- 색: 흰 + 짙은 `#1a1a1a` + 쿨그레이 `#eef0f2` + 오렌지 `#e4521b`(강조 1색, 흰 글씨 대비 때문에 참고 `#ff6b35` 보다 짙게). 베이지 없음
- 글꼴: Pretendard 800 제목(-0.03~-0.04em), 영문 한 단어 머리는 Pretendard 700 자간 .3em 오렌지, 본문 Pretendard
- 버튼: 오렌지 각진 슬랩(모서리 0, 짙은 와이프 호버, 전화번호가 글자) + 밑줄 텍스트 링크. 짙은 바탕에선 흰 와이프, 오렌지 띠 안에선 흰 슬랩
- 히어로: 메인 = 사진 전면(모바일은 사진 먼저, 글은 아래 짙은 바탕). 키워드 = 울타리 페이지는 사진 전면, 비계 페이지는 회색 글 머리. 아래 '답 먼저' 흰 상자가 겹침(오렌지 윗선). 허브·블로그·work = 회색 머리 + 오른쪽 사진이 아래로 걸침
- 키워드 페이지 표면 순서: 히어로 → 흰(지역) → 회색(방식) → 흰(확인 목록) → 짙은 띠 → 흰(현장 카드) → 회색(진행) → 흰(안전) → 회색(FAQ) → 흰(관련) → 오렌지 마무리
- 장치: 사업 카드, 사진 카드(사진 + 아래 글 상자), 사각 표시 확인 목록(번호 없음), 오렌지 진행선, 구 이름 칸 격자(호버 오렌지), 사진 커튼(소개 사진)
- 금지 지킴: 이모지, 알약 버튼, 라벨 칩, 숫자 띠, 섹션 번호, 지역명 마키, 메타 카피, 지어낸 도면·지도
- 파비콘: 오렌지 사각 + 흰 비계 격자 (app/icon.png · apple-icon.png · public/favicon.ico). og 이미지(public/og)는 예전 노랑 그대로 — 맞추려면 make_og.py ACCENT 바꾸고 `--force`

## 품질 게이트 (2026-11-13 디자인 개편 후 재확인, OPEN_WAVE=4)
- `check_all.py`: SEO 구조·중복 문서·AI 티·화면 버그 4항목 통과 (sitemap 2,031 URL, 파일 없는 URL 0, 페이지 문제 없음, 같은 문장 평균 7%, 본문 평균 1,659자)
- `pseo_lint.py out`: 바이그램 유사도 평균 0.46 (표본 20), 짧은 페이지 0, 조사·변수 누수 0
- `design_lint.py out`: 경고 0
- 390px·1366px 스크린샷(로컬 http + Playwright): 홈·키워드(종로-비계, 김포-이지아이휀스-비용)·area·허브(종로)·work·blog 가로 넘침 0 (모바일 진행선이 5px 넘치던 것 고침)
- 블로그 45편 `validate_posts.py` 통과(날짜를 채운 복사본으로 검사, 내부링크는 `content/blog/_data/known_paths.txt` = 1묶음 오픈 때 열린 경로만)

## 로컬 미리보기
```bash
OPEN_WAVE=4 npx next build && rm -rf out/blog/_none
python -m http.server 18990 --bind 127.0.0.1 --directory out   # http://127.0.0.1:18990/  (file:// 은 CSS 경로가 깨짐)
```

## 사용자 확인 필요
- [ ] 상호 표기: '에이비씨산업개발'로 썼음. 홈페이지 상호 '경기비계'를 함께 쓸지
- [ ] 주소·영업시간 — 홈페이지에 없음. facts.md 의 네이버 플레이스(1407929183, 파주 조리읍·031-994-2251)는 '크레인'·스카이차 업체로 보여 쓰지 않음. 확인되면 `lib/site.ts` BUSINESS.address·CONTACT.hours (비어 있으면 푸터·JSON-LD에서 빠짐)
- [ ] 비계 현장 사진 — 지금 사진 11장은 모두 울타리. 비계·시스템비계·방음벽 현장 사진을 받으면 히어로 도면 대신 사진
- [ ] 도메인 → `lib/site.ts` SITE_URL, `scripts/build_pages.py` SITE_URL, `data/drip.json` siteUrl
- [ ] 오픈일 → `python -I scripts/drip/schedule_posts.py <날짜>` (블로그 45편 날짜 + drip.json launch)
- [ ] 서치어드바이저·서치콘솔 소유확인 코드 → `lib/site.ts` NAVER_VERIFY·GOOGLE_VERIFY
- [ ] GitHub 저장소(deploy 브랜치용 remote)
- [ ] 사업자등록번호, 가설재 임대(푸터 '가설임대')를 실제로 따로 하는지
