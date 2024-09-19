import { useState } from 'react';
import MovieCard from '../moviecard/Moviecard';
import './Movielist.css';
import { useNavigate } from 'react-router-dom';

const MovieList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const navigate = useNavigate();
  
  const movies = [
    {
      id: "66d6d634ae232139c8f2b641",
      title: 'Deadpool & Wolverine',
      poster: '/src/assets/deadpool.jpg',
      description: 'Deadpool & Wolverine is a 2024 American superhero film based on Marvel Comics featuring the characters Deadpool and Wolverine.',
      genre: 'Superhero Comedy',
      rating: '8/10',
    },
    {
      id: '66d6d8380d583f8a4ac9fd5b',
      title: 'Alien:Romulus',
      poster: '/src/assets/alien.jpg',
      description: 'Romulus is a 2024 American science fiction horror film directed by Fede Álvarez and written by Álvarez and Rodo Sayagues',
      genre: 'Fiction Horror',
      rating: '7/10',
    },
    {
      id: '66d6d94f0d583f8a4ac9fd5e',
      title: 'The Crow',
      poster: '/src/assets/crow.jpg',
      description: 'The Crow is a 2024 American gothic superhero film directed by Rupert Sanders',
      genre: 'Gothic Superhero',
      rating: '4/10',
    },
    {
      id: '66d6da350d583f8a4ac9fd61',
      title: 'Inside Out 2',
      poster: '/src/assets/insideout.jpg',
      description: 'Inside Out 2 is a 2024 American animated coming-of-age film produced by Pixar Animation Studios for Walt Disney Pictures',
      genre: 'Animated',
      rating: '8/10',
    },
  ];

  const handlePosterClick = (movie) => {
    navigate(`/movies/${movie.id}`);
    setSelectedMovie(movie);
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="movie-list">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Genre Filter */}
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="genre-filter"
      >
        <option value="All">All Genres</option>
        <option value="Superhero Comedy">Superhero Comedy</option>
        <option value="Fiction Horror">Fiction Horror</option>
        <option value="Gothic Superhero">Gothic Superhero</option>
        <option value="Animated">Animated</option>
      </select>

      {/* Movie Posters */}
      <div className="posters">
        {filteredMovies.map((movie) => (
          <img
            key={movie.id}
            src={movie.poster}
            alt={movie.title}
            onClick={() => handlePosterClick(movie)}
            className="poster-image"
          />
        ))}
      </div>

      {/* Selected Movie Card */}
      {selectedMovie && <MovieCard movie={selectedMovie} />}
    </div>
  );
};

export default MovieList;
