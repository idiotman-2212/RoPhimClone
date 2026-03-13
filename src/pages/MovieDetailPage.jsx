import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetail, fetchMoviesByType, getImageUrl } from '../services/api';
import MovieCard from '../components/MovieCard';
import { FiPlay, FiHeart, FiPlus, FiShare2, FiStar, FiChevronLeft, FiList } from 'react-icons/fi';
import './MovieDetailPage.css';

export default function MovieDetailPage() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [activeServer, setActiveServer] = useState(0);
  const [activeEp, setActiveEp] = useState(null);
  const [lightsOff, setLightsOff] = useState(false);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setActiveEp(null);
    setActiveServer(0);

    async function load() {
      try {
        const res = await fetchMovieDetail(slug);
        const data = res.movie || res.data?.item || res;
        setMovie(data);
        const eps = res.episodes || data.episodes || [];
        setEpisodes(eps);
        if (eps.length > 0 && eps[0].server_data?.length > 0) {
          setActiveEp(eps[0].server_data[0]);
        }

        const type = data.type === 'single' ? 'phim-le' : 'phim-bo';
        const relRes = await fetchMoviesByType(type);
        const relItems = relRes.data?.items || relRes.items || [];
        setRelated(relItems.filter(m => m.slug !== slug).slice(0, 10));
      } catch (err) {
        console.error('Error loading movie:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return <div className="page-content"><div className="loading-container"><div className="loading-spinner" /></div></div>;
  }

  if (!movie) {
    return <div className="page-content"><div className="container"><p>Không tìm thấy phim.</p></div></div>;
  }

  const thumb = getImageUrl(movie.thumb_url || movie.poster_url);
  const currentServerEps = episodes[activeServer]?.server_data || [];

  const handlePlayEp = (ep) => {
    setActiveEp(ep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build completion status
  const totalEps = movie.episode_total || '';
  const currentEp = movie.episode_current || '';
  const isCompleted = currentEp.toLowerCase().includes('hoàn tất') || currentEp.toLowerCase().includes('full');

  return (
    <div className={`movie-detail ${lightsOff ? 'lights-off' : ''}`}>
      <div className="md-page">

        {/* Title bar */}
        <div className="md-titlebar">
          <div className="md-titlebar-inner">
            <Link to="/" className="md-back"><FiChevronLeft /></Link>
            <span className="md-titlebar-text">
              Xem phim {movie.name}
            </span>
            <span className="md-titlebar-ep">
              {activeEp && (activeEp.name === 'Full' ? 'Full' : `Phần 1 - Tập ${activeEp.name}`)}
            </span>
            <button className="md-titlebar-list" title="Danh sách tập">
              <FiList /> <span>Danh sách tập</span>
            </button>
          </div>
        </div>

        {/* Player - FULL WIDTH like rophim1.pro */}
        {activeEp?.link_embed && (
          <div className="md-player-section">
            <div className="md-player">
              <iframe src={activeEp.link_embed} allowFullScreen frameBorder="0"
                      title={movie.name} allow="autoplay; encrypted-media" />
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="md-action-bar">
          <div className="md-action-inner">
            <div className="md-action-left">
              <button className="md-action-item">
                <FiHeart />
                <span>Yêu thích</span>
              </button>
              <button className="md-action-item">
                <FiPlus />
                <span>Thêm vào</span>
              </button>
              <button className="md-action-item" onClick={() => setLightsOff(!lightsOff)}>
                <span>{lightsOff ? '💡' : '🌙'}</span>
                <span>Tắt đèn</span>
                <span className={`md-toggle ${lightsOff ? 'md-toggle--on' : ''}`}>
                  {lightsOff ? 'ON' : 'OFF'}
                </span>
              </button>
              <button className="md-action-item">
                <FiShare2 />
                <span>Chia sẻ</span>
              </button>
            </div>
            {activeEp && (
              <div className="md-current-ep">
                Đang xem: {activeEp.name === 'Full' ? 'Full' : `Tập ${activeEp.name}`}
              </div>
            )}
          </div>
        </div>

        {/* Movie Info Section - 3 column layout */}
        <div className="md-info-section">
          <div className="md-info-layout">
            {/* Left column: Poster + Title + Badges */}
            <div className="md-info-left">
              <div className="md-info-poster">
                <img src={thumb} alt={movie.name} />
              </div>
              <div className="md-info-text">
                <h1 className="md-movie-title">{movie.name}</h1>
                <p className="md-movie-origin">{movie.origin_name}</p>

                {/* Badges row */}
                <div className="md-badges">
                  {movie.tmdb?.vote_average > 0 && (
                    <span className="md-badge md-badge--imdb">IMDb {movie.tmdb.vote_average.toFixed(1)}</span>
                  )}
                  {movie.year && <span className="md-badge">{movie.year}</span>}
                  {movie.time && <span className="md-badge">{movie.time}</span>}
                  {movie.episode_current && (
                    <span className="md-badge">{movie.episode_current}</span>
                  )}
                </div>

                {/* Genre tags */}
                {movie.category?.length > 0 && (
                  <div className="md-genre-tags">
                    {movie.category.map(c => (
                      <Link key={c.slug} to={`/the-loai/${c.slug}`} className="md-genre-tag">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Completion status */}
                {currentEp && (
                  <div className={`md-status ${isCompleted ? 'md-status--done' : ''}`}>
                    <span className="md-status-icon">{isCompleted ? '✅' : '🔄'}</span>
                    <span>{isCompleted ? `Đã hoàn thành: ${currentEp}` : currentEp}
                      {totalEps ? ` / ${totalEps}` : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Center column: Description */}
            <div className="md-info-center">
              <div className="md-description">
                <p>
                  {movie.content
                    ? movie.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
                    : 'Đang cập nhật...'}
                </p>
              </div>
              <Link to={`/phim/${movie.slug}`} className="md-more-link">
                Thông tin phim &rsaquo;
              </Link>

              {/* Meta info */}
              <div className="md-meta-grid">
                {movie.country?.length > 0 && (
                  <div className="md-meta-item">
                    <span className="md-meta-label">Quốc gia:</span>
                    <span className="md-meta-value">
                      {movie.country.map((c, i) => (
                        <span key={c.slug}>
                          <Link to={`/quoc-gia/${c.slug}`}>{c.name}</Link>
                          {i < movie.country.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
                {movie.quality && (
                  <div className="md-meta-item">
                    <span className="md-meta-label">Chất lượng:</span>
                    <span className="md-meta-value">{movie.quality}</span>
                  </div>
                )}
                {movie.lang && (
                  <div className="md-meta-item">
                    <span className="md-meta-label">Ngôn ngữ:</span>
                    <span className="md-meta-value">{movie.lang}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: Rating */}
            <div className="md-info-right">
              <div className="md-rating-actions">
                <div className="md-rating-action">
                  <FiStar className="md-rating-icon" />
                  <span>Đánh giá</span>
                </div>
                <div className="md-rating-action">
                  <span className="md-rating-icon">💬</span>
                  <span>Bình luận</span>
                </div>
              </div>
              {movie.tmdb?.vote_average > 0 && (
                <div className="md-score-box">
                  <div className="md-score-star">
                    <FiStar />
                    <span>{movie.tmdb.vote_average.toFixed(1)}</span>
                  </div>
                  <button className="md-score-btn">Đánh giá</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        {episodes.length > 0 && (
          <div className="md-episodes-section">
            <div className="md-ep-header">
              <h3 className="md-section-title">
                <FiList /> Phần 1
              </h3>
              {/* Server tabs inline */}
              <div className="md-server-tabs">
                {episodes.map((server, idx) => (
                  <button key={idx}
                          className={`md-server-tab ${idx === activeServer ? 'md-server-tab--active' : ''}`}
                          onClick={() => setActiveServer(idx)}>
                    📺 {server.server_name}
                  </button>
                ))}
              </div>
              <div className="md-ep-compact">
                <span>Rút gọn</span>
                <span className="md-toggle md-toggle--on">●</span>
              </div>
            </div>

            {/* Episode grid - LARGE buttons with play icons */}
            <div className="md-episode-grid">
              {currentServerEps.map((ep, idx) => (
                <button key={idx}
                        className={`md-ep-btn ${activeEp?.slug === ep.slug && activeEp?.name === ep.name ? 'md-ep-btn--active' : ''}`}
                        onClick={() => handlePlayEp(ep)}>
                  <FiPlay className="md-ep-play" />
                  <span>{ep.name === 'Full' ? 'Full' : `Tập ${ep.name}`}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related Movies */}
        {related.length > 0 && (
          <div className="md-related-section">
            <h3 className="md-section-title">Phim Đề Cử</h3>
            <div className="md-related-grid">
              {related.map(m => <MovieCard key={m._id || m.slug} movie={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
