import React from 'react';
import { Plus } from 'lucide-react';
// import { useCart } from '../../context/CartContext';

const MenuItemCard = ({ item }) => {
//   const { addToCart } = useCart();

//   const handleAddToCart = () => {
//     addToCart(item);
//   };

  return (
    <div className={`bg-[#1c2756] rounded-lg overflow-hidden shadow-md ${!item.available ? 'opacity-60' : ''}`}>
      <div className="h-40 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
          <span className="text-[#6c63ff] font-bold">Rs. {item.price}</span>
        </div>
        
        <p className="text-gray-300 text-sm mt-1 mb-3 line-clamp-2">{item.description}</p>
        
        <button
        //   onClick={handleAddToCart}
          disabled={!item.available}
          className={`w-full py-2 rounded-md flex items-center justify-center space-x-2 
            ${item.available 
              ? 'bg-[#6c63ff] hover:bg-[#5a52d5] text-white' 
              : 'bg-gray-600 cursor-not-allowed text-gray-300'}`}
        >
          <Plus size={16} />
          <span>{item.available ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;