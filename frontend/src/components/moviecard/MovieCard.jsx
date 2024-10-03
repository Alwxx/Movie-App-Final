import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ThemeContext from "../../context/ThemeContext";
import RatingStars from "../ratingstars/RatingStars";
import { fetchMovieDetails } from "../../services/movieApiService";
import { toast } from "react-toastify";
import axios from "axios";

const MovieCard = () => {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const [movie, setMovie] = useState(null);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch Movie Details and Reviews
    const fetchMovieInfo = async () => {
      try {
        const movieData = await fetchMovieDetails(id);
        setMovie(movieData);

        // Fetch reviews
        const reviewsData = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/reviews`,
          {
            params: { api_key: "c56e629d2ce4c5a38303801125569999" },
          }
        );
        setReviews(reviewsData.data.results);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error fetching movie details.");
        console.error("Error fetching movie details:", error);
        setIsLoading(false);
      }
    };
    fetchMovieInfo();
  }, [id]);

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmitReview = () => {
    toast.success(`Your review has been submitted successfully: ${review}`);
    setReview("");
  };

  return (
    <div className={`min-h-screen py-8 px-4 bg-gray-900 ${theme}`}>
      {isLoading ? (
        <p className="text-center text-white">Loading movie details...</p>
      ) : movie ? (
        <div className="flex flex-col md:flex-row items-start max-w-4xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-6 gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} Poster`}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Movie Details */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <p className="text-lg">{movie.overview}</p>
            <p>
              <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p>
              <strong>Genre:</strong>{" "}
              {movie.genres && movie.genres.map((g) => g.name).join(", ")}
            </p>
            <p>
              <strong>Rating:</strong> {movie.vote_average} / 10
            </p>

            {/* Add Ratings */}
            <div className="rating-section">
              <strong>Your Rating:</strong>
              <RatingStars
                rating={rating}
                setRating={setRating}
                editable={true}
              />
            </div>

            {/* Reviews Section */}
            <div className="review-section mt-6">
              <h3 className="text-2xl font-bold mb-4">Reviews</h3>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-700 p-4 mb-4 rounded-lg"
                  >
                    <p className="font-bold">{review.author}</p>
                    <p>{review.content}</p>
                  </div>
                ))
              ) : (
                <p>No reviews available for this movie.</p>
              )}
            </div>

            {/* Write a Review */}
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-4">Write a Review</h3>
              <textarea
                className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white"
                value={review}
                onChange={handleReviewChange}
                placeholder="Write your review here..."
              />
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-white">Movie not found.</p>
      )}
    </div>
  );
};

export default MovieCard;
