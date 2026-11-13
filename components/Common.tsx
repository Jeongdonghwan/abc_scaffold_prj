// 공통 UI — 흰 헤더 + 사진 히어로 + 오렌지 강조(참고: web_Agency references/construction), 각진 버튼, 선 아이콘, 섹션 번호 없음.
import Link from 'next/link';
import { BRAND, LEGAL_NAME, CONTACT, BUSINESS, AREA_LINE, WORKS_LINE, tel, smsHref } from '../lib/site';
import { PHOTOS, STOCK } from '../lib/data';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />)}</>
);

export const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M4 12h15M13 6l6 6-6 6" size={16} />;

// 주 행동(전화) 노랑 슬랩 1개 + 보조 밑줄 링크
export const Actions = ({ sms = true, dark = false }: { sms?: boolean; dark?: boolean }) => (
  <div className={dark ? 'actions on-dark' : 'actions'}>
    <a className="btn-primary" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
    {sms && <a className="btn-text" href={smsHref}><IconMsg /><span>현장 사진 문자로 보내기</span><IconArrow /></a>}
  </div>
);

export const Photo = ({ id, alt, className, lazy = true }: { id: string; alt: string; className?: string; lazy?: boolean }) => {
  const p = [...PHOTOS, ...STOCK].find((x) => x.id === id)!;
  return <img src={`/img/${id}.webp`} alt={alt} width={p.w} height={p.h} className={className} loading={lazy ? 'lazy' : undefined} />;
};

// 섹션 머리 — 가운데 정렬, 위에 영문 한 단어(선택), 아래 짧은 선이 그려지며 등장
export const SectionHead = ({ title, sub, en, left }: { title: string; sub?: string; en?: string; left?: boolean }) => (
  <header className={left ? 'sh left' : 'sh'} data-reveal>
    {en && <span className="sh-en" aria-hidden="true">{en}</span>}
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

const Mark = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
    <rect width="34" height="34" fill="#e4521b" />
    <path d="M9 6v22M17 6v22M25 6v22M6 12h22M6 22h22" stroke="#fff" strokeWidth="2.4" fill="none" />
  </svg>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo" aria-label={`${BRAND} 홈`}>
        <Mark />
        <span className="logo-text"><b>{BRAND}</b><small>{WORKS_LINE}</small></span>
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/area/" className="hide-m">작업 지역</Link>
        <Link href="/work/" className="hide-m">현장 사진</Link>
        <Link href="/blog/" className="hide-m">블로그</Link>
        <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span>{CONTACT.phone}</span></a>
      </nav>
    </div>
  </header>
);

// 주소·영업시간은 값이 있을 때만 (lib/site.ts)
export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div className="foot-about">
        <Link href="/" className="logo"><Mark /><span className="logo-text"><b>{BRAND}</b><small>{LEGAL_NAME}</small></span></Link>
        <p>{WORKS_LINE} 설치·해체<br />작업 지역 {AREA_LINE}</p>
      </div>
      <nav className="foot-nav" aria-label="바닥 메뉴">
        <strong>메뉴</strong>
        <Link href="/area/">작업 지역</Link><Link href="/work/">현장 사진</Link><Link href="/blog/">블로그</Link><a href="/rss.xml">RSS</a>
      </nav>
      <dl className="foot-info">
        <div><dt>상호</dt><dd>{LEGAL_NAME}</dd></div>
        <div><dt>전화</dt><dd><a href={tel}>{CONTACT.phone}</a></dd></div>
        {BUSINESS.address && <div><dt>주소</dt><dd>{BUSINESS.address}</dd></div>}
        {CONTACT.hours && <div><dt>영업시간</dt><dd>{CONTACT.hours}</dd></div>}
        {BUSINESS.bizNumber && <div><dt>사업자</dt><dd>{BUSINESS.bizNumber}</dd></div>}
      </dl>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {LEGAL_NAME} · 상담 때 받은 주소·사진은 현장 확인과 견적에만 씁니다.</div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />{CONTACT.phone}</a>
    <a href={smsHref} className="sb-sms"><IconMsg />사진 문자</a>
  </div>
);

// 허브·블로그·404 공통 상단 — 쿨그레이 띠(경로·제목) + 오른쪽 현장 사진이 띠 아래로 걸침
export const PageTop = ({ photo, alt, children }: { photo: string; alt: string; children: React.ReactNode }) => (
  <section className="ptop">
    <div className="wrap ptop-in">
      <div className="ptop-text">{children}</div>
      <figure className="ptop-ph mask"><Photo id={photo} alt={alt} lazy={false} /></figure>
    </div>
  </section>
);
