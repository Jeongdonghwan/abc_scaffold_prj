import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PLACES, openHubs, hubSlug, hubOfSlug, hubEncodedPath, hubPages, pagePath, pageEncodedPath, rotate, PHOTOS, Page } from '../../../lib/data';
import { placeLabel } from '../../../lib/compose';
import { breadcrumbJsonLd, itemListJsonLd } from '../../../lib/jsonld';
import { BRAND, shareMeta } from '../../../lib/site';
import { Actions, IconArrow, JsonLd, PageTop } from '../../../components/Common';

export const dynamicParams = false;
export function generateStaticParams() {
  return openHubs().map((h) => ({ hub: hubSlug(h) }));
}

export function generateMetadata({ params }: { params: { hub: string } }): Metadata {
  const h = hubOfSlug(params.hub);
  if (!h) return {};
  const H = PLACES[h];
  const title = `${H.name} 비계·시스템비계·EGI휀스 | ${BRAND}`;
  const description = `${H.name} 비계·시스템비계·이지아이휀스 지역 안내. ${H.traits}. 동네별 안내 페이지와 현장 사정을 모았습니다.`.slice(0, 158);
  const url = hubEncodedPath(h);
  return { title, description, alternates: { canonical: url }, ...shareMeta(`area-${hubSlug(h)}`, `${H.name} ${BRAND}`, { title, description, url }) };
}

const SVC_NAME: Record<string, string> = { 비계: '비계', 강관: '강관비계', 시스템: '시스템비계', egi: '이지아이휀스·EGI휀스', 울타리: '가설울타리' };

export default function Hub({ params }: { params: { hub: string } }) {
  const h = hubOfSlug(params.hub);
  if (!h) notFound();
  const H = PLACES[h];
  const pages = hubPages(h);
  // 지역(구·생활권·동)별로 묶는다
  const groups = new Map<string, Page[]>();
  for (const p of pages) { const a = groups.get(p.place) || []; a.push(p); groups.set(p.place, a); }
  const photo = rotate(PHOTOS, h, 'hub')[0];
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '작업 지역', path: '/area/' }, { name: H.name, path: hubEncodedPath(h) }]),
        itemListJsonLd(pages.slice(0, 60).map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <PageTop photo={photo.id} alt={`${BRAND} 현장 - ${photo.scene}`}>
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/area/">작업 지역</Link><span>/</span><span>{H.name}</span></nav>
        <h1 className="page-title">{H.name} 비계·EGI휀스</h1>
        <p className="page-lead">{H.traits}. {H.site}.</p>
        <Actions dark />
      </PageTop>
      <div className="wrap content">
        <section className="sec">
          <h2 className="h2-plain">{H.name} 현장 사정</h2>
          <dl className="info">
            <div><dt>행정구역</dt><dd>{H.admin}</dd></div>
            <div><dt>주요 건물</dt><dd>{H.homes}</dd></div>
            <div><dt>도로</dt><dd>{H.roads}</dd></div>
            <div><dt>대표 동네</dt><dd>{H.spots.join(' · ')}</dd></div>
            <div><dt>하는 일</dt><dd>비계 · 시스템비계 · 이지아이휀스 · 방음벽 설치·해체</dd></div>
          </dl>
        </section>
        <section className="sec">
          <h2 className="h2-plain">{H.name} 지역별 안내</h2>
          <div className="hub-groups">
            {Array.from(groups.entries()).map(([k, ps]) => (
              <div key={k} data-reveal>
                <h3>{placeLabel(PLACES[k])}</h3>
                <ul>{ps.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
              </div>
            ))}
          </div>
        </section>
        <section className="sec">
          <h2 className="h2-plain">{H.name}에서 하는 작업</h2>
          <ul className="sq">{Array.from(new Set(pages.map((p) => p.service))).map((s) => <li key={s}>{H.name} {SVC_NAME[s]} — 설치부터 해체까지 {BRAND}이 직접</li>)}</ul>
        </section>
      </div>
    </main>
  );
}
