
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
function App() {
  return (
    <Router>
            <Routes>
              <Route path="/" element={<Homepage/>} />
              {/* <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/registerrestaurant" element={<RegisterPageRestorant />} />
              <Route path="/register-restaurant" element={<RestaurantRegistrationPage />} />
              <Route path="/management" element={<ManagementPage />} /> */}
            </Routes>
          </Router>
  );
}

export default App;
