const BASE = '/api';
const IMG_CDN = 'https://img.ophim.live/uploads/movies/';

export function getImageUrl(filename) {
  if (!filename) return 'https://placehold.co/300x450/1a1a2e/ffffff?text=No+Image';
  if (filename.startsWith('http')) return filename;
  return `${IMG_CDN}${filename}`;
}

export async function fetchNewMovies(page = 1) {
  const res = await fetch(`${BASE}/v1/api/danh-sach/phim-moi-cap-nhat?page=${page}`);
  return res.json();
}

export async function fetchMoviesByType(type, page = 1) {
  const res = await fetch(`${BASE}/v1/api/danh-sach/${type}?page=${page}`);
  return res.json();
}

export async function fetchMovieDetail(slug) {
  const res = await fetch(`${BASE}/phim/${slug}`);
  return res.json();
}

export async function searchMovies(keyword, page = 1) {
  const res = await fetch(`${BASE}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  return res.json();
}

export async function fetchGenres() {
  const res = await fetch(`${BASE}/v1/api/the-loai`);
  return res.json();
}

export async function fetchCountries() {
  const res = await fetch(`${BASE}/v1/api/quoc-gia`);
  return res.json();
}

export async function fetchByCategory(type, slug, page = 1, filters = {}) {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.country) params.set('country', filters.country);
  if (filters.year) params.set('year', filters.year);
  if (filters.type) params.set('type', filters.type);
  if (filters.sort && filters.sort !== '_id') params.set('sort_field', filters.sort);
  const res = await fetch(`${BASE}/v1/api/${type}/${slug}?${params.toString()}`);
  return res.json();
}

export async function fetchMoviesByTypeWithFilters(type, page = 1, filters = {}) {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.country) params.set('country', filters.country);
  if (filters.year) params.set('year', filters.year);
  if (filters.type) params.set('type', filters.type);
  if (filters.sort && filters.sort !== '_id') params.set('sort_field', filters.sort);
  const res = await fetch(`${BASE}/v1/api/danh-sach/${type}?${params.toString()}`);
  return res.json();
}
