'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  UserCircle,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // TEMP AUTH (replace later with real auth like NextAuth)
  const user = {
    name: 'John Doe',
    role: 'customer',
    isLoggedIn: true,
  };

  const publicLinks = [
    { href: '/workers', label: 'Find Workers' },
    { href: '/about', label: 'About Us' },
    { href: '/jobs', label: 'Browse Jobs' },
    { href: '/how-it-works', label: 'How It Works' },
  ];

  const authLinks = user.isLoggedIn
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/profile', label: 'Profile', icon: UserCircle },
      ]
    : [
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Sign Up' },
      ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-[90%] mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-white">Find</span>
            <span className="text-2xl font-extrabold text-orange-500">
              Artisans
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-4">

            {user.isLoggedIn ? (
              <>
                {authLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-white"
                    >
                      {Icon && <Icon size={18} />}
                      {link.label}
                    </Link>
                  );
                })}

                <button
                  onClick={() => console.log('logout')}
                  className="text-gray-400 hover:text-red-400"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-6 space-y-4 bg-gray-900 border-t border-gray-800">

          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <hr className="border-gray-700" />

          {authLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                {Icon && <Icon size={18} />}
                {link.label}
              </Link>
            );
          })}

          {user.isLoggedIn && (
            <button
              onClick={() => console.log('logout')}
              className="flex items-center gap-2 text-red-400"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;