import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import ThemeContext from "../../context/ThemeContext";
import "./MovieCard.css"; 
import RatingStars from "../ratingstars/RatingStars";

const movies = [
  {
    id: "66d6d634ae232139c8f2b641",
    title: "Deadpool & Wolverine",
    poster: "/src/assets/deadpool.jpg",
    description:
      "Deadpool & Wolverine is a 2024 American superhero film based on Marvel Comics featuring the characters Deadpool and Wolverine.",
    genre: "Superhero Comedy",
    rating: "8/10",
  },
  {
    id: "66d6d8380d583f8a4ac9fd5b",
    title: "Alien:Romulus",
    poster: "/src/assets/alien.jpg",
    description:
      "Romulus is a 2024 American science fiction horror film directed by Fede Álvarez and written by Álvarez and Rodo Sayagues",
    genre: "Fiction Horror",
    rating: "7/10",
  },
  {
    id: "66d6d94f0d583f8a4ac9fd5e",
    title: "The Crow",
    poster: "/src/assets/crow.jpg",
    description:
      "The Crow is a 2024 American gothic superhero film directed by Rupert Sanders",
    genre: "Gothic Superhero",
    rating: "4/10",
  },
  {
    id: "66d6da350d583f8a4ac9fd61",
    title: "Inside Out 2",
    poster: "/src/assets/insideout.jpg",
    description:
      "Inside Out 2 is a 2024 American animated coming-of-age film produced by Pixar Animation Studios for Walt Disney Pictures",
    genre: "Animated",
    rating: "8/10",
  },
];

const MovieCard = () => {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === id);
  const { theme } = useContext(ThemeContext);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmitReview = () => {
   window.alert(`Your review has been submitted successfully: ${review}`)
    setReview("");
  };

  return (
    <div className={`movie-card-container ${theme}`}>
      {movie ? (
        <div className={`movie-card ${theme}`}>
          <div className="movie-poster">
            <img src={movie.poster} alt={`${movie.title} Poster`} />
          </div>
          <div className="movie-details">
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Rating:</strong> {movie.rating}</p>
            <div className="rating-section">
            <RatingStars rating={rating} setRating={setRating} editable={true} /> {/* Add RatingStars */}
            </div>
            
            <div className="review-section">
              <h3>Write a Review</h3>
              <textarea
                className="review-input"
                value={review}
                onChange={handleReviewChange}
                placeholder="Write your review here..."
              />
              <button className="submit-btn" onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Movie not found.</p>
      )}
    </div>
  );
};

export default MovieCard;
