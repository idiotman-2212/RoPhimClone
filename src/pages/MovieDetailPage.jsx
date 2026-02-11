import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetail, fetchMoviesByType, getImageUrl } from '../services/api';
import MovieCard from '../components/MovieCard';
import { FiPlay, FiCalendar, FiClock, FiGlobe, FiStar } from 'react-icons/fi';
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

        // Load related
        const type = data.type === 'single' ? 'phim-le' : 'phim-bo';
        const relRes = await fetchMoviesByType(type);
        const relItems = relRes.data?.items || relRes.items || [];
        setRelated(relItems.filter(m => m.slug !== slug).slice(0, 12));
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

  const poster = getImageUrl(movie.poster_url);
  const thumb = getImageUrl(movie.thumb_url);
  const currentServerEps = episodes[activeServer]?.server_data || [];

  return (
    <div className={`movie-detail ${lightsOff ? 'lights-off' : ''}`}>
      {/* Backdrop */}
      <div className="detail-backdrop" style={{ backgroundImage: `url(${poster})` }} />
      <div className="detail-backdrop-gradient" />

      <div className="page-content">
        <div className="container">
          {/* Player */}
          {activeEp?.link_embed && (
            <div className="player-section">
              <div className="player-wrapper">
                <iframe src={activeEp.link_embed} allowFullScreen frameBorder="0"
                        title={movie.name} allow="autoplay; encrypted-media" />
              </div>
              <div className="player-controls">
                <button className={`lights-btn ${lightsOff ? 'lights-btn--on' : ''}`}
                        onClick={() => setLightsOff(!lightsOff)}>
                  {lightsOff ? '💡 Bật đèn' : '🌙 Tắt đèn'}
                </button>
                {activeEp && (
                  <span className="current-ep-label">
                    Đang xem: {activeEp.name === 'Full' ? 'Full' : `Tập ${activeEp.name}`}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Movie Info */}
          <div className="detail-content">
            <div className="detail-poster-col">
              <img src={thumb} alt={movie.name} className="detail-poster" />
            </div>
            <div className="detail-info-col">
              <h1 className="detail-title">{movie.name}</h1>
              <p className="detail-origin">{movie.origin_name}</p>
              <div className="detail-badges">
                {movie.quality && <span className="badge badge-quality">{movie.quality}</span>}
                {movie.lang && <span className="badge badge-lang">{movie.lang}</span>}
                {movie.episode_current && <span className="badge badge-episode">{movie.episode_current}</span>}
              </div>
              <div className="detail-meta">
                {movie.year && <span><FiCalendar /> {movie.year}</span>}
                {movie.time && <span><FiClock /> {movie.time}</span>}
                {movie.tmdb?.vote_average > 0 && (
                  <span className="detail-rating"><FiStar /> {movie.tmdb.vote_average.toFixed(1)}</span>
                )}
              </div>
              <div className="detail-tags">
                {movie.category?.map(c => (
                  <Link key={c.slug} to={`/the-loai/${c.slug}`} className="detail-tag">{c.name}</Link>
                ))}
                {movie.country?.map(c => (
                  <Link key={c.slug} to={`/quoc-gia/${c.slug}`} className="detail-tag detail-tag--country">
                    <FiGlobe /> {c.name}
                  </Link>
                ))}
              </div>
              <div className="detail-desc">
                <h3>Nội dung phim</h3>
                <p>{movie.content || 'Đang cập nhật...'}</p>
              </div>
              {!activeEp?.link_embed && currentServerEps.length > 0 && (
                <button className="hero__btn hero__btn--primary"
                        onClick={() => setActiveEp(currentServerEps[0])}>
                  <FiPlay /> Xem Phim
                </button>
              )}
            </div>
          </div>

          {/* Episode List */}
          {episodes.length > 0 && (
            <div className="episodes-section">
              <h3 className="section-title">Danh sách tập</h3>
              {episodes.length > 1 && (
                <div className="server-tabs">
                  {episodes.map((server, idx) => (
                    <button key={idx}
                            className={`server-tab ${idx === activeServer ? 'server-tab--active' : ''}`}
                            onClick={() => { setActiveServer(idx); }}>
                      {server.server_name}
                    </button>
                  ))}
                </div>
              )}
              <div className="episode-grid">
                {currentServerEps.map((ep, idx) => (
                  <button key={idx}
                          className={`episode-btn ${activeEp?.slug === ep.slug && activeEp?.name === ep.name ? 'episode-btn--active' : ''}`}
                          onClick={() => { setActiveEp(ep); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    {ep.name === 'Full' ? 'Full' : ep.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div className="section">
              <h3 className="section-title">Phim Đề Cử</h3>
              <div className="movie-grid">
                {related.map(m => <MovieCard key={m._id || m.slug} movie={m} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
