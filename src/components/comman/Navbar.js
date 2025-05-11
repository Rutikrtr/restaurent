import React from 'react'
import { Link } from 'react-router-dom';
// import { Search, ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-[#0f1736] text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          DGDign
        </Link>

        <div className="flex items-center space-x-6">
          {/* Mock Logged Out UI */}
          <Link to="/login" className="hover:text-[#8a9cf5]">Login</Link>
          <Link 
            to="/register" 
            className="bg-[#6c63ff] hover:bg-[#5a52d5] px-4 py-2 rounded-full"
          >
            Sign Up
          </Link>
          <Link 
            to="/registerrestaurant" 
            className="bg-[#6c63ff] hover:bg-[#5a52d5] px-4 py-2 rounded-full"
          >
            New Restaurant
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
