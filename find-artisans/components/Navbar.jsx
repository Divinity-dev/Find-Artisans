'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import Cookies from 'js-cookie'

import {
  Menu,
  X,
  UserCircle,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ REAL AUTH STATE
  const { user } = useSelector((state) => state.auth);

  

  const isLoggedIn = !!user;

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('token')
    Cookies.remove('role')
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const publicLinks = [
    { href: '/workers', label: 'Find Workers' },
    { href: '/about', label: 'About Us' },
    { href: '/jobs', label: 'Browse Jobs' },
    { href: '/how-it-works', label: 'How It Works' },
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

            {isLoggedIn ? (
              <>
                {/* DASHBOARD */}
                <Link
                  href={
                    user.role === 'admin'
                      ? '/admin'
                      : user.role === 'worker'
                      ? '/workers-dashboard'
                      : '/customers-dashboard'
                  }
                  className="flex items-center gap-2 text-gray-300 hover:text-white"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                {/* PROFILE */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2"
                >
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.fullName || 'profile'}
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-700 shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                      <UserCircle size={18} className="text-gray-300" />
                    </div>
                  )}
                </Link>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="text-orange-500 hover:underline"
                >
                  Sign Up
                </Link>
              </>
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

          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.fullName || 'profile'}
                    className="w-7 h-7 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
                    <UserCircle size={16} />
                  </div>
                )}
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="text-orange-500"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;