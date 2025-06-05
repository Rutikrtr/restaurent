import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Package, Utensils, Car, CreditCard, Banknote, Filter } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

import { useAuth } from '../context/AuthContext';
import Navbar from './comman/Navbar';
import Footer from './comman/Footer';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('pending'); // Default to pending orders
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/my-orders' } });
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  // Filter orders whenever orders or activeFilter changes
  useEffect(() => {
    filterOrders();
  }, [orders, activeFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('accessToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        'http://localhost:8000/api/v1/user/order/customer',
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [];
    
    switch (activeFilter) {
      case 'pending':
        filtered = orders.filter(order => 
          ['pending', 'approved', 'preparing', 'ready'].includes(order.status.toLowerCase())
        );
        break;
      case 'completed':
        filtered = orders.filter(order => 
          order.status.toLowerCase() === 'completed'
        );
        break;
      case 'all':
      default:
        filtered = orders;
        break;
    }
    
    setFilteredOrders(filtered);
  };

  const getFilterButtonClass = (filterType) => {
    return `px-4 py-2 rounded-lg font-medium transition-colors ${
      activeFilter === filterType
        ? 'bg-[#6c63ff] text-white'
        : 'bg-[#1c2756] text-gray-300 hover:bg-[#2a3563] hover:text-white'
    }`;
  };

  const getOrderCount = (filterType) => {
    switch (filterType) {
      case 'pending':
        return orders.filter(order => 
          ['pending', 'approved', 'preparing', 'ready'].includes(order.status.toLowerCase())
        ).length;
      case 'completed':
        return orders.filter(order => 
          order.status.toLowerCase() === 'completed'
        ).length;
      case 'all':
      default:
        return orders.length;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'approved':
      case 'preparing':
        return <Package className="text-blue-500" size={20} />;
      case 'ready':
        return <Utensils className="text-green-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'approved':
      case 'preparing':
        return 'text-blue-500 bg-blue-500/10';
      case 'ready':
        return 'text-green-500 bg-green-500/10';
      case 'completed':
        return 'text-green-600 bg-green-600/10';
      case 'rejected':
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1029] text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="text-xl">Loading your orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1029] text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={fetchOrders}
            className="px-6 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-md"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1029] text-white">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Filter size={16} />
            <span>Total Orders: {orders.length}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter('pending')}
            className={getFilterButtonClass('pending')}
          >
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>Pending Orders</span>
              <span className="bg-black/20 px-2 py-1 rounded-full text-xs">
                {getOrderCount('pending')}
              </span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveFilter('completed')}
            className={getFilterButtonClass('completed')}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>Completed Orders</span>
              <span className="bg-black/20 px-2 py-1 rounded-full text-xs">
                {getOrderCount('completed')}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveFilter('all')}
            className={getFilterButtonClass('all')}
          >
            <div className="flex items-center space-x-2">
              <Package size={16} />
              <span>All Orders</span>
              <span className="bg-black/20 px-2 py-1 rounded-full text-xs">
                {getOrderCount('all')}
              </span>
            </div>
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">
              {activeFilter === 'pending' && 'No pending orders'}
              {activeFilter === 'completed' && 'No completed orders'}
              {activeFilter === 'all' && 'No orders found'}
            </div>
            <p className="text-gray-500 mb-6">
              {activeFilter === 'pending' && 'You don\'t have any pending orders at the moment.'}
              {activeFilter === 'completed' && 'You haven\'t completed any orders yet.'}
              {activeFilter === 'all' && 'You haven\'t placed any orders yet.'}
            </p>
            {activeFilter !== 'all' && (
              <button 
                onClick={() => setActiveFilter('all')}
                className="px-6 py-3 bg-[#2a3563] hover:bg-[#374088] rounded-md mr-4"
              >
                View All Orders
              </button>
            )}
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-md"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-[#1c2756] rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-gray-400">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="text-gray-400">
                      Restaurant: {order.restaurant?.name || 'Unknown Restaurant'}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-medium capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            {item.name} x {item.quantity}
                          </span>
                          <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Order Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Utensils size={16} className="text-[#6c63ff]" />
                        <span className="text-gray-300">Type:</span>
                        <span className="capitalize">{order.orderType}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {order.paymentMethod === 'cash' ? (
                          <Banknote size={16} className="text-[#6c63ff]" />
                        ) : (
                          <CreditCard size={16} className="text-[#6c63ff]" />
                        )}
                        <span className="text-gray-300">Payment:</span>
                        <span className="capitalize">{order.paymentMethod}</span>
                      </div>

                      {order.parkingRequired && (
                        <div className="flex items-center space-x-2">
                          <Car size={16} className="text-[#6c63ff]" />
                          <span className="text-gray-300">Parking Required</span>
                        </div>
                      )}

                      {order.orderType === 'delivery' && order.deliveryAddress && (
                        <div className="mt-2">
                          <span className="text-gray-300">Delivery Address:</span>
                          <p className="text-sm mt-1">{order.deliveryAddress}</p>
                        </div>
                      )}

                      {order.orderType === 'dine-in' && order.tableNumber && (
                        <div>
                          <span className="text-gray-300">Table Number:</span>
                          <span className="ml-2">{order.tableNumber}</span>
                        </div>
                      )}

                      {order.specialInstructions && (
                        <div className="mt-2">
                          <span className="text-gray-300">Special Instructions:</span>
                          <p className="text-sm mt-1">{order.specialInstructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#2a3563] mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Subtotal:</span>
                        <span>Rs {order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Tax:</span>
                        <span>Rs {order.tax.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        Total: Rs {order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;