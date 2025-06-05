import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import { AuthProvider } from './context/AuthContext';

// import RestaurantCard from './components/pages/RestaurantCard ';
import RestaurantPage from './components/RestaurantPage';
import { CartProvider } from './context/CartContext';
import CartPage from './components/CartPage';
import MyOrders from './components/MyOrders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/user/:id" element={<RestaurantPage />} />
              <Route path="/cart" element={<CartPage/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/myorders" element={<MyOrders />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;