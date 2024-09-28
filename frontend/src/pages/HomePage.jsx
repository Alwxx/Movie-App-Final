import { useEffect, useState } from "react";
import MovieCard from "../components/moviecard/MovieCard";
import api from "../services/api";
import MoviesHero from "../components/MoviesHero";

const HomePage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <MoviesHero />
      
    </div>
  );
};

export default HomePage;
