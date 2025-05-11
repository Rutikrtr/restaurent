import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  // Fallback image handling
  const [imageError, setImageError] = React.useState(false);
  const handleImageError = () => setImageError(true);

  // Rating display formatting
  const formattedRating = restaurant.rating?.toFixed(1) || '0.0';

  return (
    <Link 
      to={`/restaurant/${restaurant.id}`} 
      className="block group"
      aria-label={`View details for ${restaurant.name}`}
    >
      <div className="bg-[#1c2756] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={imageError ? '/default-restaurant.jpg' : restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
            loading="lazy"
            onError={handleImageError}
          />
          {/* Popularity Badge */}
          {restaurant.rating >= 4.5 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <Star size={14} className="mr-1" />
              <span>Popular</span>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white truncate">
              {restaurant.name}
            </h3>
            <div className="flex items-center bg-[#6c63ff] px-2 py-1 rounded min-w-[70px] justify-center">
              <Star size={16} className="text-yellow-300 mr-1" />
              <span className="text-white font-medium">{formattedRating}</span>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4 line-clamp-2 min-h-[3em]">
            {restaurant.introduction || 'No description available'}
          </p>
          
          <div className="space-y-2">
            {restaurant.openingTime && restaurant.closingTime ? (
              <div className="flex items-center text-gray-400">
                <Clock size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">
                  {restaurant.openingTime} - {restaurant.closingTime}
                </span>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Hours not available</div>
            )}
            
            {restaurant.location ? (
              <div className="flex items-center text-gray-400">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">{restaurant.location}</span>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Location not specified</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;