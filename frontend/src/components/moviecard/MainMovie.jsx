import { useParams, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ThemeContext from "../../context/ThemeContext";
import { useHandleError } from "../../utils/functions";
import RatingStars from "../ratingstars/RatingStars";
import { fetchMovieDetails as fetchTMDBDetails } from "../../services/movieApiService";
import { toast } from "react-toastify";
import axios from "axios";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import AuthContext from "../../context/AuthContext";
import Spinner from "../UI/Spinner";
import Avatar from "../UI/Avatar";
import api from "../../services/api";

const MainMovie = () => {
  const { id } = useParams();
  const location = useLocation();
  const isLocal = new URLSearchParams(location.search).get("local") === "true";
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [originalRating, setOriginalRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRating, setIsRating] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [animating, setAnimating] = useState(false);
  const { token } = useContext(AuthContext);
  const handleError = useHandleError();

  useEffect(() => {
    const fetchMovieInfo = async () => {
      setIsLoading(true);
      try {
        let movieData;
        let endpoint = `/api/movies/${id}${isLocal ? "?local=true" : ""}`;
        const { data } = await api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isLocal) {
          movieData = data.data.movieDetails;
        } else {
          movieData = await fetchTMDBDetails(id);
        }
        setMovie(movieData);
        const userRating = data.data.userRating || 0;

        setComments(data.data.comments || []);
        setRating(userRating);
        setOriginalRating(userRating);
        setInWishlist(data.data.inWishlist || false);
      } catch (error) {
        handleError(error, "Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieInfo();
  }, [id, isLocal]);

  const updateWishlist = async () => {
    if (!movie || !movie.id) return;
    const previousState = inWishlist;

    setInWishlist(!inWishlist);
    setAnimating(true);
    try {
      const { data } = await api.post(
        "/api/movies/favorites",
        isLocal ? { movieId: movie.id } : { tmdbMovieId: movie.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success && data.message) {
        toast.error(data.message);
        setInWishlist(previousState);
      }
    } catch (error) {
      setInWishlist(previousState);
      handleError(error, "Failed to update wishlist");
    } finally {
      setAnimating(false);
    }
  };

  const submitRating = async () => {
    const previousRating = originalRating;
    setIsRating(true);
    try {
      const { data } = await api.post(
        `/api/movies/${id}/rate`,
        isLocal
          ? { rating, movieId: movie._id }
          : { rating, tmdbMovieId: movie.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOriginalRating(rating);
      toast.success(data.message || "Rating submitted successfully!");
    } catch (error) {
      setRating(previousRating);
      handleError(error, "Failed to submit rating");
    } finally {
      setIsRating(false);
    }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    setIsCommenting(true);
    try {
      const { data } = await api.post(
        `/api/movies/${id}/comments`,
        isLocal
          ? { content: newComment, movieId: movie._id }
          : { content: newComment, tmdbMovieId: movie.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) => [...prev, data.data]);
      setNewComment("");
      toast.success("Comment posted successfully!");
    } catch (error) {
      handleError(error, "Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`min-h-screen py-8 px-4 dark:bg-gray-800 bg-gray-200`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : movie ? (
        <div className="flex flex-col dark:bg-gray-900 bg-white md:flex-row items-start max-w-4xl mx-auto rounded-lg shadow-lg p-6 gap-8">
          <div className="relative w-full md:w-1/3">
            <img
              src={
                isLocal
                  ? movie.poster_path
                    ? movie.poster_path
                    : "https://picsum.photos/500"
                  : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              }
              alt={`${movie.title} Poster`}
              className="rounded-lg shadow-lg"
            />
            <div
              className="absolute top-2 right-2 cursor-pointer rounded-full p-2"
              onClick={updateWishlist}
            >
              {inWishlist ? (
                <SolidHeartIcon
                  className={`w-6 h-6 text-red-500 ${
                    animating && "animate-bounce"
                  }`}
                />
              ) : (
                <OutlineHeartIcon
                  className={`w-6 h-6 text-red-500 ${
                    animating && "animate-bounce"
                  }`}
                />
              )}
            </div>
          </div>

          {/* Movie Details */}
          <div className="w-full md:w-2/3 flex flex-col gap-2 dark:text-white ">
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <p>{movie.overview || movie.description}</p>
            <p>
              <strong>Release Date:</strong>{" "}
              {movie.release_date || movie.releaseDate}
            </p>
            {movie.genres && (
              <p>
                <strong>Genre:</strong>{" "}
                {movie.genres.map((g) => g.name).join(", ")}
              </p>
            )}
            {movie.vote_average && (
              <p>
                <strong>TMDB Rating:</strong> {movie.vote_average || "N/A"}
              </p>
            )}
            {/* Rating Section */}
            <div className="rating-section mt-4">
              <strong>Your Rating:</strong>
              <RatingStars rating={rating} setRating={setRating} editable />
              {rating !== originalRating && (
                <button
                  onClick={submitRating}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition min-w-20"
                >
                  {isRating ? (
                    <Spinner width="w-5" height="h-5" border={`border-2`} />
                  ) : (
                    "Submit Rating"
                  )}
                </button>
              )}
            </div>

            {/* Comments Section */}
            <div className="comments-section mt-6">
              <h3 className="text-2xl font-bold mb-4">Comments</h3>
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start gap-4 p-4 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <Avatar
                    showDropdown={false}
                    customUser={{ username: comment.user.username }}
                    size={40}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {comment.user.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full p-2 mb-4 rounded-lg dark:bg-gray-700 bg-gray-200 dark:text-white"
              />
              <button
                onClick={postComment}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition min-w-20"
              >
                {isCommenting ? (
                  <Spinner width="w-5" height="h-5" border={`border-2`} />
                ) : (
                  "Submit Comment"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Movie not found.</p>
      )}
    </div>
  );
};

export default MainMovie;
