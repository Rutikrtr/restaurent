import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item._id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1);
    } else {
      removeFromCart(item._id);
    }
  };

  const handleRemove = () => {
    removeFromCart(item._id);
  };

  const totalPrice = parseFloat(item.price) * item.quantity;

  return (
    <div className="flex items-center py-4 border-b border-[#2a3563]">
      <div className="w-20 h-20 rounded-md overflow-hidden mr-4">
        <img 
          src={item.image || '/default-food-image.jpg'} 
          alt={item.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-food-image.jpg';
          }}
        />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-medium text-white">{item.name}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs">Rs {item.price} each</span>
            <span className="text-[#6c63ff] font-bold text-lg">Rs {totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDecrement}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2a3563] hover:bg-[#3b4784] transition-colors"
            >
              <Minus size={16} />
            </button>
            
            <span className="text-white font-medium min-w-[24px] text-center">{item.quantity}</span>
            
            <button 
              onClick={handleIncrement}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2a3563] hover:bg-[#3b4784] transition-colors"
            >
              <Plus size={16} />
            </button>
            
            <button 
              onClick={handleRemove}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 ml-2 transition-colors"
              title="Remove item"
            >
              <Trash2 size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;