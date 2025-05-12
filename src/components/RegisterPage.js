import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, User, Mail, Lock, AlertCircle } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

import Navbar from './comman/Navbar';
import Footer from './comman/Footer';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
//   const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      // Using environment variable for API endpoint
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/signup`,
        { fullname:name, email:email, password:password,accountType: role }
      );

      console.log('response',response.data);
      if(!response.data.success){
        setError(response.data.message)
      }
      
      
      if (role === 'restaurant') {
        navigate('/login');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0a1029] text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto bg-[#1c2756] rounded-lg shadow-md overflow-hidden">
          <div>
            <Link to="/" className="float-end hover:bg-[#5a52d5] rounded-lg p-3">
              <X/>
            </Link>
          </div>
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
            
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4 flex items-start">
                <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
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
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Account Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center p-3 border rounded-md cursor-pointer ${
                      role === 'customer' 
                        ? 'border-[#6c63ff] bg-[#6c63ff] bg-opacity-20' 
                        : 'border-[#3b4784] hover:border-[#6c63ff]'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="customer"
                        checked={role === 'customer'}
                        onChange={() => setRole('customer')}
                        className="sr-only"
                      />
                      <span>Customer</span>
                    </label>
                    
                    <label className={`flex items-center justify-center p-3 border rounded-md cursor-pointer ${
                      role === 'restaurant' 
                        ? 'border-[#6c63ff] bg-[#6c63ff] bg-opacity-20' 
                        : 'border-[#3b4784] hover:border-[#6c63ff]'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value="restaurant"
                        checked={role === 'restaurant'}
                        onChange={() => setRole('restaurant')}
                        className="sr-only"
                      />
                      <span>Restaurant</span>
                    </label>
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
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-[#6c63ff] hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;