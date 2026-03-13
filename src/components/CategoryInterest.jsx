import { Link } from 'react-router-dom';
import './CategoryInterest.css';

const CATEGORIES = [
  { label: 'Phim Hàn Quốc', slug: 'han-quoc', type: 'quoc-gia', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: 'Phim Trung Quốc', slug: 'trung-quoc', type: 'quoc-gia', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: 'Phim Hành Động', slug: 'hanh-dong', type: 'the-loai', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { label: 'Phim Tình Cảm', slug: 'tinh-cam', type: 'the-loai', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { label: 'Phim Viễn Tưởng', slug: 'vien-tuong', type: 'the-loai', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
  { label: 'Phim Kinh Dị', slug: 'kinh-di', type: 'the-loai', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
];

export default function CategoryInterest() {
  return (
    <div className="category-interest">
      <h2 className="ci-title">Bạn đang quan tâm gì?</h2>
      <div className="ci-grid">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            to={`/${cat.type}/${cat.slug}`}
            className="ci-card"
            style={{ background: cat.gradient }}
          >
            <span className="ci-label">{cat.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
