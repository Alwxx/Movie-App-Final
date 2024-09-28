import axios from "axios";
import { toast } from "react-toastify";

const API_KEY = "c56e629d2ce4c5a38303801125569999";
const BASE_URL = "https://api.themoviedb.org/3";

export const discoverMovies = async () => {
  const response = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      page: 1,
      perPage: 20,
    },
  });
  return response.data.results;
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


