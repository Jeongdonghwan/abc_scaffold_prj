import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES, PLACES, PHOTOS, openHubs, hubPath, pagePath, pageEncodedPath, getPage } from '../lib/data';
import { COMPARE } from '../lib/compose';
import { getPosts, postPath } from '../lib/blog';
import { BRAND, AREA_LINE, shareMeta } from '../lib/site';
import { faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { Actions, IconArrow, JsonLd, Photo, SectionHead, Svg } from '../components/Common';

const HOME_TITLE = `${BRAND} | 서울·파주·김포 비계·시스템비계·EGI휀스`;
const HOME_DESC = '서울 25개 구·파주·김포 비계 설치·해체, 시스템비계, EGI휀스·공사장 방음벽 설치·철거. 직접 시공, 현장 확인 뒤 견적.';
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 비계·EGI휀스`, { title: HOME_TITLE, description: HOME_DESC, url: '/' }),
};

// 홈페이지 '주요업무' 4가지 (source/facts.md, raw/50 문구를 사실만 남겨 다시 씀)
const WORKS = [
  { t: '비계', en: 'SCAFFOLD', icon: 'M5 3v18M12 3v18M19 3v18M3 8h18M3 15h18M5 15l7-7', d: '건축·리모델링·외벽공사 현장에 맞춰 비계를 설계하고 설치·해체합니다. 좁은 골목과 모양이 복잡한 외벽은 강관비계로 짭니다.', parts: '기둥 · 띠장 · 작업발판 · 안전난간 · 벽이음', slug: '서울-비계' },
  { t: '시스템비계', en: 'SYSTEM', icon: 'M5 4v16M19 4v16M5 9h14M5 15h14M5 9l14 6', d: '규격 부재를 핀으로 끼워 조립하는 시스템비계를 현장에 맞춰 설계·시공합니다. 신축·중고층 외벽처럼 넓은 면에 씁니다.', parts: '수직재 · 수평재 · 가새재 · 잭베이스', slug: '서울-시스템비계' },
  { t: '이지아이휀스', en: 'EGI FENCE', icon: 'M3 6h18v11H3zM9 6v11M15 6v11M3 21h18', d: '공사장 경계에 아연도금 강판 패널을 세워 출입을 막고 분진과 공사 장면을 가립니다. 설치와 철거를 함께 맡습니다.', parts: 'EGI 패널 · 지주 파이프 · 버팀대 · 출입문', slug: '서울-이지아이휀스' },
  { t: '방음벽', en: 'NOISE WALL', icon: 'M4 4h16v16H4zM4 9h16M4 14h16M9 4v5M15 9v5M9 14v6', d: '도심 공사장 소음을 줄이는 방음벽을 세우고 공사가 끝나면 해체합니다. 주거지·학교와 붙은 현장에서 검토합니다.', parts: '방음 패널 · 지주 · 버팀대', slug: '' },
];

const FLOW = [
  { t: '현장 확인', d: '주소와 사진으로 건물 높이, 외벽 모양, 부지 경계와 바닥, 자재 차량 댈 곳을 봅니다.' },
  { t: '방식 결정', d: '강관비계·시스템비계, 울타리 패널과 고정 방식, 출입문 위치를 정하고 항목별로 견적을 드립니다.' },
  { t: '설치', d: '숙련 인력이 직접 세웁니다. 비계는 벽이음으로 건물에, 울타리는 지주와 버팀대로 바닥에 고정합니다.' },
  { t: '점검', d: '발판·난간·고정 상태를 확인한 뒤 공사 측에 넘기고, 공사 중 일정 변경도 맞춥니다.' },
  { t: '해체·반출', d: '공사가 끝나면 차례로 해체하고 자재를 반출한 뒤 현장 바닥을 정리합니다.' },
];

const FAQ = [
  { q: '어느 지역까지 하나요?', a: `${AREA_LINE} 현장을 맡습니다. 주소를 알려 주시면 현장 확인 일정을 잡습니다.` },
  { q: '견적은 어떻게 받나요?', a: '현장 주소와 건물 외벽(또는 부지 경계) 사진을 보내 주세요. 현장을 확인한 뒤 설치·기간·해체·운반을 나눠 견적을 드립니다. 정해진 단가표는 쓰지 않습니다.' },
  { q: '강관비계와 시스템비계는 어떻게 고르나요?', a: '좁은 골목, 모양이 복잡한 외벽, 저층 보수는 강관비계가, 넓고 반듯한 외벽이나 신축·중고층은 시스템비계가 맞는 경우가 많습니다. 현장을 보고 섞어 쓰기도 합니다.' },
  { q: 'EGI휀스는 흙바닥에도 세우나요?', a: '흙바닥은 지주를 박아 세우고, 콘크리트·아스팔트 바닥은 앵커나 받침으로 고정합니다. 비탈진 부지도 버팀대 위치를 맞춰 세웁니다.' },
  { q: '비계와 울타리를 같이 맡길 수 있나요?', a: '네. 외벽 비계와 부지 둘레 이지아이휀스·방음벽을 한 번에 일정 잡을 수 있습니다.' },
];

// 한 페이지에 같은 사진 두 번 안 씀: 히어로 f02 · 히어로 아래 띠 4장 · 소개 f11·f08 · 나머지는 레일
const STRIP = ['f01', 'f06', 'f09', 'f10'];
const USED = ['f02', 'f11', 'f08', ...STRIP];

export default function Home() {
  const hubs = openHubs();
  const posts = getPosts().slice(0, 4);
  const carousel = OPEN_PAGES.filter((p) => !p.mod).slice(0, 30);
  const seoul = hubs.filter((h) => PLACES[h].parent === '서울');
  const gyeonggi = hubs.filter((h) => PLACES[h].parent !== '서울');

  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(carousel.map((p) => ({ name: p.kw, path: pageEncodedPath(p) })))]} />

      <section className="hhero">
        <figure className="hhero-bg"><Photo id="f02" alt={`${BRAND} 현장 - 보도를 따라 길게 세운 EGI휀스`} lazy={false} /></figure>
        <div className="wrap hhero-in">
          <p className="hero-en" aria-hidden="true">SCAFFOLD · FENCE · NOISE WALL</p>
          <h1><span><i>비계 · 시스템비계</i></span><span><i>EGI휀스 · 방음벽</i></span></h1>
          <p className="hero-lead">건축·리모델링·외벽공사 현장의 비계 설계와 설치·해체, 공사장 이지아이휀스와 방음벽 설치·철거. {BRAND}이 직접 시공합니다.</p>
          <Actions dark />
        </div>
        <ul className="hero-foot">
          {STRIP.map((id) => { const x = PHOTOS.find((y) => y.id === id)!; return <li key={id}><Photo id={id} alt={`${BRAND} 현장 - ${x.scene}`} /></li>; })}
        </ul>
      </section>

      <section className="sec dark">
        <div className="wrap">
          <div className="rail-head">
            <SectionHead left en="PROJECTS" title="직접 세운 울타리 현장" sub="작업사진 게시판에 올린 이지아이휀스·가설울타리 현장입니다." />
            <div className="rail-btns">
              <button type="button" data-scroll="-1" data-target="home-rail" aria-label="이전 사진"><Svg d="M20 12H5M11 6l-6 6 6 6" /></button>
              <button type="button" data-scroll="1" data-target="home-rail" aria-label="다음 사진"><Svg d="M4 12h15M13 6l6 6-6 6" /></button>
            </div>
          </div>
          <ul className="rail" id="home-rail">
            {PHOTOS.filter((x) => !USED.includes(x.id)).map((x) => (
              <li key={x.id}><figure className="pcard"><div className="ph"><Photo id={x.id} alt={`${BRAND} 현장 - ${x.scene}`} /></div><figcaption>{x.scene}</figcaption></figure></li>
            ))}
          </ul>
          <p className="more-line"><Link href="/work/" className="btn-text">사진 11장 모두 보기 <IconArrow /></Link></p>
        </div>
      </section>

      <section className="sec about">
        <div className="wrap about-grid">
          <div className="about-ph" data-reveal>
            <figure className="about-main mask"><Photo id="f11" alt={`${BRAND} 현장 - 콘크리트 바닥 부지 둘레에 세운 EGI휀스`} /></figure>
            <figure className="about-sub"><Photo id="f08" alt={`${BRAND} 현장 - 지주에 EGI 패널을 붙이는 설치 중 모습`} /></figure>
          </div>
          <div className="about-text" data-reveal>
            <SectionHead left en="ABOUT" title="세우는 날부터 걷는 날까지" />
            <p>{BRAND}은 외벽 공사용 비계와 공사장 둘레 가설울타리를 직접 세우고 걷는 시공 업체입니다. 현장 확인, 방식 결정, 설치, 점검, 해체·반출까지 같은 사람이 봅니다.</p>
            <dl className="about-list">
              <div><dt>비계</dt><dd>설계 · 설치 · 해체</dd></div>
              <div><dt>시스템비계</dt><dd>맞춤 설계 · 시공</dd></div>
              <div><dt>이지아이휀스</dt><dd>설치 · 철거</dd></div>
              <div><dt>방음벽</dt><dd>설치 · 해체</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <SectionHead en="BUSINESS" title="맡는 일" sub="외벽 비계와 공사장 울타리, 두 가지 가설 공사를 함께 맡습니다." />
          <ul className="works">
            {WORKS.map((w, i) => {
              const pg = w.slug ? getPage(w.slug) : undefined;
              return (
                <li key={w.t} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="works-ic"><Svg d={w.icon} size={30} /></span>
                  <span className="works-en">{w.en}</span>
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                  <span className="works-parts">{w.parts}</span>
                  {pg && <Link href={pagePath(pg)} className="works-go">{pg.kw} 안내 <IconArrow /></Link>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="sec">
        <div className="wrap narrow">
          <SectionHead en="COMPARE" title="강관비계와 시스템비계" sub="같은 비계라도 짜는 방식이 다릅니다. 현장 모양과 높이로 고릅니다." />
          <div className="table-wrap" data-reveal>
            <table className="cmp">
              <caption>구조 비교</caption>
              <thead><tr><th scope="col">항목</th><th scope="col">강관비계</th><th scope="col">시스템비계</th></tr></thead>
              <tbody>{COMPARE.map(([k, a, b]) => <tr key={k}><th scope="row">{k}</th><td>{a}</td><td>{b}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead en="PROCESS" title="진행 순서" />
          <ol className="timeline reveal-group">{FLOW.map((f) => <li key={f.t}><strong>{f.t}</strong><p>{f.d}</p></li>)}</ol>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <SectionHead en="AREA" title="작업 지역" sub={AREA_LINE} />
          <div className="areas">
            <div data-reveal>
              <h3>서울</h3>
              <ul className="area-grid">{seoul.map((h) => <li key={h}><Link href={hubPath(h)}>{PLACES[h].name}<IconArrow /></Link></li>)}</ul>
            </div>
            <div data-reveal>
              <h3>경기</h3>
              <ul className="area-big">{gyeonggi.map((h) => <li key={h}><Link href={hubPath(h)}><b>{PLACES[h].name}</b><span>{PLACES[h].traits}</span><IconArrow /></Link></li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap narrow">
          <SectionHead en="FAQ" title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="sec alt">
          <div className="wrap">
            <SectionHead en="BLOG" title="비계·울타리 이야기" />
            <ul className="linklist">{posts.map((p) => <li key={p.slug}><Link href={postPath(p)}>{p.title}<IconArrow /></Link></li>)}</ul>
            <p className="more-line"><Link href="/blog/" className="btn-text">블로그 전체 <IconArrow /></Link></p>
          </div>
        </section>
      )}

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>공사 일정과 현장 주소를 알려 주세요</h2>
          <p>현장 주소와 외벽·부지 사진을 보내 주시면 비계 종류와 울타리 길이부터 짚어 드립니다. 시작일과 끝나는 예정일에 맞춰 설치일과 해체일을 함께 잡습니다.</p>
          <Actions />
        </div>
      </section>
    </main>
  );
}
