import React from 'react'
import Navbar from './comman/Navbar'
import Footer from './comman/Footer'

const Homepage = () => {
  return (
    <div className="min-h-screen bg-[#0a1029] text-white">
      <Navbar/>
      
      {/* ... (keep the existing hero section JSX unchanged) */}

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Popular Restaurants</h2>
        
        {/* {filteredRestaurants.length > 0 ? (
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
        )} */}
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
                {/* <Search size={28} /> */}
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
      
      {/* <Footer/> */}
    </div>
  )
}

export default Homepage