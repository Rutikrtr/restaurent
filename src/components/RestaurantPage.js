import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, MapPin, Phone, Mail } from "lucide-react";
import Navbar from "./comman/Navbar";
import Footer from "./comman/Footer";
import MenuItemCard from "./pages/MenuItemCard";
// import ReviewCard from "../components/customer/ReviewCard";
// import ReservationForm from "../components/customer/ReservationForm";
import axios from "axios";

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTab, setActiveTab] = useState("menu");
  const [restaurantReviews, setRestaurantReviews] = useState([]);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/user/${id}`
        );
        if (response.data.success) {
          setRestaurant(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleReservationSubmit = (formData) => {
    console.log("Reservation submitted:", formData);
    setReservationSuccess(true);
    setTimeout(() => setReservationSuccess(false), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1029] text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-xl">Loading restaurant details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#0a1029] text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-xl">Restaurant not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Get unique categories from menu items
  const categories = [
    ...new Set(restaurant.menu?.map((item) => item.category)),
  ];

  return (
    <div className="min-h-screen bg-[#0a1029] text-white">
      <Navbar />

      {/* {reservationSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
          Reservation successful! Confirmation email sent.
        </div>
      )} */}

      <div className="relative h-[400px]">
        <img
          src={imageError ? "/default-restaurant.jpg" : restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1029] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                <p className="text-gray-300 mb-2">{restaurant.introduction}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Star
                      size={16}
                      className="text-yellow-400 mr-1"
                      fill="#fcd34d"
                    />
                    <span>{restaurant.rating?.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>
                      {restaurant.openingTime} - {restaurant.closingTime}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span>{restaurant.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex border-b border-[#2a3563] mb-6">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-6 py-3 font-medium ${
              activeTab === "menu"
                ? "text-[#6c63ff] border-b-2 border-[#6c63ff]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 font-medium ${
              activeTab === "reviews"
                ? "text-[#6c63ff] border-b-2 border-[#6c63ff]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("reservation")}
            className={`px-6 py-3 font-medium ${
              activeTab === "reservation"
                ? "text-[#6c63ff] border-b-2 border-[#6c63ff]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Reservation
          </button>
        </div>

        {activeTab === "menu" && (
          <div>
            <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide">
              <button
                onClick={() => setActiveCategory("")}
                className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
                  activeCategory === ""
                    ? "bg-[#6c63ff] text-white"
                    : "bg-[#1c2756] text-gray-300 hover:bg-[#2a3563]"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
                    activeCategory === category
                      ? "bg-[#6c63ff] text-white"
                      : "bg-[#1c2756] text-gray-300 hover:bg-[#2a3563]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.menu
                ?.filter((item) =>
                  activeCategory ? item.category === activeCategory : true
                )
                .map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
          </div>
        )}

        {/* {activeTab === "reviews" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <button className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-md">
                Write a Review
              </button>
            </div>

            {restaurantReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurantReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-400">
                No reviews yet. Be the first to review this restaurant!
              </p>
            )}
          </div>
        )}

        {activeTab === "reservation" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Make a Reservation</h2>
            <ReservationForm onSubmit={handleReservationSubmit} />
          </div>
        )} */}
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantPage;