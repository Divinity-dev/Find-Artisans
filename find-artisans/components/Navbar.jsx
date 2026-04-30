'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, UserCircle } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-[90%] mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-white">
              Find
            </span>
            <span className="text-2xl font-extrabold text-orange-500">
              Artisans
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/find-workers" className="text-gray-200 hover:text-white transition">
              Find Workers
            </Link>

            <Link href="/post-job" className="text-gray-200 hover:text-white transition">
             How It Works
            </Link>

            <Link href="/jobs" className="text-gray-200 hover:text-white transition">
              Browse Jobs
            </Link>

            <Link href="/how-it-works" className="text-gray-200 hover:text-white transition">
              Dashboard
            </Link>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-5">

            <Link href="/login" className="text-gray-200 hover:text-white">
              Login
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200 hover:border-gray-400 transition"
            >
              Sign Up
            </Link>

            {/* Profile Icon (replaces Hire Now) */}
            <Link
              href="/profile"
              className="text-gray-200 hover:text-white"
              title="Profile"
            >
              <UserCircle size={30} />
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-6 space-y-4 bg-gray-900 border-t border-gray-800">

          <Link href="/find-workers" className="block text-gray-200">
            Find Workers
          </Link>

          <Link href="/post-job" className="block text-gray-200">
            Post a Job
          </Link>

          <Link href="/jobs" className="block text-gray-200">
            Browse Jobs
          </Link>

          <Link href="/how-it-works" className="block text-gray-200">
            How It Works
          </Link>

          <hr className="border-gray-700" />

          <Link href="/login" className="block text-gray-200">
            Login
          </Link>

          <Link href="/register" className="block border border-gray-600 text-center py-2 rounded-lg text-gray-200">
            Sign Up
          </Link>

          {/* Profile */}
          <Link href="/profile" className="block text-center text-orange-400">
            My Profile
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;