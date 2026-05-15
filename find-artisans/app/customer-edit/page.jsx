'use client'

import React, { useState } from 'react'
import {
  FaCamera,
  FaUserShield,
  FaIdCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUpload,
} from 'react-icons/fa'

const CustomerProfileEditPage = () => {
  const [ninStatus, setNinStatus] = useState('unverified') // unverified | pending | verified
  const [idUploaded, setIdUploaded] = useState(false)

  const customer = {
    name: 'Sarah Johnson',
    location: 'Lekki, Lagos',
    bio: 'Looking for reliable artisans for home and business services.',
    nin: '',
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Edit Customer Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Complete verification to build trust with workers
          </p>
        </div>

        <button className="bg-orange-500 text-white px-6 py-4 rounded-2xl font-medium">
          Save Changes
        </button>

      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-3xl shadow p-6 md:p-8 mb-8">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center">

            <div className="relative">

              <img
                src="/content/images/download.jpeg"
                alt="profile"
                className="w-40 h-40 rounded-3xl object-cover"
              />

              <button className="absolute bottom-3 right-3 bg-orange-500 text-white p-3 rounded-xl shadow-lg">
                <FaCamera />
              </button>

            </div>

            <button className="mt-4 text-orange-500 font-medium">
              Change Photo
            </button>

          </div>

          {/* BASIC INFO */}
          <div className="flex-1 grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <input
                type="text"
                defaultValue={customer.name}
                className="w-full border p-4 rounded-2xl"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input
                type="text"
                defaultValue={customer.location}
                className="w-full border p-4 rounded-2xl"
              />
            </div>

          </div>

        </div>

      </div>

      {/* ABOUT */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-5">About You</h2>
        <textarea
          rows={6}
          defaultValue={customer.bio}
          className="w-full border p-5 rounded-2xl resize-none"
        />
      </div>

      {/* VERIFICATION SECTION */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">

        <div className="flex items-center gap-3 mb-6">
          <FaUserShield className="text-green-500 text-2xl" />

          <div>
            <h2 className="text-2xl font-bold">
              Identity Verification
            </h2>
            <p className="text-gray-500">
              Verify your identity using NIN and Government ID
            </p>
          </div>
        </div>

        {/* NIN INPUT */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            NIN Number (Nigeria Identity Number)
          </label>

          <input
            type="text"
            placeholder="Enter your NIN"
            className="w-full border p-4 rounded-2xl"
          />

          <div className="mt-2 flex items-center gap-2 text-sm">
            {ninStatus === 'verified' ? (
              <span className="text-green-600 flex items-center gap-1">
                <FaCheckCircle /> Verified
              </span>
            ) : ninStatus === 'pending' ? (
              <span className="text-yellow-500 flex items-center gap-1">
                <FaExclamationTriangle /> Pending Verification
              </span>
            ) : (
              <span className="text-red-500 flex items-center gap-1">
                <FaExclamationTriangle /> Not Verified
              </span>
            )}
          </div>
        </div>

        {/* ID UPLOAD */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Upload Government ID
          </label>

          <div className="border rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              <FaIdCard className="text-orange-500" />
              <span>
                {idUploaded ? 'ID Uploaded' : 'No ID uploaded yet'}
              </span>
            </div>

            <button className="bg-orange-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2">
              <FaUpload />
              Upload ID
            </button>

          </div>
        </div>

        {/* SUBMIT VERIFICATION */}
        <button className="bg-green-500 text-white px-6 py-4 rounded-2xl font-medium">
          Submit for Verification
        </button>

      </div>

      {/* INFO BOX */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">

        <h3 className="font-bold mb-2">
          Why verify your identity?
        </h3>

        <p className="text-gray-600">
          Verified customers get faster responses from workers, higher trust scores,
          and priority matching for urgent jobs.
        </p>

      </div>

    </div>
  )
}

export default CustomerProfileEditPage