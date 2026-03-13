import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import './MovieCard.css';

function formatEpisodeBadge(movie) {
  const ep = movie.episode_current;
  if (!ep) return null;

  const lang = movie.lang || '';
  let prefix = '';
  let badgeClass = 'ep-badge--default';

  if (lang.includes('Vietsub') || lang.includes('Phụ đề')) {
    prefix = 'PĐ. ';
    badgeClass = 'ep-badge--sub';
  } else if (lang.includes('Thuyết minh') || lang.includes('Lồng tiếng')) {
    prefix = 'TM. ';
    badgeClass = 'ep-badge--dub';
  }

  // Try to extract episode number
  const epMatch = ep.match(/(\d+)/);
  const epNum = epMatch ? epMatch[1] : ep;
  const label = prefix ? `${prefix}${epNum}` : ep;

  return { label, badgeClass };
}

export default function MovieCard({ movie, landscape = false }) {
  const thumb = landscape
    ? getImageUrl(movie.poster_url || movie.thumb_url)
    : getImageUrl(movie.thumb_url || movie.poster_url);

  const epBadge = formatEpisodeBadge(movie);

  return (
    <Link to={`/phim/${movie.slug}`} className={`movie-card ${landscape ? 'movie-card--landscape' : ''}`}>
      <div className="movie-card__poster">
        <img src={thumb} alt={movie.name} loading="lazy" />
        <div className="movie-card__overlay">
          <div className="movie-card__play">▶</div>
        </div>
        {!landscape && (
          <div className="movie-card__badges">
            {movie.quality && <span className="badge badge-quality">{movie.quality}</span>}
            {movie.lang && <span className="badge badge-lang">{movie.lang.length > 10 ? 'VS+TM' : movie.lang}</span>}
          </div>
        )}
        {epBadge && (
          <span className={`movie-card__ep-badge ${epBadge.badgeClass}`}>
            {epBadge.label}
          </span>
        )}
      </div>
      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.name}</h3>
        <p className="movie-card__origin">{movie.origin_name} {movie.year ? `(${movie.year})` : ''}</p>
      </div>
    </Link>
  );
}
