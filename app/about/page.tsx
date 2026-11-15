// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts 에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, LEGAL_NAME, BUSINESS, CONTACT, AREA_LINE, WORKS_LINE, UPDATED, shareMeta, tel, smsHref } from '../../lib/site';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { JsonLd, PageTop } from '../../components/Common';

const TITLE = `소개 | ${BRAND}`;
const DESC = `${BRAND}은 비계·시스템비계·이지아이휀스를 설치하고 해체합니다. 하는 일, 작업 지역, 연락 방법을 정리했습니다.`;
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/about/' },
  ...shareMeta('home', `${BRAND} 소개`, { title: TITLE, description: DESC, url: '/about/' }),
};

export default function About() {
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <PageTop photo="f06" alt={`${BRAND} 현장 - 비탈면 아래 도로를 따라 이어진 EGI휀스`}>
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>소개</span></nav>
        <h1 className="page-title">{BRAND} 소개</h1>
        <p className="page-lead">{BRAND}은 공사 현장에 비계와 가설 울타리를 설치하고 해체하는 업체입니다.</p>
      </PageTop>
      <div className="wrap content">
        <section className="sec">
          <h2 className="h2-plain">하는 일</h2>
          <p className="prose-p">{WORKS_LINE} 설치와 해체를 합니다. 작업한 현장은 <Link href="/work/">현장 사진</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <h2 className="h2-plain">작업 지역</h2>
          <p className="prose-p">작업 지역은 {AREA_LINE}입니다. 구·시별 안내는 <Link href="/area/">작업 지역</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <h2 className="h2-plain">연락 방법</h2>
          <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a>와 <a href={smsHref}>문자</a>{CONTACT.hours && ` (${CONTACT.hours})`}로 받습니다.</p>
          <p className="prose-p">상호는 {LEGAL_NAME}입니다.</p>
          {BUSINESS.address && <p className="prose-p">주소는 {BUSINESS.address}입니다.</p>}
          {BUSINESS.bizNumber && <p className="prose-p">사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>}
          <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
        </section>
      </div>
    </main>
  );
}
