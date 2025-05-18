import React, { createContext, useContext, useState, useEffect } from 'react';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState(() => {
    const savedRestaurants = localStorage.getItem('restaurants');
    return savedRestaurants ? JSON.parse(savedRestaurants) : [];
  });

  useEffect(() => {
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  const addRestaurant = (restaurant) => {
    const newRestaurant = {
      ...restaurant,
      id: Date.now().toString(),
      categories: [],
      rating: 0
    };
    setRestaurants((prev) => [...prev, newRestaurant]);
    return newRestaurant.id;
  };

  const updateRestaurant = (id, restaurantData) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, ...restaurantData } : restaurant
      )
    );
  };

  const getRestaurantById = (id) => {
    return restaurants.find((restaurant) => restaurant.id === id);
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        addRestaurant,
        updateRestaurant,
        getRestaurantById
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurants = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurants must be used within a RestaurantProvider');
  }
  return context;
};
