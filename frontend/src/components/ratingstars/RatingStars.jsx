import { useState } from "react";
const RatingStars = ({ rating, setRating, editable = true }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (newRating) => {
    if (editable) {
      setRating(newRating);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div
        style={{ fontSize: "24px", cursor: editable ? "pointer" : "default" }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => editable && setHoverRating(star)}
            onMouseLeave={() => editable && setHoverRating(0)}
            style={{
              color: star <= (hoverRating || rating) ? "gold" : "gray",
              margin: "5px",
              transition: "color 0.2s",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <p className="text-sm font-semibold text-black dark:text-white">
        {rating} Star{rating > 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default RatingStars;
