import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { fetchMoviesByType, fetchByCategory } from '../services/api';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';

const TYPE_TITLES = {
  'phim-moi-cap-nhat': 'Phim Mới Cập Nhật',
  'phim-bo': 'Phim Bộ',
  'phim-le': 'Phim Lẻ',
  'hoat-hinh': 'Hoạt Hình',
  'tv-shows': 'TV Shows',
};

function extractTotalPages(data) {
  // API returns pagination in different structures
  const pagination = data.params?.pagination || data.pagination || {};
  if (pagination.totalPages) return pagination.totalPages;
  // Calculate from totalItems if available
  const totalItems = pagination.totalItems || 0;
  const perPage = pagination.totalItemsPerPage || 24;
  if (totalItems > 0) return Math.ceil(totalItems / perPage);
  return 1;
}

export default function MovieListPage() {
  const { type, slug } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    async function load() {
      try {
        let res;
        if (slug) {
          // Category or country filter: /the-loai/:slug or /quoc-gia/:slug
          const filterType = location.pathname.startsWith('/the-loai') ? 'the-loai' : 'quoc-gia';
          res = await fetchByCategory(filterType, slug, currentPage);
        } else {
          res = await fetchMoviesByType(type, currentPage);
        }
        const data = res.data || res;
        const items = data.items || [];
        setMovies(items);
        setTotalPages(extractTotalPages(data));
        setTitle(data.titlePage || TYPE_TITLES[type] || slug || 'Danh sách phim');
      } catch (err) {
        console.error('Error loading movies:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type, slug, currentPage, location.pathname]);

  const handlePageChange = (page) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <div className="page-content">
      <div className="container">
        <h1 className="page-title">{title}</h1>
        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /></div>
        ) : movies.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>
            Không tìm thấy phim nào.
          </p>
        ) : (
          <>
            <div className="movie-grid">
              {movies.map(movie => (
                <MovieCard key={movie._id || movie.slug} movie={movie} />
              ))}
            </div>
            <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}
