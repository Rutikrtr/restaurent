import React from 'react'
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0f1736] text-white pt-12 pb-6 ">
      <div className="container mx-auto px-6 ">
        <div className="flex justify-between items-center w-full    ">
          <div>
            <h3 className="text-xl font-bold mb-4">FoodFinder</h3>
            <p className="text-gray-300 mb-4">
              Discover the best food from over 1,000 <br/>restaurants and fast delivery to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#6c63ff]">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#6c63ff]">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#6c63ff]">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div className=''>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link to="/restaurants" className="text-gray-300 hover:text-white">Restaurants</Link></li>
              <li><Link to="/partner" className="text-gray-300 hover:text-white">Become a Partner</Link></li>
            </ul>
          </div>
          
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-300 hover:text-white">Cookies Policy</Link></li>
              <li><Link to="/disputes" className="text-gray-300 hover:text-white">Disputes</Link></li>
            </ul>
          </div> */}
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 text-[#6c63ff]" />
                <span className="text-gray-300">123 Food Street, Foodville</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-[#6c63ff]" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-[#6c63ff]" />
                <span className="text-gray-300">support@foodfinder.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FoodFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer