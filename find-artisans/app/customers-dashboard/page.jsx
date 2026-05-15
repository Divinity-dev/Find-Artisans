
'use client'

import React, { useState } from 'react'
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaComments,
  FaClipboardList,
  FaTools,
} from 'react-icons/fa'
import Link from 'next/link'

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests')
    const [complaint, setComplaint] = useState({
    category: '',
    message: '',
  })

  const requests = [
    {
      id: 1,
      title: 'Need electrician for unstable wiring',
      status: 'Pending',
      location: 'Lekki, Lagos',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'Kitchen plumbing repair',
      status: 'Completed',
      location: 'Ikeja, Lagos',
      time: '1 day ago',
    },
  ]

  const workers = [
    {
      id: 1,
      name: 'John Electric',
      skill: 'Electrician',
      rating: 4.9,
      jobs: 42,
      location: 'Ikeja, Lagos',
      verified: true,
    },
    {
      id: 2,
      name: 'Swift Plumbing',
      skill: 'Plumber',
      rating: 4.7,
      jobs: 31,
      location: 'Lekki, Lagos',
      verified: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-gray-500">
            Find trusted artisans near you
          </p>
        </div>

        <div className='flex flex-col md:flex-row gap-4'>
           <Link href="/customer-edit" className="bg-orange-500 text-white px-5 py-3 rounded-xl font-medium">
         Edit Profile
        </Link >

        <button className="bg-orange-500 text-white px-5 py-3 rounded-xl font-medium">
          Post New Request
        </button>
        </div>
      </div>

      {/* SEARCH SECTION */}
      <div className="bg-white p-5 rounded-2xl shadow mb-8">
        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="What service do you need?"
            className="border p-4 rounded-xl md:col-span-2"
          />

          <input
            type="text"
            placeholder="Location"
            className="border p-4 rounded-xl"
          />

          <button className="bg-orange-500 text-white rounded-xl flex items-center justify-center gap-2">
            <FaSearch />
            Search
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-2 rounded-xl ${
            activeTab === 'requests'
              ? 'bg-orange-500 text-white'
              : 'bg-white shadow'
          }`}
        >
          My Requests
        </button>

        <button
          onClick={() => setActiveTab('workers')}
          className={`px-5 py-2 rounded-xl ${
            activeTab === 'workers'
              ? 'bg-orange-500 text-white'
              : 'bg-white shadow'
          }`}
        >
          Suggested Workers
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-5 py-2 rounded-xl ${
            activeTab === 'messages'
              ? 'bg-orange-500 text-white'
              : 'bg-white shadow'
          }`}
        >
          Messages
        </button>

         <button
          onClick={() => setActiveTab('complaints')}
          className={`px-5 py-2 rounded-xl ${
            activeTab === 'complaints'
              ? 'bg-orange-500 text-white'
              : 'bg-white shadow'
          }`}
        >
          Report Complaint
        </button>
      </div>

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="space-y-5">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-5 rounded-2xl shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold mb-2">
                    {request.title}
                  </h2>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <FaMapMarkerAlt />
                    {request.location}
                  </div>

                  <p className="text-sm text-gray-400">
                    Posted {request.time}
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    request.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : request.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {request.status}
                  </span>

                  <button className="bg-orange-500 text-white px-5 py-2 rounded-lg">
                    View Details
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* WORKERS TAB */}
      {activeTab === 'workers' && (
        <div className="grid md:grid-cols-2 gap-6">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">

                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {worker.name}

                    {worker.verified && (
                      <FaCheckCircle className="text-blue-500" />
                    )}
                  </h2>

                  <p className="text-orange-500 font-medium">
                    {worker.skill}
                  </p>
                </div>

                <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <FaStar />
                  {worker.rating}
                </div>

              </div>

              <div className="space-y-2 text-gray-600 mb-5">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {worker.location}
                </p>

                <p className="flex items-center gap-2">
                  <FaClipboardList />
                  {worker.jobs} Jobs Completed
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="bg-orange-500 text-white py-3 rounded-xl font-medium">
                  View Profile
                </button>

                <button className="bg-green-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                  <FaComments />
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Messages
          </h2>

          <div className="space-y-4">

            <div className="border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">John Electric</h3>
                <p className="text-gray-500 text-sm">
                  I can inspect the wiring tomorrow morning.
                </p>
              </div>

              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                Open Chat
              </button>
            </div>

          </div>
        </div>
      )}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl shadow p-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Report Complaint
          </h2>
          <p className="text-gray-500 mb-4">
            Submit a complaint about a worker or service.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">
                Complaint Category
              </label>
              <select
                value={complaint.category}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    category: e.target.value,
                  })
                }
                className="w-full border p-4 rounded-2xl"
              >
                <option value="">
                  Select Category
                </option>
                <option value="Fraud">
                  Fraud / Scam
                </option>
                <option value="Harassment">
                  Harassment
                </option>
                <option value="Non Payment">
                  Non Payment
                </option>
                <option value="Fake Job">
                  Fake Job Request
                </option>
                <option value="Unsafe Environment">
                  Unsafe Environment
                </option>
                <option value="Abusive Behavior">
                  Abusive Behavior
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Complaint Details
              </label>
              <textarea
                rows={6}
                placeholder="Describe the issue..."
                value={complaint.message}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    message: e.target.value,
                  })
                }
                className="w-full border p-4 rounded-2xl resize-none"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  // Handle complaint submission logic here
                  setComplaint({
                    category: '',
                    message: '',
                  });
                  setActiveTab('complaints');
                }}
                className="bg-orange-500 text-white px-6 py-4 rounded-2xl font-medium"
              >
                Submit Complaint
              </button>
              <button
                onClick={() =>
                  setComplaint({
                    category: '',
                    message: '',
                  })
                }
                className="bg-gray-200 px-6 py-4 rounded-2xl font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default CustomerDashboard



