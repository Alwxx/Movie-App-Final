import axios from "axios";
import api from "./api";

const API_KEY = "c56e629d2ce4c5a38303801125569999";
const BASE_URL = "https://api.themoviedb.org/3";

export const discoverMovies = async (token) => {
  try {
    // Fetch movies from TMDB
    const tmdbResponse = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        page: 1,
        perPage: 20,
      },
    });

    const movies = tmdbResponse.data.results;

    //Only fetch if there's a token (user is logged in):
    if (token) {
      // Fetch user's favorites from your backend
      const userFavoritesResponse = await api.get("/api/movies/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userFavorites = userFavoritesResponse.data.data;

      // Mark movies as wishlisted if they exist in user's favorites
      const enrichedMovies = movies.map((movie) => ({
        ...movie,
        isWishlisted: userFavorites.some(
          (fav) => fav.movieId === movie.id.toString()
        ),
      }));
      return enrichedMovies;
    }
    return movies.map((movie) => ({
      ...movie,
      isWishlisted: false,
    }));
  } catch (error) {
    console.error("Error fetching movies or favorites:", error);
    throw error;
  }
};

export const fetchLocalMoviesWithWishlist = async (token, handleError) => {
  try {
    // Fetch local movies
    const { data: localMoviesResponse } = await api.get("/api/movies");
    const localMovies = localMoviesResponse.data.map((movie) => ({
      ...movie,
      poster_path: movie.poster_path || "https://picsum.photos/500", // Fallback poster path if missing
    }));

    if (token) {
      // Fetch user's favorites
      const { data: userFavoritesResponse } = await api.get(
        "/api/movies/favorites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userFavorites = userFavoritesResponse.data;
      // Merge local movies with wishlist status
      const final = localMovies.map((movie) => ({
        ...movie,
        isWishlisted: userFavorites.some((fav) => fav.id === movie._id),
      }));
      return final;
    }

    // If no token, return movies without wishlist status
    return localMovies.map((movie) => ({
      ...movie,
      isWishlisted: false,
    }));
  } catch (error) {
    handleError(error, "Failed to fetch local movies with wishlist");
    console.error("Error fetching local movies with wishlist:", error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
};
