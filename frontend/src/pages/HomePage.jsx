import { useEffect, useState } from "react";
import MovieCard from "../components/moviecard/MovieCard";
import api from "../services/api";
import MoviesHero from "../components/MoviesHero";

const HomePage = () => {
  return (
    <div>
      <MoviesHero />
    </div>
  );
};

export default HomePage;
