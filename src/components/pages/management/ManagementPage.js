import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, FileText, Users, Settings } from 'lucide-react';
import Navbar from '../../comman/Navbar';
import Footer from '../../comman/Footer';
// import MenuManagement from './MenuManagement';
// import OrderManagement from './OrderManagement';
// import ReservationManagement from './ReservationManagement';
import { useAuth } from '../../../context/AuthContext';

const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated or not a restaurant user
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'restaurant') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || user?.role !== 'restaurant') {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-[#0a1029] text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Restaurant Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-[#1c2756] rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-[#2a3563]">
                <h2 className="font-bold text-xl">Dashboard</h2>
              </div>
              
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`w-full flex items-center p-3 rounded-md mb-1 ${
                    activeTab === 'menu'
                      ? 'bg-[#6c63ff] text-white'
                      : 'hover:bg-[#2a3563] text-gray-300'
                  }`}
                >
                  <Menu size={20} className="mr-3" />
                  <span>Menu Management</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center p-3 rounded-md mb-1 ${
                    activeTab === 'orders'
                      ? 'bg-[#6c63ff] text-white'
                      : 'hover:bg-[#2a3563] text-gray-300'
                  }`}
                >
                  <FileText size={20} className="mr-3" />
                  <span>Order Management</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('reservations')}
                  className={`w-full flex items-center p-3 rounded-md mb-1 ${
                    activeTab === 'reservations'
                      ? 'bg-[#6c63ff] text-white'
                      : 'hover:bg-[#2a3563] text-gray-300'
                  }`}
                >
                  <Users size={20} className="mr-3" />
                  <span>Reservations</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center p-3 rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-[#6c63ff] text-white'
                      : 'hover:bg-[#2a3563] text-gray-300'
                  }`}
                >
                  <Settings size={20} className="mr-3" />
                  <span>Settings</span>
                </button>
              </nav>
              
              <div className="p-4 border-t border-[#2a3563]">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#6c63ff] flex items-center justify-center mr-3">
                    <span className="font-bold">{user?.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-400">Restaurant Manager</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1c2756] rounded-lg shadow-md mt-6 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2a3563] p-3 rounded-md text-center">
                  <h3 className="text-2xl font-bold text-[#6c63ff]">12</h3>
                  <p className="text-sm text-gray-300">Active Orders</p>
                </div>
                
                <div className="bg-[#2a3563] p-3 rounded-md text-center">
                  <h3 className="text-2xl font-bold text-[#6c63ff]">8</h3>
                  <p className="text-sm text-gray-300">Reservations</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4">
            {/* {activeTab === 'menu' && <MenuManagement />} */}
            {/* {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'reservations' && <ReservationManagement />}
            {activeTab === 'settings' && (
              <div className="bg-[#1c2756] rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Restaurant Settings</h2>
                <p className="text-gray-300 mb-4">
                  This section is under development. Soon you'll be able to update your restaurant profile, 
                  opening hours, and other settings.
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ManagementPage;