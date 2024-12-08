import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Link } from "react-router-dom";
import "@splidejs/react-splide/css";
import clsx from "clsx";

import { searchMovies, discoverMovies } from "../../services/movieApiService";
import Spinner from "../UI/Spinner";
import SelectableSearch from "../UI/SelectableSearch";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import MovieCard from "../UI/MovieCard";
import AuthContext from "../../context/AuthContext";
import { useHandleError } from "../../utils/functions";

function MovieList() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState({
    id: "All",
    name: "All",
  });

  const { token } = useContext(AuthContext);
  const handleError = useHandleError();

  const genreValues = [
    { id: "All", name: "All" },
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        let data;
        if (!searchTerm) {
          data = await discoverMovies(token, handleError);
        } else {
          data = await searchMovies(searchTerm, token, handleError);
        }

        let finalMovies = data.filter((mov) => mov.poster_path);
        if (selectedGenre.id !== "All") {
          finalMovies = finalMovies.filter((mov) =>
            mov.genre_ids.includes(selectedGenre.id)
          );
        }
        setMovies(finalMovies);
      } catch (error) {
        handleError(error);
        toast.error(
          "We're having trouble connecting to our database. We're working on it!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm, selectedGenre]);

  const handleMove = (splide, currentSlide) => {
    setActiveSlide(currentSlide);
  };

  return (
    <div
      className={`min-h-[90vh] pt-8 dark:bg-gray-800 bg-gray-200 transition-all flex items-center justify-center pb-[35px] relative overflow-hidden flex-col gap-24 ${
        isLoading ? "items-center justify-center" : "items-end"
      }`}
    >
      <div className="z-10 bg-gray-200 dark:bg-[#121212] shadow-xl transition-all w-[80vw] p-8">
        <div className="flex flex-col gap-4 max-w-[500px] m-auto">
          <div>
            <label className="block text-sm font-medium leading-6 dark:text-white text-gray-900 pb-2">
              Search
            </label>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded overflow-hidden">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search for a movie"
                className="block w-11/12 px-2 rounded-md border-0 py-1.5 dark:bg-gray-800 dark:text-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
              />
              <MagnifyingGlassIcon className="w-1/12 size-6 text-gray-400" />
            </div>
          </div>

          <SelectableSearch
            values={genreValues}
            onSelect={(selectedValue) =>
              setSelectedGenre(
                genreValues.find((val) => val.name === selectedValue)
              )
            }
          />
        </div>
      </div>

      {movies.length && movies[activeSlide]?.backdrop_path ? (
        <div className="top-1/2 -translate-x-1/2 -translate-y-1/2 w-full absolute left-1/2 pointer-events-none imageBg">
          <img
            className="w-full"
            src={`https://image.tmdb.org/t/p/w1280${movies[activeSlide].backdrop_path}`}
            alt="Backdrop"
          />
        </div>
      ) : null}

      {isLoading ? (
        <Spinner width="w-12" height="h-12" />
      ) : movies.length ? (
        <div className="h-full relative">
          <Splide
            onMove={handleMove}
            aria-label="Discover Movies"
            options={{
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
                480: { perPage: 1 },
              },
            }}
          >
            {movies.map((movie, index) => (
              <SplideSlide key={movie.id} className={clsx("transition-all")}>
                <MovieCard movie={movie} isWishlisted={movie.isWishlisted} />
              </SplideSlide>
            ))}
          </Splide>
        </div>
      ) : (
        <p className="text-gray-900 dark:text-white">No movies found</p>
      )}
    </div>
  );
}

export default MovieList;
