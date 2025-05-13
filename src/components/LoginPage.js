import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';
import Navbar from './comman/Navbar';
import Footer from './comman/Footer';
import { useAuth } from '../context/AuthContext';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use the login function from AuthContext instead of direct axios call
      await login(email, password);
      // On successful login, navigate to the intended page
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, don't render the login form at all
  if (isAuthenticated) {
    return null; // Or a loading spinner if preferred
  }

  return (
    <div className="min-h-screen bg-[#0a1029] text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto bg-[#1c2756] rounded-lg shadow-md overflow-hidden">
          <div>
            <Link to="/" className="hover:bg-[#5a52d5] rounded-lg float-right p-3">
              <X/>
            </Link>
          </div>
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
            
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4 flex items-start">
                <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-6 py-3 rounded-md font-medium ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-[#6c63ff] hover:bg-[#5a52d5]'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#6c63ff] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#2a3563]">
              <p className="text-sm text-gray-400 text-center">
                For demo purposes, use:<br />
                <strong>Customer:</strong> customer@example.com / password<br />
                <strong>Restaurant:</strong> restaurant@example.com / password
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;