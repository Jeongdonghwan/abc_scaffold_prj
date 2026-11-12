import type { Metadata } from 'next';
import { j } from '../../lib/ko';
import Link from 'next/link';
import { PHOTOS, OPEN_PAGES, pagePath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { Actions, IconArrow, JsonLd, PageTop, Photo } from '../../components/Common';

const TITLE = `현장 사진 — 이지아이휀스·가설울타리 | ${BRAND}`;
const DESC = `${j(BRAND, '이')} 세운 이지아이휀스(EGI휀스)와 타공 패널 가설울타리 현장 사진 11장. 흙바닥·비탈·콘크리트 바닥 부지에 지주와 버팀대로 세운 모습입니다.`;
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/work/' },
  ...shareMeta('work', `${BRAND} 현장 사진`, { title: TITLE, description: DESC, url: '/work/' }),
};

export default function Work() {
  const fence = OPEN_PAGES.filter((p) => (p.service === 'egi' || p.service === '울타리') && !p.mod).slice(0, 12);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '현장 사진', path: '/work/' }]),
        itemListJsonLd(PHOTOS.map((p) => ({ name: p.scene, path: '/work/', image: `/img/${p.id}.jpg` }))),
      ]} />
      <PageTop photo="f11" alt={`${BRAND} 현장 - 콘크리트 바닥 부지 둘레 EGI휀스`}>
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>현장 사진</span></nav>
        <h1 className="page-title">현장 사진</h1>
        <p className="page-lead">홈페이지 작업사진 게시판에 올린 이지아이휀스·가설울타리 현장입니다. 설명은 사진에 보이는 것만 적었습니다.</p>
      </PageTop>
      <div className="wrap content">
        <section className="sec">
          <h2 className="h2-plain">이지아이휀스·타공 패널 울타리</h2>
          <div className="gallery">
            {PHOTOS.map((p, i) => (
              <figure key={p.id} data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }} className={p.h > p.w ? 'tall' : ''}>
                <Photo id={p.id} alt={`${BRAND} 현장 - ${p.scene}`} />
                <figcaption>{p.scene}</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className="sec">
          <h2 className="h2-plain">울타리 지역 안내</h2>
          <ul className="linklist cols3">{fence.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
          <Actions />
        </section>
      </div>
    </main>
  );
}
