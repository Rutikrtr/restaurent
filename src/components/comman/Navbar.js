import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

const Navbar = ({managerEmails = []} ) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const validEmails = Array.isArray(managerEmails) ? managerEmails : [];
  const hasRestaurant = isAuthenticated && 
                      user?.email ;
  return (
    <nav className="bg-[#0f1736] text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          DGDign
        </Link>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {hasRestaurant ? (
                <Link to="/management" className="hover:text-[#8a9cf5]">
                  Management
                </Link>
              ) : user?.role === 'restaurant' && (
                <Link 
                  to="/registerrestaurant" 
                  className="bg-[#6c63ff] hover:bg-[#5a52d5] px-4 py-2 rounded-full"
                >
                  New Restaurant
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <User size={24} />
                <span>{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-[#8a9cf5]"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#8a9cf5]">Login</Link>
              <Link 
                to="/register" 
                className="bg-[#6c63ff] hover:bg-[#5a52d5] px-4 py-2 rounded-full"
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