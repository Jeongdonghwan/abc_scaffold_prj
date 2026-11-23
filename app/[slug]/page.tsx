import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, PLACES, getPage, pagePath, pageEncodedPath, hubPath, hubEncodedPath, related, heroFor } from '../../lib/data';
import { compose, placeLabel } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { Actions, IconArrow, JsonLd, Photo } from '../../components/Common';

export const dynamicParams = false;

// 순차 오픈: lib/site.ts 의 OPEN_WAVE 이하 페이지만 생성
export function generateStaticParams() {
  return OPEN_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
  const url = pageEncodedPath(p);
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    ...shareMeta(p.slug, `${p.kw} - ${BRAND}`, { title: c.title, description: c.description, url }),
  };
}

// 레이 모범 구조(2026-11-24): 분류 줄 → h1(키워드 + 수식어) → 설명 → 핵심 요약 → 번호 절 6개 → FAQ → 관련 링크
export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const P = PLACES[p.place];
  const H = p.hub ? PLACES[p.hub] : null;
  const rel = related(p);
  const path = pageEncodedPath(p);
  const hero = heroFor(p, c.photos.items.length);
  const groups = [
    { h: `${placeLabel(P)} 다른 안내`, items: rel.samePlace.slice(0, 5) },
    { h: H ? `${H.name} 다른 동네` : '', items: H ? rel.sameHub.slice(0, 4) : [] },
    { h: '다른 지역', items: rel.other.slice(0, 4) },
  ].filter((g) => g.items.length);
  const relList = groups.flatMap((g) => g.items).map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([
          { name: '홈', path: '/' },
          { name: '작업 지역', path: '/area/' },
          ...(p.hub ? [{ name: PLACES[p.hub].name, path: hubEncodedPath(p.hub) }] : []),
          { name: p.kw, path },
        ]),
        serviceJsonLd({ name: p.kw, type: c.svcName, description: c.description, path, area: P.admin }),
        faqJsonLd(c.faq),
        itemListJsonLd(relList.length ? relList : [{ name: '작업 지역', path: '/area/' }]),
      ]} />

      {/* 울타리 페이지 = 아래 사진 칸과 겹치지 않는 현장 사진, 비계 페이지 = 스톡 비계 사진(장면 설명 alt, 현장이라 부르지 않음) */}
      <section className="khero photo">
        <figure className="khero-bg"><Photo id={hero.id} alt={hero.alt} lazy={false} /></figure>
        <div className="wrap khero-in">
          <nav className="crumbs" aria-label="경로">
            <Link href="/">홈</Link><span>/</span><Link href="/area/">작업 지역</Link>
            {p.hub && <><span>/</span><Link href={hubPath(p.hub)}>{PLACES[p.hub].name}</Link></>}
          </nav>
          <div className="x-cat">{c.cat}</div>
          <h1><span><i>{p.kw}</i></span>{' '}<span className="hero-sub"><i>{c.h1sub}</i></span></h1>
          <p className="hero-lead">{c.lead}</p>
          <Actions dark />
        </div>
      </section>

      <div className="wrap x-grid">
        <div className="x-main">
          <section className="x-sum" data-reveal>
            <h2>{p.kw} 핵심 요약</h2>
            <p>{c.summary}</p>
            <dl>{c.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </section>
          <article className="x-article">
            {c.sections.map((x) => <section key={x.h}><h2>{x.h}</h2><p>{x.p}</p></section>)}
          </article>
          {c.photos.items.length > 0 && (
            <div className="x-photos">
              {c.photos.items.map((x) => <figure key={x.p.id}><Photo id={x.p.id} alt={`${p.kw} - ${x.caption}`} /></figure>)}
            </div>
          )}
          <section className="x-faq faq" id="faq">
            <h2>{p.kw} 자주 묻는 질문</h2>
            {c.faq.map((f) => <details key={f.q}><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}
          </section>
        </div>
        <aside className="x-side">
          <h3>바로 확인</h3>
          <dl>{c.facts.slice(1, 3).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <Actions />
        </aside>
      </div>

      <section className="sec">
        <div className="wrap related">
          {groups.map((g) => <div key={g.h}><h3>{g.h}</h3><ul>{g.items.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>)}
          {groups.length === 0 && <div><h3>작업 지역</h3><ul><li><Link href={p.hub ? hubPath(p.hub) : '/area/'}>{H ? `${H.name} 안내 전체` : '작업 지역 전체'}<IconArrow /></Link></li></ul></div>}
        </div>
      </section>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Actions />
        </div>
      </section>
    </main>
  );
}
