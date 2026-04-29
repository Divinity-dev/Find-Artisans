'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              {/* Insert Logo Here */}
              LOGO
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/find-workers" className="text-gray-700 hover:text-black">
              Find Workers
            </Link>

            <Link href="/post-job" className="text-gray-700 hover:text-black">
              Post a Job
            </Link>

            <Link href="/how-it-works" className="text-gray-700 hover:text-black">
              How It Works
            </Link>

            <Link
              href="/login"
              className="text-gray-700 hover:text-black"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link href="/find-workers" className="block">
            Find Workers
          </Link>

          <Link href="/post-job" className="block">
            Post a Job
          </Link>

          <Link href="/how-it-works" className="block">
            How It Works
          </Link>

          <Link href="/login" className="block">
            Login
          </Link>

          <Link
            href="/register"
            className="block bg-black text-white text-center py-2 rounded-lg"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}