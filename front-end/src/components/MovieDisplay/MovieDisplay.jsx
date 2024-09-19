import RatingStars from '../ratingstars/RatingStars';

const MovieDisplay = () => {

    const movieRating = 4;
  return (
    <div>
        <h3>Movie Title</h3>
        <RatingStars rating={movieRating} setRating={()=>{}} editable={false}/>
        <p>Overall rating: {movieRating} stars</p>
    </div>
  )
};

export default MovieDisplay;
