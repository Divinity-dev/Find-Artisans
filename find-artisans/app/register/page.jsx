'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
} from 'react-icons/fa';

import { useDispatch, useSelector } from 'react-redux';

import {
  registerStart,
  registerSuccess,
  registerFail,
} from '@/redux/slices/authSlice';

import API from '../axios';

const SignupPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // REDIRECT USER
  // =========================
  const handleRedirect = (user) => {
    if (user.role === 'admin') {
      router.push('/admin');
    } else if (user.role === 'customer') {
      router.push('/customers-dashboard');
    } else if (user.role === 'worker') {
      router.push('/workers-dashboard');
    } else {
      router.push('/');
    }
  };

  // =========================
  // VALIDATION
  // =========================
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, 'Full name is too short')
      .required('Full name is required'),

    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),

    phone: Yup.string()
      .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits')
      .required('Phone number is required'),

    role: Yup.string()
      .oneOf(['customer', 'worker'], 'Invalid role')
      .required('Role is required'),

    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // =========================
  // FORMIK
  // =========================
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'customer',
      password: '',
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(registerStart());

        const { data } = await API.post('/auth/register', values);

        console.log(data);

        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        dispatch(registerSuccess(data));

        resetForm();

        // IMPORTANT FIX: ensure backend returns user object
        handleRedirect(data.user);

      } catch (error) {
        dispatch(
          registerFail(
            error.response?.data?.message || 'Registration failed'
          )
        );
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-5">

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {/* FULL NAME */}
          <input
            name="fullName"
            placeholder="Full Name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded-xl"
          />

          {/* EMAIL */}
          <input
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded-xl"
          />

          {/* PHONE */}
          <input
            name="phone"
            placeholder="Phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded-xl"
          />

          {/* ROLE SELECT */}
          <select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded-xl"
          >
            <option value="customer">Customer</option>
            <option value="worker">Worker</option>
          </select>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="w-full p-3 bg-gray-800 text-white rounded-xl pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white p-3 rounded-xl"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Already have account? <Link href="/login" className="text-orange-500">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default SignupPage;