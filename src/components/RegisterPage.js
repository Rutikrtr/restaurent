import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, User, Mail, Lock, AlertCircle, Clock, MapPin, FileText, Image, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  
  // OTP verification states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [tempRestaurantData, setTempRestaurantData] = useState(null);
  
  // Restaurant additional fields
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (role === 'customer') {
      // Direct signup for customer (sends OTP)
      await handleCustomerSignup();
    } else {
      // Show restaurant modal for additional details
      setShowRestaurantModal(true);
    }
  };

  const handleCustomerSignup = async () => {
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/signup`,
        { 
          fullname: name, 
          email: email, 
          password: password, 
          accountType: role 
        }
      );

      console.log('Customer signup response:', response.data);
      
      if (response.data.success) {
        // Store user ID for OTP verification
        setUserId(response.data.data.userId);
        setShowOTPModal(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Customer signup error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurantSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate restaurant fields
    if (!restaurantName || !introduction || !openingTime || !closingTime || !location || !imageUrl) {
      setError('Please fill in all restaurant details');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const restaurantData = {
        email: email,
        password: password,
        accountType: role,
        fullname: name,
        name: restaurantName,
        introduction: introduction,
        openingTime: openingTime,
        closingTime: closingTime,
        location: location,
        image: imageUrl
      };

      const response = await axios.post(
        `http://localhost:8000/api/v1/user/register`,
        restaurantData
      );

      console.log('Restaurant signup response:', response.data);
      
      if (response.data.success) {
        // Store data for OTP verification
        setUserId(response.data.data.userId);
        setTempRestaurantData(response.data.data.restaurantData);
        setShowRestaurantModal(false);
        setShowOTPModal(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Restaurant signup error:', err);
      setError(err.response?.data?.message || 'Restaurant registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let response;
      
      if (role === 'customer') {
        // Customer OTP verification
        response = await axios.post(
          `http://localhost:8000/api/v1/user/verify-email`,
          { 
            userId: userId, 
            otp: otp 
          }
        );
      } else {
        // Restaurant OTP verification
        response = await axios.post(
          `http://localhost:8000/api/v1/user/verify-restaurant`,
          { 
            userId: userId, 
            otp: otp,
            restaurantData: tempRestaurantData
          }
        );
      }

      console.log('OTP verification response:', response.data);
      
      if (response.data.success) {
        setShowOTPModal(false);
        // Navigate based on role
        if (role === 'customer') {
          navigate('/login');
        } else {
          navigate('/login', { 
            state: { 
              message: 'Restaurant registered successfully! Your registration is pending admin approval. Please check your email for confirmation.' 
            } 
          });
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      let response;
      
      if (role === 'customer') {
        response = await axios.post(
          `http://localhost:8000/api/v1/user/resend-otp`,
          { userId: userId }
        );
      } else {
        response = await axios.post(
          `http://localhost:8000/api/v1/user/resend-restaurant-otp`,
          { userId: userId }
        );
      }

      if (response.data.success) {
        alert('New OTP sent to your email!');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowRestaurantModal(false);
    setRestaurantName('');
    setIntroduction('');
    setOpeningTime('');
    setClosingTime('');
    setLocation('');
    setImageUrl('');
  };

  const closeOTPModal = () => {
    setShowOTPModal(false);
    setOtp('');
    setUserId('');
    setTempRestaurantData(null);
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
                {isLoading ? 'Processing...' : role === 'customer' ? 'Sign Up' : 'Continue'}
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

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c2756] rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-[#3b4784]">
              <h2 className="text-xl font-bold">Email Verification</h2>
              <button
                onClick={closeOTPModal}
                className="hover:bg-[#5a52d5] rounded-lg p-2"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleOTPVerification} className="p-6">
              <div className="text-center mb-6">
                <Shield size={48} className="mx-auto mb-4 text-[#6c63ff]" />
                <p className="text-gray-300 mb-2">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-white font-medium">{email}</p>
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4 flex items-start">
                  <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="otp" className="block text-gray-300 mb-2 text-center">
                  Enter 6-digit OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                  placeholder="000000"
                />
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-md font-medium bg-gray-600 hover:bg-gray-700 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className={`flex-1 py-3 rounded-md font-medium ${
                    isLoading || otp.length !== 6
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-[#6c63ff] hover:bg-[#5a52d5]'
                  }`}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>

              <p className="text-sm text-gray-400 text-center">
                Didn't receive the code? Check your spam folder or click resend.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Restaurant Details Modal */}
      {showRestaurantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c2756] rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-[#3b4784]">
              <h2 className="text-xl font-bold">Restaurant Details</h2>
              <button
                onClick={closeModal}
                className="hover:bg-[#5a52d5] rounded-lg p-2"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRestaurantSignup} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="restaurantName" className="block text-gray-300 mb-1">Restaurant Name</label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      id="restaurantName"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      placeholder="Vaishnavi's Kitchen"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="introduction" className="block text-gray-300 mb-1">Introduction</label>
                  <div className="relative">
                    <FileText size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <textarea
                      id="introduction"
                      value={introduction}
                      onChange={(e) => setIntroduction(e.target.value)}
                      required
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff] resize-none"
                      placeholder="Premium dining experience..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="openingTime" className="block text-gray-300 mb-1">Opening Time</label>
                    <div className="relative">
                      <Clock size={20} className="absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="time"
                        id="openingTime"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="closingTime" className="block text-gray-300 mb-1">Closing Time</label>
                    <div className="relative">
                      <Clock size={20} className="absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="time"
                        id="closingTime"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-gray-300 mb-1">Location</label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      placeholder="Hadapsar"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-gray-300 mb-1">Restaurant Image URL</label>
                  <div className="relative">
                    <Image size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="url"
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white focus:outline-none focus:border-[#6c63ff]"
                      placeholder="https://example.com/restaurant-image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-md font-medium bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 rounded-md font-medium ${
                    isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-[#6c63ff] hover:bg-[#5a52d5]'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default RegisterPage;