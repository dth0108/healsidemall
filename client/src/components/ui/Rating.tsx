interface RatingProps {
  value: number;
  count?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
}

const Rating = ({ value, count = 0, showCount = true, size = "md" }: RatingProps) => {
  // Round to nearest half
  const roundedValue = Math.round(value * 2) / 2;
  
  const sizeClass = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-xl",
  }[size];
  
  return (
    <div className="flex items-center">
      {/* Full stars */}
      {[...Array(Math.floor(roundedValue))].map((_, i) => (
        <i key={`star-full-${i}`} className={`ri-star-fill text-accent ${sizeClass}`}></i>
      ))}
      
      {/* Half star */}
      {roundedValue % 1 === 0.5 && (
        <i className={`ri-star-half-fill text-accent ${sizeClass}`}></i>
      )}
      
      {/* Empty stars */}
      {[...Array(5 - Math.ceil(roundedValue))].map((_, i) => (
        <i key={`star-empty-${i}`} className={`ri-star-line text-accent ${sizeClass}`}></i>
      ))}
      
      {showCount && count > 0 && (
        <span className="text-xs ml-1">({count})</span>
      )}
    </div>
  );
};

export default Rating;
