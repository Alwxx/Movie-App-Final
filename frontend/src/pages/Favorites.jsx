import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/UI/Spinner";
import { Link } from "react-router-dom";
import MovieCard from "../components/UI/MovieCard";
import { ShareIcon } from "@heroicons/react/24/outline";
import AuthContext from "../context/AuthContext";
import api from "../services/api";

const API_KEY = "c56e629d2ce4c5a38303801125569999";
const BASE_URL = "https://api.themoviedb.org/3";

const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
};

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const { token } = useContext(AuthContext);
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/api/movies/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const moviePromises = data.data.map((favorite) =>
          fetchMovieDetails(favorite.movieId)
        );

        const movieDetails = await Promise.all(moviePromises);
        setMovies(movieDetails);
      } catch (error) {
        toast.error("Failed to load favorites. Please try again.");
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await api.post(
        "/api/movies/share",
        { email: recipientEmail, movies },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Wishlist shared successfully!");
      setShowModal(false);
      setRecipientEmail("");
    } catch (error) {
      toast.error("Failed to share wishlist. Please try again.");
      console.error("Error sharing wishlist:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="dark:bg-gray-800 bg-gray-200 py-6 px-6 flex-1 flex">
      <div className="flex-1 flex items-center bg-white rounded-lg shadow-lg dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold">Your Favorites</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Here are the movies you’ve added to your wishlist.
            </p>
            {!isLoading && movies.length > 0 && (
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded shadow hover:bg-red-500 focus:outline-none flex gap-2 mx-auto"
                onClick={() => setShowModal(true)}
              >
                <ShareIcon width={25} />
                Share Wishlist
              </button>
            )}
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner width="w-12" height="h-12" />
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie, index) => (
                <MovieCard
                  key={index}
                  movie={movie}
                  isWishlisted={true}
                  showLoader={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>No favorites found.</p>
              <Link
                to={`/`}
                className="flex mt-4 w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Start Adding!
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Share Wishlist
            </h2>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient's email"
              className="w-full mb-4 px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded shadow"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-500 focus:outline-none"
                onClick={handleShare}
                disabled={isSharing}
              >
                {isSharing ? <Spinner width="w-6" height="h-6" /> : "Share"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
