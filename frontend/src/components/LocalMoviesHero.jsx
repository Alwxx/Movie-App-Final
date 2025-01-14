import { useContext, useEffect, useState } from "react";
import api from "../services/api"; // Service for API calls
import Spinner from "./UI/Spinner";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import clsx from "clsx";
import MovieCard from "./UI/MovieCard";
import { useHandleError } from "../utils/functions";
import { fetchLocalMoviesWithWishlist } from "../services/movieApiService";
import AuthContext from "../context/AuthContext";

function LocalMoviesHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useHandleError();

  const { token, isLoading: isAuthLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchLocalMovies = async () => {
      if (isAuthLoading && !token) return;
      setIsLoading(true);
      try {
        const data = await fetchLocalMoviesWithWishlist(token, handleError);
        // Filter movies to ensure all required fields are present
        const finalMovies = data.map((movie) => ({
          ...movie,
          ...(!movie.poster_path && {
            poster_path: "https://picsum.photos/500",
          }),
        }));
        setMovies(finalMovies);
      } catch (error) {
        handleError(error, "Failed to fetch local movies");
        console.error("Error fetching local movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocalMovies();
  }, [token]);

  const handleMove = (splide, currentSlide) => {
    setActiveSlide(currentSlide);
  };

  return (
    <div
      className={`min-h-[90vh] dark:bg-gray-900 bg-gray-200 flex pb-[35px] relative overflow-hidden ${
        isLoading ? "items-center justify-center" : "items-end"
      }`}
    >
      <div className="top-1/2 -translate-x-1/2 -translate-y-1/2 w-full absolute left-1/2 pointer-events-none imageBg">
        <img
          className="w-full"
          src={`https://picsum.photos/seed/${Math.floor(
            Math.random() * activeSlide * 100
          )}/800`}
        />
      </div>

      {isLoading ? (
        <Spinner width="w-12" height="h-12" />
      ) : movies.length ? (
        <div className="h-full relative">
          <Splide
            onMove={handleMove}
            aria-label="Local Movies"
            options={{
              perPage: 6.5,
              gap: "2rem",
              speed: 1000,
              autoplay: true,
              interval: 5000,
              updateOnMove: true,
              pagination: false,
              arrows: false,
              focus: "center",
              breakpoints: {
                480: {
                  perPage: 1,
                },
              },
            }}
          >
            {movies.map(
              (movie) =>
                movie.poster_path && (
                  <SplideSlide
                    key={movie.id}
                    className={clsx("transition-all min-w-48")}
                  >
                    <MovieCard
                      movie={movie}
                      isWishlisted={movie.isWishlisted}
                      isLocal={true}
                    />
                  </SplideSlide>
                )
            )}
          </Splide>
        </div>
      ) : (
        <p className="dark:text-white">No local movies found</p>
      )}
    </div>
  );
}

export default LocalMoviesHero;
