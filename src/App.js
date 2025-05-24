import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurentContext';
import ManagementPage from './components/pages/management/ManagementPage';
import RegisterPageRestorant from './components/RegisterPageRestorant';
// import RestaurantCard from './components/pages/RestaurantCard ';
import RestaurantPage from './components/RestaurantPage';
function App() {
  return (
    <AuthProvider>
    <RestaurantProvider>
    <Router>
            <Routes>
              <Route path="/" element={<Homepage/>} />
              <Route path="/user/:id" element={<RestaurantPage />} />
              {/* <Route path="/cart" element={<CartPage />} /> */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/registerrestaurant" element={<RegisterPageRestorant />} />
              {/* <Route path="/register-restaurant" element={<RestaurantRegistrationPage />} /> */}
              <Route path="/management" element={<ManagementPage/>} />
            </Routes>
          </Router>
          </RestaurantProvider>
          </AuthProvider>
  );
}

export default App;