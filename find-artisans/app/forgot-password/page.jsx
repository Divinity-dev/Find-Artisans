'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../axios';

const ForgotPassword = () => {
  const router = useRouter();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [timer, setTimer] = useState(600);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const emailRef = useRef('');

  // ================= CLOSE OTP MODAL (SAFE RESET) =================
  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp(['', '', '', '', '', '']);
    setServerError('');
    setTimer(600);
    setLoading(false);
  };

  // ================= TIMER =================
  useEffect(() => {
    if (!showOtpModal) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [showOtpModal]);

  // ================= EMAIL FORM =================
  const formik = useFormik({
    initialValues: { email: '' },

    validationSchema: Yup.object({
      email: Yup.string().email().required(),
    }),

    onSubmit: async (values) => {
      try {
        setServerError('');
        setLoading(true);

        const email = values.email.trim();
        emailRef.current = email;

        await API.post('/auth/forgot-password', { email });

        setOtp(['', '', '', '', '', '']);
        setTimer(600);
        setShowOtpModal(true);
      } catch (err) {
        setServerError(
          err?.response?.data?.message || 'Failed to send OTP'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // ================= OTP INPUT =================
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    if (loading) return;

    setServerError('');

    const email = emailRef.current;
    const finalOtp = otp.join('').trim();

    if (!email) {
      setServerError('Email missing. Please try again.');
      return;
    }

    if (finalOtp.length !== 6) {
      setServerError('Enter full 6-digit OTP');
      return;
    }

    try {
      setLoading(true);

      await API.post('/auth/verify-otp', {
        email,
        otp: finalOtp,
      });

      setShowOtpModal(false);
      setOtp(['', '', '', '', '', '']);

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Invalid or expired OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  const resendOtp = async () => {
    try {
      setServerError('');
      setTimer(600);

      await API.post('/auth/forgot-password', {
        email: emailRef.current,
      });

      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setServerError('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">

      {/* MAIN FORM */}
      <div className={`${showOtpModal ? 'blur-sm' : ''} w-full max-w-md`}>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">

          <h1 className="text-xl font-bold text-center mb-4">
            Forgot Password
          </h1>

          {serverError && (
            <p className="text-red-400 text-sm mb-3 text-center">
              {serverError}
            </p>
          )}

          <form onSubmit={formik.handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full p-3 bg-gray-800 rounded mb-4"
            />

            <button
              disabled={loading}
              className="w-full bg-orange-500 p-3 rounded"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>

      {/* ================= OTP MODAL ================= */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">

          <div className="bg-gray-900 w-full max-w-md p-6 rounded-xl relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={closeOtpModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-center mb-2">
              Enter OTP
            </h2>

            <p className="text-gray-400 text-sm text-center mb-4">
              Expires in {Math.floor(timer / 60)}:
              {String(timer % 60).padStart(2, '0')}
            </p>

            {/* OTP INPUTS */}
            <div className="flex justify-between gap-2 mb-4">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={v}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  maxLength={1}
                  className="w-12 h-12 text-center bg-gray-800 rounded text-lg"
                />
              ))}
            </div>

            {serverError && (
              <p className="text-red-400 text-sm mb-2 text-center">
                {serverError}
              </p>
            )}

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-500 p-3 rounded"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              onClick={resendOtp}
              className="text-orange-400 text-sm mt-3 w-full"
            >
              Resend OTP
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;