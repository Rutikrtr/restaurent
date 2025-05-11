import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './comman/Navbar';
import Footer from './comman/Footer';
import RestaurantCard from './pages/RestaurantCard ';
import { Search } from 'lucide-react';
const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/user');
        const rawRestaurants = response.data.data || [];
        
        const transformedData = rawRestaurants.map(restaurant => ({
          ...restaurant,
          menu: restaurant.menu || []
        }));

        setRestaurants(transformedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.introduction || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1029] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6c63ff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1029] text-white flex flex-col items-center justify-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-full"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1029] text-white">
      <Navbar/>

      <div className="relative h-[500px] bg-gradient-to-r from-[#0f1736] to-[#1c2756]">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover the Best Food & Drinks
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Explore top-rated restaurants, book tables, and order your favorite meals with ease
          </p>
          
          <div className="w-full max-w-xl relative">
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 px-6 pr-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6c63ff] focus:border-transparent"
            />
            <Search className="absolute right-4 top-4 text-white" size={24} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Popular Restaurants</h2>
        
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No restaurants found matching your search.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-6 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-full"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-[#1c2756] py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover, order, and enjoy your favorite meals in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#2a3563] p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#6c63ff] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Restaurants</h3>
              <p className="text-gray-300">
                Discover restaurants based on your location, cuisine preferences, or search directly
              </p>
            </div>
            
            <div className="bg-[#2a3563] p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#6c63ff] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 11h1a3 3 0 0 1 0 6h-1"></path>
                  <path d="M9 12v6"></path>
                  <path d="M13 12v6"></path>
                  <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5s2-.5 3-.5 2 .5 3 .5 1.44-.5 3-.5a2.5 2.5 0 0 1 0 5c-1.56 0-2-.5-3-.5Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Meal</h3>
              <p className="text-gray-300">
                Browse menus, read reviews, and select your favorite dishes or reserve a table
              </p>
            </div>
            
            <div className="bg-[#2a3563] p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-[#6c63ff] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Food</h3>
              <p className="text-gray-300">
                Pay securely, track your order, and enjoy your meal at the restaurant or at home
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default Homepage;