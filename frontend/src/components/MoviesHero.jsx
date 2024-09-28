import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { discoverMovies } from "../services/movieApiService";
import Spinner from "./UI/Spinner";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Link } from "react-router-dom";
import "@splidejs/react-splide/css";
import clsx from "clsx";
function MoviesHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundPoster, setBackgroundPoster] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const data = await discoverMovies();
        const finalMovies = data.filter((mov) => mov.poster_path);
        setMovies(finalMovies);
      } catch (error) {
        toast.error(
          "We're having troubles connecting to our database. We're working on it!"
        );
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
    <div className="min-h-[90vh] bg-gray-900 flex items-end pb-[35px] relative overflow-hidden ">
      {movies.length && movies[activeSlide].backdrop_path && (
        <div className="top-1/2 -translate-x-1/2 -translate-y-1/2 w-full absolute left-1/2 pointer-events-none imageBg">
          <img
            className="w-full"
            src={`https://image.tmdb.org/t/p/w1280${movies[activeSlide].backdrop_path}`}
          />
        </div>
      )}
      {isLoading ? (
        <Spinner width="w-12" height="h-12" />
      ) : movies.length ? (
        <div className="h-full relative">
          <Splide
            onMove={handleMove}
            aria-label="Discover Movies"
            options={{
              type: "loop",
              rewind: true,
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
                    <Link to={`/movies/${movie.id}`} className="flex h-full">
                      <img
                        className="object-cover"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                      />
                    </Link>
                  </SplideSlide>
                )
            )}
          </Splide>
        </div>
      ) : (
        <p>No movies found</p>
      )}
    </div>
  );
}

export default MoviesHero;
