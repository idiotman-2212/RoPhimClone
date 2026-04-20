import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('rophim_user');
    const savedBookmarks = localStorage.getItem('rophim_bookmarks');
    const savedHistory = localStorage.getItem('rophim_history');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save to LocalStorage when changed
  useEffect(() => {
    localStorage.setItem('rophim_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('rophim_history', JSON.stringify(history));
  }, [history]);

  const login = (username) => {
    const newUser = { username };
    setUser(newUser);
    localStorage.setItem('rophim_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rophim_user');
  };

  const toggleBookmark = (movie) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setBookmarks(prev => {
      const exists = prev.find(b => b.slug === movie.slug);
      if (exists) return prev.filter(b => b.slug !== movie.slug);
      return [{
        slug: movie.slug,
        name: movie.name,
        thumb_url: movie.thumb_url || movie.poster_url,
        addedAt: new Date().toISOString()
      }, ...prev];
    });
  };

  const isBookmarked = (slug) => {
    return bookmarks.some(b => b.slug === slug);
  };

  const addToHistory = (movie, episodeName) => {
    if (!user) return; // Only track history for logged in users
    setHistory(prev => {
      const filtered = prev.filter(h => h.slug !== movie.slug);
      return [{
        slug: movie.slug,
        name: movie.name,
        thumb_url: movie.thumb_url || movie.poster_url,
        lastEpisode: episodeName,
        watchedAt: new Date().toISOString()
      }, ...filtered].slice(0, 50); // Keep last 50
    });
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      bookmarks, toggleBookmark, isBookmarked,
      history, addToHistory,
      showAuthModal, openAuthModal, closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};
