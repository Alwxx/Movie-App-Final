import { useState } from 'react';
const RatingStars = ({ rating, setRating, editable = true }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (newRating) => {
    if (editable) {
      setRating(newRating);
    }
  };

  return (
    <div style={{ fontSize: '24px', cursor: editable ? 'pointer' : 'default' }}>
      {/* Mapping over half-stars (e.g., 1, 1.5, 2, 2.5, etc.) */}
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRating(star)} 
          onMouseEnter={() => editable && setHoverRating(star)} 
          onMouseLeave={() => editable && setHoverRating(0)}
          style={{
            color: star <= (hoverRating || rating) ? 'gold' : 'gray',
            margin: '5px',
            transition: 'color 0.2s',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
