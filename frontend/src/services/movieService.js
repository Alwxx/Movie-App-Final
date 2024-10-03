import axios from 'axios';

const API_URL = import.meta.env.PROD ? `${import.meta.env.VITE_SERVER_API_URI}/api/movies` : 'http://localhost:3001/api/movies'; 

export const fetchMovieById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    throw error;
  }
};

export const fetchAllMovies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching all movies:', error);
    throw error;
  }
};

export const submitReview = async (movieId, userId, rating, reviewText) => {
  try {
    const response = await axios.post('/api/reviews', { movieId, userId, rating, reviewText });
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
  }
};

export const getReviews = async (movieId) => {
  try {
    const response = await axios.get(`/api/reviews/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};
