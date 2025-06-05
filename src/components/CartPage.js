import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './comman/Navbar';
import Footer from './comman/Footer';
import CartItem from './pages/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [isAuthenticated, navigate]);

  // const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // const availableSlots = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4'];

 

  const [confirmedParking, setConfirmedParking] = useState(false);
  const [wantsParking, setWantsParking] = useState(false);
  const [parkingName, setParkingName] = useState('');
  const [carNumber, setCarNumber] = useState('');

  const [orderType, setOrderType] = useState('Dine-In');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Add these new state variables for backend requirements
  const resid = cartItems.map(item=>(
    item.restaurantId
  ))
  console.log(resid)

  const [restaurantId] = useState(resid);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tableNumber, setTableNumber] = useState(2);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const subtotal = getCartTotal();
  const deliveryFee = orderType === 'Delivery' ? 30 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setLoading(true);

    try {
      // Prepare order data to match backend expectation
      const orderData = {
        restaurantId: restaurantId,
        items: cartItems.map(item => ({
          menuItemId: item._id || item.id, // Use _id if available, fallback to id
          quantity: item.quantity,
        })),
        orderType: orderType.toLowerCase(), // Convert to lowercase (dine-in, takeaway, delivery)
        parkingRequired: wantsParking && confirmedParking,
        paymentMethod: paymentMethod,
        deliveryAddress: orderType === 'Delivery' ? deliveryAddress : "",
        tableNumber: orderType === 'Dine-In' ? tableNumber : null,
        specialInstructions: specialInstructions
      };

      const token = Cookies.get('accessToken');
      console.log(token);
      if (!token) {
        alert('Access token missing. Please log in again.');
        navigate('/login');
        return;
      }

      
      // Make API request using axios
      const response = await axios.post(
        'http://localhost:8000/api/v1/user/order',
        orderData,
        {
          withCredentials: true, // Send cookies
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Order placed successfully:', response.data);

      setOrderPlaced(true);
      clearCart();

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error placing order:', error);

      // Handle axios error response
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
      alert(`Failed to place order: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0a1029] text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="bg-[#1c2756] max-w-md mx-auto p-8 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-300 mb-6">
              Thank you for your order. We'll start preparing your food right away.
            </p>
            <Link to="/" className="inline-block px-6 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-md">
              Return to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1029] text-white">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#1c2756] rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
              <div className="space-y-1">
                {cartItems.map((item) => (
                  <CartItem key={item._id || item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-[#1c2756] rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex space-x-3 mb-4">
                {['Dine-In', 'Takeaway', 'Delivery'].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-lg ${orderType === type ? 'bg-blue-600 text-white' : 'bg-gray-400'
                      }`}
                    onClick={() => setOrderType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
                </div>

                {orderType === 'Delivery' && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Delivery Fee</span>
                    <span>Rs {deliveryFee.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-300">Tax</span>
                  <span>Rs {tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-[#2a3563] pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rs {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Additional fields based on order type */}
            {orderType === 'Delivery' && (
              <div className="bg-[#1c2756] rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full px-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white"
                  rows={3}
                />
              </div>
            )}

            {orderType === 'Dine-In' && (
              <div className="bg-[#1c2756] rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Table Information</h2>
                <div>
                  <label className="block text-gray-300 mb-2">Table Number</label>
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white"
                  />
                </div>
              </div>
            )}

            <div className="bg-[#1c2756] rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests or instructions..."
                className="w-full px-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white"
                rows={2}
              />
            </div>

            <div className="bg-[#1c2756] rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Car size={24} className="mr-2 text-[#6c63ff]" />
                Do you need parking?
              </h2>

              <div className="flex space-x-3">
                <button
                  className={`px-4 py-2 rounded-lg ${wantsParking ? 'bg-blue-600 text-white' : 'bg-gray-400'}`}
                  onClick={() => setWantsParking(true)}
                >
                  Yes
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${!wantsParking ? 'bg-blue-600 text-white' : 'bg-gray-400'}`}
                  onClick={() => {
                    setWantsParking(false);
                    setConfirmedParking(false);
                  }}
                >
                  No
                </button>
              </div>

              {!confirmedParking && wantsParking && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-300">Vehicle Count</label>
                    <input
                      type="text"
                      value={parkingName}
                      onChange={(e) => setParkingName(e.target.value)}
                      className="w-full px-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300">Available Slots</label>
                    {/* <div className="space-y-2">
                      {availableSlots.map((slot) => (
                        <label key={slot} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedSlots.includes(slot)}
                            onChange={() => handleSlotSelection(slot)}
                            className="w-4 h-4"
                          />
                          <span>{slot}</span>
                        </label>
                      ))}
                    </div> */}
                  </div>
                  <div>
                    <label className="block text-gray-300">Car Number</label>
                    <input
                      type="text"
                      value={carNumber}
                      onChange={(e) => setCarNumber(e.target.value)}
                      className="w-full px-4 py-2 rounded bg-[#2a3563] border border-[#3b4784] text-white"
                    />
                  </div>
                  <button
                    className="w-full py-3 bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-md"
                    onClick={() => setConfirmedParking(true)}
                  >
                    Confirm Parking
                  </button>
                </div>
              )}
            </div>

            <div className="bg-[#1c2756] rounded-lg shadow-md mt-5 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {['cash', 'card'].map((method) => (
                  <label
                    key={method}
                    className="flex items-center p-3 border border-[#2a3563] rounded-md cursor-pointer hover:border-[#6c63ff]"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="mr-3"
                    />
                    {method === 'card' ? (
                      <CreditCard size={20} className="mr-2 text-[#6c63ff]" />
                    ) : (
                      <Banknote size={20} className="mr-2 text-[#6c63ff]" />
                    )}
                    <span>{method === 'card' ? 'Credit/Debit Card' : 'Cash on Counter'}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-3 rounded-md font-medium ${loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#6c63ff] hover:bg-[#5a52d5]'
                } text-white`}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;