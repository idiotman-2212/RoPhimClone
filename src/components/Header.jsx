import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiUser } from 'react-icons/fi';
import { fetchGenres, fetchCountries } from '../services/api';
import './Header.css';

const NAV_ITEMS = [
  { label: 'Phim Mới', path: '/danh-sach/phim-moi-cap-nhat', badge: 'MỚI', badgeClass: 'badge-new' },
  { label: 'Thể loại', path: '/the-loai', isDropdown: 'genre' },
  { label: 'Phim Lẻ', path: '/danh-sach/phim-le' },
  { label: 'Phim Bộ', path: '/danh-sach/phim-bo' },
  { label: 'Hoạt Hình', path: '/danh-sach/hoat-hinh' },
  { label: 'TV Shows', path: '/danh-sach/tv-shows' },
  { label: 'Quốc gia', path: '/quoc-gia', isDropdown: 'country' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetchGenres().then(r => { if (r.data?.items) setGenres(r.data.items); });
    fetchCountries().then(r => { if (r.data?.items) setCountries(r.data.items); });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        {/* Mobile menu button */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(true)}>
          <FiMenu />
        </button>

        {/* Logo */}
        <Link to="/" className="header__logo">
          <img src="/logo.png" alt="RoPhim" className="logo-img" />
        </Link>

        {/* Search bar - always visible on desktop */}
        <form className="header__search" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Tìm kiếm phim, diễn viên"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Nav + Member */}
        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <FiX />
          </button>

          {/* Mobile search */}
          <form className="mobile-search" onSubmit={handleSearch}>
            <FiSearch />
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          <ul className="nav-list">
            {NAV_ITEMS.map(item => {
              if (item.isDropdown === 'genre') {
                return (
                  <li key="genre" className="nav-item nav-item--dropdown"
                      onMouseEnter={() => setDropdownOpen('genre')}
                      onMouseLeave={() => setDropdownOpen(null)}>
                    <span className="nav-dropdown-trigger">
                      Thể loại <FiChevronDown />
                    </span>
                    {dropdownOpen === 'genre' && (
                      <div className="dropdown-menu">
                        {genres.map(g => (
                          <Link key={g.slug} to={`/the-loai/${g.slug}`}
                                onClick={() => { setDropdownOpen(null); setMobileOpen(false); }}>
                            {g.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }
              if (item.isDropdown === 'country') {
                return (
                  <li key="country" className="nav-item nav-item--dropdown"
                      onMouseEnter={() => setDropdownOpen('country')}
                      onMouseLeave={() => setDropdownOpen(null)}>
                    <span className="nav-dropdown-trigger">
                      Quốc gia <FiChevronDown />
                    </span>
                    {dropdownOpen === 'country' && (
                      <div className="dropdown-menu">
                        {countries.map(c => (
                          <Link key={c.slug} to={`/quoc-gia/${c.slug}`}
                                onClick={() => { setDropdownOpen(null); setMobileOpen(false); }}>
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }
              return (
                <li key={item.path} className="nav-item">
                  <Link to={item.path} onClick={() => setMobileOpen(false)} className={item.isButton ? 'nav-item-button' : ''}>
                    {item.label}
                    {item.badge && <span className={`badge ${item.badgeClass} nav-badge`}>{item.badge}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Member button */}
        <button className="header__member">
          <FiUser />
          <span>Thành viên</span>
        </button>

        {/* Mobile search toggle */}
        <button className="mobile-search-toggle" onClick={() => searchRef.current?.focus()}>
          <FiSearch />
        </button>
      </div>
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    </header>
  );
}
