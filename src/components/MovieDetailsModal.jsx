// Movie details modal component showing comprehensive movie information
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Film,
  Heart,
  Play,
  ExternalLink
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { fetchMovieDetails, getImageUrl, formatReleaseDate, formatRuntime, formatCurrency } from '../services/tmdbApi';

/**
 * MovieDetailsModal component displays detailed movie information in a modal
 * @param {Object} props
 * @param {import('../types/movie.js').Movie} props.movie - Movie object to display details for
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {() => void} props.onClose - Function to close the modal
 */
export const MovieDetailsModal = ({ movie, isOpen, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const inWatchlist = isInWatchlist(movie.id);

  // Fetch detailed movie information when modal opens
  useEffect(() => {
    if (isOpen && movie) {
      loadMovieDetails();
    }
  }, [isOpen, movie]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await fetchMovieDetails(movie.id);
      setMovieDetails(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 truncate">
            {movie.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-pink-500 mb-2">Failed to load movie details</p>
              <p className="text-slate-500 text-sm">{error}</p>
            </div>
          )}

          {movieDetails && (
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={getImageUrl(movieDetails.poster_path)}
                    alt={movieDetails.title}
                    className="w-64 h-96 object-cover rounded-lg mx-auto md:mx-0"
                  />
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                      {movieDetails.title}
                    </h1>
                    {movieDetails.tagline && (
                      <p className="text-slate-500 italic text-lg">
                        "{movieDetails.tagline}"
                      </p>
                    )}
                  </div>

                  {/* Rating and Actions */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {movieDetails.vote_average > 0 && (
                      <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-slate-800 font-medium">
                          {movieDetails.vote_average.toFixed(1)}
                        </span>
                        <span className="text-slate-500 text-sm">
                          ({movieDetails.vote_count.toLocaleString()} votes)
                        </span>
                      </div>
                    )}

                    <button
                      onClick={handleWatchlistToggle}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        inWatchlist
                          ? 'bg-pink-500 hover:bg-pink-600 text-white'
                          : 'bg-teal-500 hover:bg-teal-600 text-white'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${inWatchlist ? 'fill-current' : ''}`} />
                      <span>{inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                    </button>
                  </div>

                  {/* Movie Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-teal-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-teal-500 mx-auto mb-1" />
                      <div className="text-slate-800 font-medium">
                        {formatReleaseDate(movieDetails.release_date)}
                      </div>
                      <div className="text-slate-500 text-sm">Release</div>
                    </div>

                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <Clock className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                      <div className="text-slate-800 font-medium">
                        {formatRuntime(movieDetails.runtime)}
                      </div>
                      <div className="text-slate-500 text-sm">Runtime</div>
                    </div>

                    {movieDetails.budget > 0 && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                        <div className="text-slate-800 font-medium">
                          {formatCurrency(movieDetails.budget)}
                        </div>
                        <div className="text-slate-500 text-sm">Budget</div>
                      </div>
                    )}

                    {movieDetails.revenue > 0 && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                        <div className="text-slate-800 font-medium">
                          {formatCurrency(movieDetails.revenue)}
                        </div>
                        <div className="text-slate-500 text-sm">Revenue</div>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {movieDetails.genres && movieDetails.genres.length > 0 && (
                    <div>
                      <h3 className="text-slate-800 font-semibold mb-2">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {movieDetails.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Overview */}
              {movieDetails.overview && (
                <div>
                  <h3 className="text-slate-800 font-semibold mb-3">Overview</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {movieDetails.overview}
                  </p>
                </div>
              )}

              {/* Cast */}
              {movieDetails.credits?.cast && movieDetails.credits.cast.length > 0 && (
                <div>
                  <h3 className="text-slate-800 font-semibold mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Cast
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {movieDetails.credits.cast.slice(0, 8).map((person) => (
                      <div key={person.id} className="text-center">
                        <img
                          src={getImageUrl(person.profile_path)}
                          alt={person.name}
                          className="w-16 h-16 rounded-full mx-auto mb-2 object-cover bg-gray-200"
                        />
                        <div className="text-slate-800 text-sm font-medium">
                          {person.name}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {person.character}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Production Companies */}
              {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                <div>
                  <h3 className="text-slate-800 font-semibold mb-3">Production Companies</h3>
                  <div className="flex flex-wrap gap-4">
                    {movieDetails.production_companies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                        {company.logo_path && (
                          <img
                            src={getImageUrl(company.logo_path)}
                            alt={company.name}
                            className="h-6 w-auto"
                          />
                        )}
                        <span className="text-slate-600 text-sm">{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};