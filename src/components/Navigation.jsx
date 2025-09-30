// Navigation component with routing links and watchlist counter
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export const Navigation = () => {
  const location = useLocation();
  const { watchlist } = useWatchlist();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-teal-500" />
            <span className="text-xl font-bold text-slate-800">Verto</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-teal-500 text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/watchlist"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/watchlist')
                  ? 'bg-pink-500 text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-gray-100'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};