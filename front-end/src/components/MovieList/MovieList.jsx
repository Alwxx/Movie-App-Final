import { useState } from 'react';
import MovieCard from '../moviecard/MovieCard';
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
      poster: 'https://imgs.search.brave.com/9jR0pwO8V1iTyTV5Ab04oG0ADXfy7U_UiJD-NoGo100/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/bXBhd2FyZHMuY29t/LzIwMjQvcG9zdGVy/cy9kZWFkcG9vbF9h/bmRfd29sdmVyaW5l/X3ZlcjYuanBn',
      description: 'Deadpool & Wolverine is a 2024 American superhero film based on Marvel Comics featuring the characters Deadpool and Wolverine.',
      genre: 'Superhero Comedy',
      rating: '8/10',
    },
    {
      id: '66d6d8380d583f8a4ac9fd5b',
      title: 'Alien:Romulus',
      poster: 'https://imgs.search.brave.com/HTKoJGIKVlbhskbnxWHeD4R6TamRPkJecuGWhLmHPYc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMxLmNvbGxpZGVy/aW1hZ2VzLmNvbS93/b3JkcHJlc3Mvd3At/Y29udGVudC91cGxv/YWRzLzIwMjQvMDYv/YWxpZW4tcm9tdWx1/cy1maWxtLXBvc3Rl/ci5qcGc',
      description: 'Romulus is a 2024 American science fiction horror film directed by Fede Álvarez and written by Álvarez and Rodo Sayagues',
      genre: 'Fiction Horror',
      rating: '7/10',
    },
    {
      id: '66d6d94f0d583f8a4ac9fd5e',
      title: 'The Crow',
      poster: 'https://imgs.search.brave.com/TrMLmOaLK4jvJR4Nx5wZJr0DXv-DMhSl70tslX6Kxi0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMxLmNicmltYWdl/cy5jb20vd29yZHBy/ZXNzL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDI0LzA3L3RoZS1j/cm93LTIwMjQtcG9z/dGVyLXdpdGgtYmls/bC1za2Fyc2dhcmQt/c3Vycm91bmRlZC1i/eS1jcm93cy5qcGc',
      description: 'The Crow is a 2024 American gothic superhero film directed by Rupert Sanders',
      genre: 'Gothic Superhero',
      rating: '4/10',
    },
    {
      id: '66d6da350d583f8a4ac9fd61',
      title: 'Inside Out 2',
      poster: 'https://imgs.search.brave.com/OW0ALA1woB0qTIR0kzh3w5wz-34vlOvDjClj8KL_2YM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vcGl4YXJw/b3N0LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8wMy9J/bnNpZGUtT3V0LTIt/UG9zdGVyLmpwZWc_/cmVzaXplPTEwMDAs/MTQ4MSZzc2w9MQ',
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
