import { useState } from 'react'
import RatingStars from '../ratingstars/RatingStars';

export const MovieRating = () =>{
    const [userRating, setUserRating] = useState(0);


  return (
    <div>
        <h3>Rate this movie:</h3>
        <RatingStars rating={userRating} setRating={setUserRating} editable={true}/>
        <p>Your rating: {userRating} stars</p>
    </div>
  )
};

export default MovieRating;
