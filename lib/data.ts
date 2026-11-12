// 데이터 로더 — data/site-pages.json(키워드 페이지), places.json(지역), photos.json(현장 사진). 빌드 전용.
import pagesData from '../data/site-pages.json';
import placesData from '../data/places.json';
import photosData from '../data/photos.json';
import { OPEN_WAVE } from './site';

export interface Page {
  n: number; no: number; kw: string; slug: string; label: string; place: string; hub: string | null;
  word: string; service: string; mod: string; unit: string; prio: number; wave: number; alts: string[];
}
export interface Place {
  key: string; name: string; kind: '시' | '구' | '생활권' | '동'; hub: string | null; parent: string | null; admin: string;
  traits: string; homes: string; roads: string; spots: string[]; site: string; alts: string[]; subs: string[]; siblings?: string[];
}
export interface Photo { id: string; scene: string; kind: string; w: number; h: number }

export const ALL_PAGES = pagesData.pages as Page[];
export const OPEN_PAGES = ALL_PAGES.filter((p) => p.wave <= OPEN_WAVE);
export const PLACES = placesData.places as Record<string, Place>;
export const HUBS = placesData.hubs as string[];
export const PHOTOS = photosData.photos as Photo[];

export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;
export const hubSlug = (hub: string) => hub.replace(/ /g, '-');
export const hubPath = (hub: string) => `/area/${hubSlug(hub)}/`;
export const hubEncodedPath = (hub: string) => `/area/${encodeURIComponent(hubSlug(hub))}/`;
export const hubOfSlug = (s: string) => {
  let k = s;
  try { k = decodeURIComponent(s); } catch {}
  return HUBS.find((h) => hubSlug(h) === k);
};

const bySlug = new Map(OPEN_PAGES.map((p) => [p.slug, p]));
export function getPage(slug: string): Page | undefined {
  let key = slug;
  try { key = decodeURIComponent(slug); } catch {}
  return bySlug.get(key);
}

export const openHubs = () => HUBS.filter((h) => OPEN_PAGES.some((p) => p.hub === h));
export const hubPages = (hub: string) => OPEN_PAGES.filter((p) => p.hub === hub);

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
};
export const seedOf = hash;
export const rotate = <T,>(arr: T[], seed: string, salt = ''): T[] => {
  if (!arr.length) return arr;
  const k = hash(`${seed}::${salt}`) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

// 관련 페이지 — 열린 페이지만. 같은 지역 다른 작업 / 같은 구 다른 동네 같은 작업 / 다른 구 같은 작업
export function related(p: Page) {
  const samePlace = rotate(OPEN_PAGES.filter((x) => x.place === p.place && x.slug !== p.slug), p.slug, 'sp').slice(0, 4);
  const sameHub = rotate(OPEN_PAGES.filter((x) => x.hub && x.hub === p.hub && x.place !== p.place && x.service === p.service && !x.mod), p.slug, 'sh').slice(0, 6);
  const other = rotate(OPEN_PAGES.filter((x) => x.hub !== p.hub && (PLACES[x.place].kind === '구' || PLACES[x.place].kind === '시') && x.service === p.service && x.mod === p.mod), p.slug, 'oc').slice(0, 4);
  return { samePlace, sameHub, other };
}

// 사진 배정 — 울타리 작업은 EGI·타공 패널 사진 우선, 비계 작업은 사진을 '현장 기록'으로만 (비계 현장 사진은 없음)
export function photosFor(p: Page, n = 3): Photo[] {
  const fence = p.service === 'egi' || p.service === '울타리';
  const pool = fence ? PHOTOS.filter((x) => x.kind !== 'prep') : PHOTOS;
  return rotate(pool, p.slug, 'ph').slice(0, n);
}
