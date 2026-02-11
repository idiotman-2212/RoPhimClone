import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieListPage from './pages/MovieListPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/danh-sach/:type" element={<MovieListPage />} />
        <Route path="/the-loai/:slug" element={<MovieListPage />} />
        <Route path="/quoc-gia/:slug" element={<MovieListPage />} />
        <Route path="/phim/:slug" element={<MovieDetailPage />} />
        <Route path="/tim-kiem" element={<SearchPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
