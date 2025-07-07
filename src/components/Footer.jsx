import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-auto bg-white rounded-lg flex items-center justify-center">
              <img src="https://AidibySmartTech.b-cdn.net/SmartTech-logo.png" alt="" />
            </div>
            <span className="text-xl font-bold">Smart Tech</span>
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaWhatsapp className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <FaTiktok className="w-6 h-6" />
            </a>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-800 w-full pt-8 text-center">
            <p className="text-gray-400 text-sm">
              <a href="/admin">©</a> 2025 Smart Tech. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;