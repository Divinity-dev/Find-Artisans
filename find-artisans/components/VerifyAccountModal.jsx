

import { X } from "lucide-react";

export default function VerifyAccountModal({
  isOpen,
  onClose,
  onVerify,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-5">
          <span className="text-4xl">✅</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-3">
          Verify Your Account
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center leading-7 mb-8">
          Get your account verified to increase trust with customers and
          improve your profile rating. Verified users are more likely to
          stand out and attract more opportunities on the platform.
        </p>

        {/* Button */}
        <button
          onClick={onVerify}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:opacity-90"
        >
          Verify Account
        </button>

        {/* Small note */}
        <p className="text-center text-sm text-gray-500 mt-4">
          You can verify now or close this message and do it later.
        </p>
      </div>
    </div>
  );
}