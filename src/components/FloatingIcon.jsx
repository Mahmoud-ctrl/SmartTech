import React, { useState } from 'react';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

// SVG Icon for the Plus/Close symbol
const PlusIcon = ({ isOpen }) => (
  <svg
    className={`w-8 h-8 text-white transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"></path>
  </svg>
);


// Individual Social Media Icon Component
const SocialIcon = ({ href, bgColor, children, distance, isOpen }) => {
  const style = {
    transform: isOpen ? `translateY(-${distance}rem)` : 'translateY(0)',
    transition: `transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`absolute flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${bgColor} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={style}
    >
      {children}
    </a>
  );
};


// Main Floating Social Media Component
const FloatingSocialMedia = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggles the open/closed state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center z-50">
      {/* Social Media Icons Container */}
      <div className="relative flex flex-col items-center">
        {/* Facebook Icon */}
        <SocialIcon href="https://facebook.com" bgColor="bg-blue-600" distance={13} isOpen={isOpen}>
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
          </svg>
        </SocialIcon>

        {/* Instagram Icon */}
        <SocialIcon href="https://instagram.com" bgColor="bg-pink-500" distance={8.5} isOpen={isOpen}>
            <FaInstagram className="w-8 h-8" />
        </SocialIcon>

        {/* WhatsApp Icon */}
        <SocialIcon href="https://whatsapp.com" bgColor="bg-green-500" distance={4} isOpen={isOpen}>
            <FaWhatsapp className="w-8 h-8" />
        </SocialIcon>
      </div>

      {/* Main Floating Action Button */}
      <button
        onClick={toggleMenu}
        className="relative z-10 flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full shadow-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        aria-label="Toggle Social Media Menu"
        aria-expanded={isOpen}
      >
        <PlusIcon isOpen={isOpen} />
      </button>
    </div>
  );
};

export default FloatingSocialMedia;