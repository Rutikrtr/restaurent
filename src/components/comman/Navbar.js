import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ShoppingCart, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate total items in cart
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-[#0f1736] text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          DGDign
        </Link>

        <div className="flex items-center space-x-6">
          {/* Navigation items - Only visible when logged in */}
          {isAuthenticated && (
            <>
              {/* My Orders Link */}
              <Link
                to="/myorders"
                className="flex items-center space-x-1 hover:text-[#8a9cf5] transition-colors"
              >
                <ClipboardList size={20} />
                <span>My Orders</span>
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative flex items-center hover:text-[#8a9cf5] transition-colors"
              >
                <ShoppingCart size={24} />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </span>
                )}
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <User size={24} />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-[#8a9cf5] transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#8a9cf5] transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#6c63ff] hover:bg-[#5a52d5] px-4 py-2 rounded-full transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;