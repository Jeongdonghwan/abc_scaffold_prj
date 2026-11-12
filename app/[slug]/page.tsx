import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, PLACES, getPage, pagePath, pageEncodedPath, hubPath, hubEncodedPath, related } from '../../lib/data';
import { compose, placeLabel, COMPARE } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { Actions, IconArrow, JsonLd, SectionHead, Photo, ScaffoldFig } from '../../components/Common';

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

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const P = PLACES[p.place];
  const H = p.hub ? PLACES[p.hub] : null;
  const rel = related(p);
  const path = pageEncodedPath(p);
  const relList = [...rel.samePlace, ...rel.sameHub, ...rel.other].map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));
  const hero = c.photos.items[0].p;

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

      <section className="khero">
        <div className="wrap khero-in">
          <div className="khero-text">
            <nav className="crumbs" aria-label="경로">
              <Link href="/">홈</Link><span>/</span><Link href="/area/">작업 지역</Link>
              {p.hub && <><span>/</span><Link href={hubPath(p.hub)}>{PLACES[p.hub].name}</Link></>}
            </nav>
            <h1><span><i>{c.h1[0]}</i></span>{c.h1[1] && <span><i className="hl">{c.h1[1]}</i></span>}</h1>
            <p className="hero-lead">{c.lead}</p>
            <Actions dark />
          </div>
          <figure className="khero-vis">
            {c.fence
              ? <Photo id={hero.id} alt={`${p.kw} 참고 - ${hero.scene}`} className="khero-ph" lazy={false} />
              : <ScaffoldFig kind={p.service === '시스템' ? 'system' : 'pipe'} />}
          </figure>
        </div>
      </section>

      <div className="wrap">
        <section className="answer" aria-label="요약" data-reveal>
          <p>{c.answer}</p>
          <dl>{c.summary.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>
      </div>

      <section className="sec">
        <div className="wrap">
          <SectionHead title={c.region.heading} />
          <div className="split">
            <div className="prose" data-reveal>{c.region.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
            <dl className="info" data-reveal>{c.region.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <SectionHead title={c.type.heading} />
          <div className="split">
            <div className="prose" data-reveal>
              {c.type.paras.map((t, i) => <p key={i}>{t}</p>)}
              <h3>{placeLabel(P)}에서 맞는 현장</h3>
              <ul className="sq">{c.type.fits.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <dl className="spec" data-reveal>{c.type.parts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
          {c.compare && (
            <div className="table-wrap" data-reveal>
              <table className="cmp">
                <caption>강관비계와 시스템비계</caption>
                <thead><tr><th scope="col">항목</th><th scope="col">강관비계</th><th scope="col">시스템비계</th></tr></thead>
                <tbody>{COMPARE.map(([k, a, b]) => <tr key={k}><th scope="row">{k}</th><td>{a}</td><td>{b}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead title={c.mod.heading} sub={c.mod.intro} />
          <ol className="checks reveal-group">{c.mod.items.map((x) => <li key={x}>{x}</li>)}</ol>
        </div>
      </section>

      <section className="band-y" data-reveal>
        <div className="wrap band-y-in">
          <p>{c.band}</p>
          <Actions sms={false} />
        </div>
      </section>

      <section className="sec dark">
        <div className="wrap">
          <SectionHead title={c.photos.heading} sub={c.photos.sub} />
          <div className={`shots n${c.photos.items.length}`}>
            {c.photos.items.map(({ p: ph, caption }, i) => (
              <figure key={ph.id} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="ph"><Photo id={ph.id} alt={`${BRAND} 현장 - ${ph.scene}`} /></div>
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="more-line"><Link href="/work/" className="btn-text">현장 사진 전체 <IconArrow /></Link></p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead title={c.stepsHeading} />
          <ol className="timeline reveal-group">{c.steps.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap narrow">
          <SectionHead title={c.care.heading} />
          <div className="prose" data-reveal>{c.care.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
          <h3 className="h3-sub">{c.tips.heading}</h3>
          <ul className="sq" data-reveal>{c.tips.items.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </section>

      <section className="sec" id="faq">
        <div className="wrap narrow">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <SectionHead title={`${p.kw} 관련 안내`} />
          <div className="related">
            {rel.samePlace.length > 0 && <div><h3>{placeLabel(P)} 다른 안내</h3><ul>{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.sameHub.length > 0 && H && <div><h3>{H.name} 다른 동네</h3><ul>{rel.sameHub.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            <div><h3>다른 지역</h3><ul>
              {rel.other.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}
              <li><Link href={p.hub ? hubPath(p.hub) : '/area/'}>{H ? `${H.name} 안내 전체` : '작업 지역 전체'}<IconArrow /></Link></li>
            </ul></div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Actions dark />
        </div>
      </section>
    </main>
  );
}
