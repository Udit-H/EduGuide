import React from 'react';
import { BookOpenIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/solid';

function Navbar() {
  return (
    // Navbar uses the slightly lighter 'surface' color to stand out from the 'background'
    <header className="bg-surface shadow-md sticky top-0 z-50 border-b border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        {/* Logo/Brand Name */}
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-wider text-text-base">
            SkillAI
          </span>
        </div>

        {/* Desktop Navigation Links (Hidden on small screens) */}
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#" className="text-text-muted hover:text-primary transition duration-300">
            Home
          </a>
          <a href="#" className="text-text-muted hover:text-primary transition duration-300">
            My Roadmaps
          </a>
          <a href="#" className="text-text-muted hover:text-primary transition duration-300">
            About
          </a>
          
          {/* User/Login Button */}
          <button className="flex items-center space-x-2 p-2 rounded-full bg-primary hover:bg-primary-dark transition duration-300 text-background font-medium">
            <UserCircleIcon className="h-5 w-5" />
            <span>Login / Profile</span>
          </button>
        </nav>

        {/* Mobile Menu Button (Visible on small screens) */}
        <button className="md:hidden text-text-base hover:text-primary p-2 rounded-md transition duration-300">
            <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;