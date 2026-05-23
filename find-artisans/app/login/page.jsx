'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useDispatch, useSelector } from 'react-redux';

import {
  loginStart,
  loginSuccess,
  loginFail,
} from '@/redux/slices/authSlice';
import Cookies from 'js-cookie'

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
} from 'react-icons/fa';

import API from '../axios';

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] =
    useState(false);

  // =========================
  // REDIRECT USER
  // =========================
  const handleRedirect = (userData) => {
    const role = userData?.user?.role;

    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'customer') {
      router.push('/customers-dashboard');
    } else if (role === 'worker') {
      router.push('/workers-dashboard');
    } else {
      router.push('/');
    }
  };

  // =========================
  // FORMIK
  // =========================
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),

      password: Yup.string()
        .min(6, 'Password too short')
        .required('Password is required'),
    }),

    onSubmit: async (values) => {
      try {
        dispatch(loginStart());

        const { data } = await API.post(
          '/auth/login',
          values
        );

  Cookies.set('token', data.token, {
  expires: 7,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});

Cookies.set('role', data.user.role, {
  expires: 7,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});

        if (data.token) {
          localStorage.setItem(
            'token',
            data.token
          );
        }

        dispatch(loginSuccess(data));

        handleRedirect(data);
      } catch (err) {
        dispatch(
          loginFail(
            err.response?.data?.message ||
              'Login failed'
          )
        );
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-5">

      <div className="relative w-full max-w-md">

        {/* CARD */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="text-gray-400 mt-2">
              Login to access your artisan dashboard
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-300">
                Email
              </label>

              <div className="relative mt-2">
                <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 p-3 rounded-xl bg-gray-800 text-white outline-none border transition ${
                    formik.touched.email &&
                    formik.errors.email
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-orange-500'
                  }`}
                />
              </div>

              {formik.touched.email &&
                formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.email}
                  </p>
                )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-300">
                Password
              </label>

              <div className="relative mt-2">
                <FaLock className="absolute top-3.5 left-3 text-gray-400" />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-10 p-3 rounded-xl bg-gray-800 text-white outline-none border transition ${
                    formik.touched.password &&
                    formik.errors.password
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-orange-500'
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {/* 🔥 FORGOT PASSWORD LINK */}
              <div className="flex justify-end mt-2">
                <Link
                  href="/forgot-password"
                  className="text-xs text-orange-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {formik.touched.password &&
                formik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.password}
                  </p>
                )}
            </div>

            {/* BACKEND ERROR */}
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-3 rounded-xl shadow-lg disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don’t have an account?{' '}
            <Link
              href="/register"
              className="text-orange-500 hover:underline"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;