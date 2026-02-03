import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[300px] md:h-[400px] bg-[#1c1c1c] text-white py-12 px-6 overflow-hidden z-0 rounded-t-[3rem]">
      <div className="container mx-auto flex flex-col items-center">
        <div className="text-gray-500 text-sm tracking-wider">
          © 2025 Saurabh Lokhande. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;