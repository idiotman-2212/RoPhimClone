import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMoviesByType } from '../services/api';
import HeroCarousel from '../components/HeroCarousel';
import MovieCarousel from '../components/MovieCarousel';
import CategoryInterest from '../components/CategoryInterest';
import MovieCard from '../components/MovieCard';
import { FiChevronRight } from 'react-icons/fi';

const CAROUSEL_SECTIONS = [
  { titlePrefix: 'Phim', titleHighlight: 'Hàn Quốc', titleSuffix: ' tập mới', highlightClass: 'highlight-pink', type: 'phim-bo', path: '/danh-sach/phim-bo' },
  { titlePrefix: 'Phim', titleHighlight: 'Hành Động', titleSuffix: ' Mới', highlightClass: 'highlight-blue', type: 'phim-le', path: '/danh-sach/phim-le' },
  { titlePrefix: '', titleHighlight: 'Hoạt Hình', titleSuffix: ' Hay', highlightClass: 'highlight-orange', type: 'hoat-hinh', path: '/danh-sach/hoat-hinh' },
];

const GRID_SECTION = { titlePrefix: 'Phim', titleHighlight: 'Mới', titleSuffix: ' Cập Nhật', highlightClass: 'highlight-green', type: 'phim-moi-cap-nhat', path: '/danh-sach/phim-moi-cap-nhat' };

export default function HomePage() {
  const [heroMovies, setHeroMovies] = useState([]);
  const [carouselData, setCarouselData] = useState({});
  const [gridMovies, setGridMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function load() {
      try {
        // Load all sections
        const [gridRes, ...carouselResults] = await Promise.all([
          fetchMoviesByType(GRID_SECTION.type),
          ...CAROUSEL_SECTIONS.map(s => fetchMoviesByType(s.type)),
        ]);

        // Grid section (newly updated movies, less metadata)
        const gridItems = gridRes.data?.items || gridRes.items || [];
        setGridMovies(gridItems);

        // Carousel sections
        const newCarouselData = {};
        carouselResults.forEach((res, i) => {
          const items = res.data?.items || res.items || [];
          newCarouselData[CAROUSEL_SECTIONS[i].type] = items;
        });
        setCarouselData(newCarouselData);

        // Feed rich data to Hero Banner (from Phim Bộ)
        const phimBoItems = newCarouselData['phim-bo'] || [];
        setHeroMovies(phimBoItems.slice(0, 10));
      } catch (err) {
        console.error('Error loading homepage:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-container"><div className="loading-spinner" /></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <HeroCarousel movies={heroMovies} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="fluid-gap" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
          {/* Category Interest */}
          <CategoryInterest />

          {/* Horizontal Scroll Carousels */}
          {CAROUSEL_SECTIONS.map(section => {
            const items = carouselData[section.type] || [];
            if (items.length === 0) return null;
            return (
              <MovieCarousel
                key={section.type}
                title={
                  <>
                    {section.titlePrefix} <span className={section.highlightClass}>{section.titleHighlight}</span>{section.titleSuffix}
                  </>
                }
                linkTo={section.path}
                movies={items}
              />
            );
          })}

          {/* Traditional Grid Section */}
          {gridMovies.length > 0 && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">
                  {GRID_SECTION.titlePrefix} <span className={GRID_SECTION.highlightClass}>{GRID_SECTION.titleHighlight}</span>{GRID_SECTION.titleSuffix}
                </h2>
                <Link to={GRID_SECTION.path} className="section-link">
                  Xem tất cả <FiChevronRight />
                </Link>
              </div>
              <div className="movie-grid">
                {gridMovies.map(movie => (
                  <MovieCard key={movie._id || movie.slug} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
