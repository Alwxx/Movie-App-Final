import { useContext, useEffect, useState } from "react";
import { discoverMovies } from "../services/movieApiService";
import Spinner from "./UI/Spinner";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import clsx from "clsx";
import MovieCard from "./UI/MovieCard";
import AuthContext from "../context/AuthContext";
import { useHandleError } from "../utils/functions";
function MoviesHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useContext(AuthContext);
  const handleError = useHandleError();
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const data = await discoverMovies(token, handleError);
        const finalMovies = data.filter((mov) => mov.poster_path);
        setMovies(finalMovies);
      } catch (error) {
        handleError(error);
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMove = (splide, currentSlide) => {
    setActiveSlide(currentSlide);
  };
  return (
    <div
      className={`min-h-[90vh]  dark:bg-gray-900 bg-gray-200 flex  pb-[35px] relative overflow-hidden white dark:text-white ${
        isLoading ? "items-center justify-center" : "items-end"
      }`}
    >
      {movies.length && movies[activeSlide].backdrop_path ? (
        <div className="top-1/2 -translate-x-1/2 -translate-y-1/2 w-full absolute left-1/2 pointer-events-none imageBg">
          <img
            className="w-full"
            src={`https://image.tmdb.org/t/p/w1280${movies[activeSlide].backdrop_path}`}
          />
        </div>
      ) : (
        <></>
      )}
      {isLoading ? (
        <Spinner width="w-12" height="h-12" />
      ) : movies.length ? (
        <div className="h-full relative">
          <Splide
            onMove={handleMove}
            aria-label="Discover Movies"
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
              (movie, index) =>
                movie.poster_path && (
                  <SplideSlide
                    key={movie.id}
                    className={clsx("transition-all")}
                  >
                    <MovieCard
                      movie={movie}
                      isWishlisted={movie.isWishlisted}
                    />
                  </SplideSlide>
                )
            )}
          </Splide>
        </div>
      ) : (
        <p className="dark:text-white">No movies found</p>
      )}
    </div>
  );
}

export default MoviesHero;
