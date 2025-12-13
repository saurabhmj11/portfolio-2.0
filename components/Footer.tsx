import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-black text-off-white py-24 px-4 md:px-8 overflow-hidden rounded-t-[3rem]">
      <div className="container mx-auto flex flex-col items-center">
        <div className="text-gray-500 text-sm tracking-wider">
          © 2025 Saurabh Lokhande. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;