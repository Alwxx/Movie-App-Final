import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";

import clsx from "clsx";
import AuthContext from "../../context/AuthContext";
import { useHandleError } from "../../utils/functions";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const MovieCard = ({ movie, isWishlisted, showLoader = false }) => {
  const [inWishlist, setInWishlist] = useState(isWishlisted);
  const [animating, setAnimating] = useState(false);
  const { token } = useContext(AuthContext);
  const handleError = useHandleError();
  const navigate = useNavigate();

  const updateWishlist = async () => {
    if (!movie || !movie.id) return;
    if (!token) {
      //User is not logged in
      toast.info("Please login first");
      navigate("/login");
      return;
    }
    const previousState = inWishlist;

    setInWishlist(!inWishlist);
    setAnimating(true);
    try {
      const { data } = await api.post(
        "/api/movies/favorites",
        { movieId: movie.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //Don't always show, only in case of error
      //   if (data.message) {
      //     toast[data.success ? "success" : "error"](data.message);
      //   }
      if (!data.success && data.message) {
        toast.error(data.message);
      }

      if (data.data && data.success) {
        if (data.data.movieId) {
          //Added:
          setInWishlist(true);
        } else {
          setInWishlist(false);
        }
      }
    } catch (error) {
      //Revert Wishlist
      setInWishlist(previousState);

      handleError(error, "Failed to update wishlist");
    } finally {
      setAnimating(false);
    }
  };

  return (
    <div className="relative group">
      {/* Wishlist Icon */}
      <div
        onClick={updateWishlist}
        className={clsx(
          "absolute top-2 right-2 cursor-pointer rounded-full p-2 z-50",
          animating && "animate-bounce2"
        )}
      >
        {inWishlist ? (
          <SolidHeartIcon className="w-6 h-6 text-red-500" />
        ) : (
          <OutlineHeartIcon className="w-6 h-6 text-red-500" />
        )}
      </div>
      <Link
        to={`/movies/${movie.id}`}
        className="flex h-full relative overflow-hidden rounded-md shadow-md"
      >
        {showLoader && animating && (
          <div className="absolute w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-10">
            <Spinner />
          </div>
        )}

        <div className="relative">
          <img
            className="w-full h-full object-cover "
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-4 rounded-md">
            <h3 className="text-lg font-bold text-white truncate">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-300">
              Rating: {movie.vote_average || "N/A"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
