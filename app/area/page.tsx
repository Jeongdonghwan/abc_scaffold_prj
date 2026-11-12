import type { Metadata } from 'next';
import Link from 'next/link';
import { PLACES, openHubs, hubPath, hubEncodedPath, OPEN_PAGES, pagePath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { BRAND, AREA_LINE, shareMeta } from '../../lib/site';
import { Actions, IconArrow, JsonLd, PageTop } from '../../components/Common';

const TITLE = `작업 지역 — 서울 25개 구·파주·김포 | ${BRAND}`;
const DESC = `${BRAND} 비계·시스템비계·이지아이휀스 작업 지역. 서울 25개 구와 파주·김포의 구·시별 현장 사정과 지역별 안내 페이지를 모았습니다.`;
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/area/' },
  ...shareMeta('area', `${BRAND} 작업 지역`, { title: TITLE, description: DESC, url: '/area/' }),
};

export default function AreaIndex() {
  const hubs = openHubs();
  const seoul = OPEN_PAGES.filter((p) => !p.hub);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '작업 지역', path: '/area/' }]),
        itemListJsonLd(hubs.map((h) => ({ name: `${PLACES[h].name} 비계·EGI휀스`, path: hubEncodedPath(h) }))),
      ]} />
      <PageTop photo="f06" alt={`${BRAND} 현장 - 비탈면 아래 도로를 따라 이어진 EGI휀스`}>
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>작업 지역</span></nav>
        <h1 className="page-title">작업 지역</h1>
        <p className="page-lead">{AREA_LINE}. 구·시마다 골목 폭, 건물 높이, 부지 바닥이 달라 쓰는 비계와 울타리 방식도 달라집니다.</p>
      </PageTop>
      <div className="wrap content">
        <section className="sec">
          <h2 className="h2-plain">구·시별 안내</h2>
          <ul className="hub-list">
            {hubs.map((h) => (
              <li key={h} data-reveal>
                <Link href={hubPath(h)}>
                  <b>{PLACES[h].name}</b>
                  <span>{PLACES[h].traits}</span>
                  <small>{PLACES[h].homes}</small>
                  <IconArrow />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        {seoul.length > 0 && (
          <section className="sec">
            <h2 className="h2-plain">서울 전체</h2>
            <ul className="linklist cols3">{seoul.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
          </section>
        )}
        <section className="sec">
          <h2 className="h2-plain">현장 주소부터 알려 주세요</h2>
          <p className="prose-p">구·동 이름과 공사 내용을 알려 주시면 현장 확인 일정을 잡습니다.</p>
          <Actions />
        </section>
      </div>
    </main>
  );
}
