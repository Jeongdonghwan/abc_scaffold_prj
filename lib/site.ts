// 사이트 설정 — 연락처·도메인은 이 파일만 고치면 전 페이지에 반영된다.
// 근거: source/facts.md (홈페이지 01040145719.m7114.kr 수집, 2026-11-12). 상호는 사용자 지정 '에이비씨산업개발'
//   (홈페이지 상호 '경기비계'는 사용자 확인 전이라 쓰지 않는다).

// 도메인 미정 — 임시로 로컬 미리보기 주소. 배포: bash scripts/deploy.sh <묶음> <https://도메인>
export const SITE_URL = process.env.SITE_URL || 'https://xn--h49al71ajsb4wdo4h70adc49p.kr';
export const BRAND = '에이비씨산업개발';
export const LEGAL_NAME = '(주)에이비씨산업개발';
export const SITE_NAME = `${BRAND} | 서울·파주·김포 비계·시스템비계·EGI휀스`;

export const CONTACT = {
  phone: '010-4014-5719', // 홈페이지 푸터 '대표번호'
  hours: '', // TODO 영업시간 — 홈페이지에 없음. 비어 있으면 푸터·JSON-LD에서 빠진다
};

export const BUSINESS = {
  // TODO 주소 — 홈페이지 오시는길 지도 주소가 비어 있음. facts.md 의 네이버 플레이스(1407929183)는 다른 업체로 보여 쓰지 않음
  address: '',
  bizNumber: '',
};

export const AREA_LINE = '서울 25개 구 · 파주 · 김포';
export const WORKS_LINE = '비계 · 시스템비계 · 이지아이휀스(EGI휀스) · 방음벽';

// 순차 오픈: 이 묶음 이하의 페이지만 빌드·사이트맵·내부링크에 포함된다 (1~4 = 25~100%, 5~ = 추가 묶음)
export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 1);
export const UPDATED = '2026-11-24'; // content revision date - bump when page text changes

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const smsHref = `sms:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const absUrl = (path: string) => `${SITE_URL}${path}`;

// og·트위터 카드: public/og/<key>.jpg (scripts/make_og.py 로 생성)
export const shareMeta = (key: string, alt: string, o: { title?: string; description?: string; url?: string } = {}) => {
  const images = [{ url: `${SITE_URL}/og/${encodeURIComponent(key)}.jpg`, width: 1200, height: 630, alt }];
  return {
    openGraph: { type: 'website' as const, siteName: BRAND, locale: 'ko_KR', ...o, images },
    twitter: { card: 'summary_large_image' as const, title: o.title, description: o.description, images },
  };
};

// 서치어드바이저(네이버)·서치콘솔(구글) HTML 태그 소유확인 — content 값만 (TODO: 도메인 확정 후 받기)
export const NAVER_VERIFY = 'ca6e8a82ea49272edbf5e73407a771e4cbe19baf';
export const GOOGLE_VERIFY = 'KVFCLa4eJ-gLFArUK2GUjAJ9oiGdlR2MeAUajewhqYE';
