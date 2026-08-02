'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../axios';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const router = useRouter();
  const params = useSearchParams();
  const email = decodeURIComponent(
  params.get("email") || ""
);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // 👁 visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, 'Password too short')
        .required('Password is required'),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required'),
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);
        setServerError('');

        await API.patch('/auth/reset-password', {
          email,
          password: values.password,
        });
         toast.success('Password reset successful! Please log in.');
        router.push('/login');
      } catch (err) {
        setServerError(
          err.response?.data?.message || 'Failed to reset password'
        );
        toast.error(
          err.response?.data?.message || 'Failed to reset password'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 p-6 rounded-xl w-100">

        <h1 className="text-xl font-bold mb-4">
          Reset Password
        </h1>

        {/* PASSWORD */}
        <div className="relative mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="New password"
            className="w-full p-3 bg-gray-800 rounded pr-10"
            value={formik.values.password}
            onChange={formik.handleChange}
          />

          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {formik.touched.password && formik.errors.password && (
          <p className="text-red-400 text-xs mb-2">
            {formik.errors.password}
          </p>
        )}

        {/* CONFIRM PASSWORD */}
        <div className="relative mb-2">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm password"
            className="w-full p-3 bg-gray-800 rounded pr-10"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
          />

          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {formik.touched.confirmPassword &&
          formik.errors.confirmPassword && (
            <p className="text-red-400 text-xs mb-2">
              {formik.errors.confirmPassword}
            </p>
          )}

        {/* SUBMIT */}
        <button
          onClick={formik.handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 p-3 rounded"
        >
          {loading ? 'Updating...' : 'Reset Password'}
        </button>

        {serverError && (
          <p className="text-red-500 text-sm mt-3 text-center">
            {serverError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;