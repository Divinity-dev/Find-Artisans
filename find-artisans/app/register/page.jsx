'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  registerStart,
  registerSuccess,
  registerFail,
} from '@/redux/slices/authSlice';

import API from '../axios';

const SignupPage = () => {
  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [registrationComplete, setRegistrationComplete] =
    useState(false);

  // ======================================
  // VALIDATION
  // ======================================

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, 'Full name is too short')
      .required('Full name is required'),

    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),

    phone: Yup.string()
      .matches(
        /^[0-9]{11}$/,
        'Phone number must be 11 digits'
      )
      .required('Phone number is required'),

    role: Yup.string()
      .oneOf(
        ['customer', 'worker'],
        'Invalid role'
      )
      .required('Role is required'),

    password: Yup.string()
      .min(
        6,
        'Password must be at least 6 characters'
      )
      .required('Password is required'),

    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('password')],
        'Passwords do not match'
      )
      .required(
        'Confirm password is required'
      ),
  });

  // ======================================
  // FORMIK
  // ======================================

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'customer',
      password: '',
      confirmPassword: '',
    },

    validationSchema,

    onSubmit: async (
      values,
      { resetForm }
    ) => {
      try {
        dispatch(registerStart());

        // Remove confirmPassword before
        // sending data to the backend
        const {
          confirmPassword,
          ...payload
        } = values;

        // ======================================
        // REGISTER USER
        // ======================================

        const { data } = await API.post(
          '/auth/register',
          payload
        );

        // ======================================
        // REGISTRATION SUCCESS
        // ======================================

        dispatch(registerSuccess(data));

        // Clear form
        resetForm();

        // Show success toast
        toast.success(
          'Account created! Please check your email to verify your account.'
        );

        // Show verification screen
        setRegistrationComplete(true);

      } catch (error) {
        const message =
          error.response?.data?.message ||
          'Registration failed';

        toast.error(message);

        dispatch(
          registerFail(message)
        );
      }
    },
  });

  // ======================================
  // SUCCESS / EMAIL VERIFICATION SCREEN
  // ======================================

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-5">

        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

          <div className="text-5xl mb-5">
            🎉
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Account Created!
          </h1>

          <p className="text-gray-400 leading-7 mb-4">
            Your FindArtisans account has been
            created successfully.
          </p>

          <p className="text-gray-400 leading-7 mb-6">
            We have sent a verification link to
            your email address.
          </p>

          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <p className="text-gray-300 text-sm leading-6">
              Please check your inbox and click
              the verification link before
              logging in.
            </p>
          </div>

          <Link
            href="/login"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold p-3 rounded-xl transition"
          >
            Go to Login
          </Link>

          <p className="text-gray-500 text-sm mt-5">
            Didn't receive the email?
            Check your spam or junk folder.
          </p>

        </div>

      </div>
    );
  }

  // ======================================
  // SIGNUP FORM
  // ======================================

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8">

        {/* TITLE */}

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center text-sm mb-6">
          Join FindArtisans today
        </p>

        {/* REDUX ERROR */}

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* FORM */}

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4"
        >

          {/* FULL NAME */}

          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 bg-gray-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />

            {formik.touched.fullName &&
              formik.errors.fullName && (
                <p className="text-red-400 text-xs mt-1">
                  {formik.errors.fullName}
                </p>
              )}
          </div>

          {/* EMAIL */}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 bg-gray-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />

            {formik.touched.email &&
              formik.errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
          </div>

          {/* PHONE */}

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 bg-gray-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />

            {formik.touched.phone &&
              formik.errors.phone && (
                <p className="text-red-400 text-xs mt-1">
                  {formik.errors.phone}
                </p>
              )}
          </div>

          {/* ROLE */}

          <div>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 bg-gray-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="customer">
                Customer
              </option>

              <option value="worker">
                Worker
              </option>
            </select>

            {formik.touched.role &&
              formik.errors.role && (
                <p className="text-red-400 text-xs mt-1">
                  {formik.errors.role}
                </p>
              )}
          </div>

          {/* PASSWORD */}

          <div>
            <div className="relative">

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 bg-gray-800 text-white rounded-xl pr-12 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

            {formik.touched.password &&
              formik.errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={
                  formik.values.confirmPassword
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 bg-gray-800 text-white rounded-xl pr-12 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {
                    formik.errors
                      .confirmPassword
                  }
                </p>
              )}
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold p-3 rounded-xl transition"
          >
            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

        </form>

        {/* LOGIN LINK */}

        <p className="text-center text-gray-400 mt-5">
          Already have an account?{' '}

          <Link
            href="/login"
            className="text-orange-500 hover:text-orange-400 font-medium"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default SignupPage