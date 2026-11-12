import type { Metadata } from 'next';
import { j } from '../../lib/ko';
import Link from 'next/link';
import { getPosts, postPath, postEncodedPath } from '../../lib/blog';
import { OPEN_PAGES, pagePath, pageEncodedPath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, PageTop } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const TITLE = `비계·가설울타리 블로그 | ${BRAND}`;
const DESC = `강관비계와 시스템비계 차이, 비계 견적서에서 볼 항목, EGI휀스 기초, 공사장 방음벽처럼 ${j(BRAND, '이')} 상담 때 자주 받는 질문을 글로 정리합니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('blog', `${BRAND} 블로그`, { title: TITLE, description: DESC, url: '/blog/' }),
};

const fmt = (d: string) => d.replace(/-/g, '.');

export default function BlogIndex() {
  const posts = getPosts();
  // 글이 없을 때도 목록이 비지 않게 열린 대표 페이지로 이어 준다
  const hubs = OPEN_PAGES.filter((p) => !p.mod).slice(0, 9);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '블로그', path: '/blog/' }]),
        itemListJsonLd(posts.length
          ? posts.map((p) => ({ name: p.title, path: postEncodedPath(p) }))
          : hubs.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <PageTop photo="f08" alt={`${BRAND} 현장 - 지주에 EGI 패널을 붙이는 설치 중 모습`}>
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>블로그</span></nav>
        <h1 className="page-title">비계·가설울타리 블로그</h1>
        <p className="page-lead">상담 때 자주 듣는 질문을 한 편에 하나씩 답합니다. 현장마다 다른 비용 숫자는 적지 않습니다.</p>
      </PageTop>
      <div className="wrap content">
        <section className="sec">
          <h2 className="h2-plain">최근 글</h2>
          {posts.length > 0 ? (
            <ol className="post-list">
              {posts.map((p) => (
                <li key={p.slug} data-reveal>
                  <Link href={postPath(p)}>
                    <span className="meta">{fmt(p.publishedAt)}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="prose-p">첫 글을 준비하고 있습니다. 그동안 아래 지역 안내 페이지를 참고해 주세요.</p>
          )}
        </section>
        <section className="sec">
          <h2 className="h2-plain">비계·EGI휀스 지역 안내</h2>
          <ul className="linklist cols3">{hubs.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
          <Actions />
        </section>
      </div>
    </main>
  );
}
