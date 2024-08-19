"use client";

import { useState } from 'react';
import Link from 'next/link';

export const runtime = "edge";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link id="logo" href="/">
          <h1 className="text-xl font-semibold text-gray-800">Currency Converter</h1>
        </Link>
        <button 
          onClick={toggleMenu} 
          className="lg:hidden text-gray-800 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className={`hidden lg:flex lg:items-center lg:space-x-4`}>
          <Link href="/documentation" className="text-blue-500 hover:underline">
                        Documentation
          </Link>
        </div>
      </div>

      {/* Dropdown menu for mobile */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} mt-2 bg-white`}>
        <Link href="/documentation" className="block text-blue-500 hover:underline py-2 px-4">
                    Documentation
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

