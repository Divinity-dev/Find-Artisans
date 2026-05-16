'use client'

import React, { useState } from 'react'
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaComments,
  FaClipboardList,
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
    <div className="min-h-screen bg-gray-950 text-white p-5 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Customer Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Find trusted artisans near you
          </p>
        </div>

        <div className="flex gap-4 flex-col md:flex-row">

          <Link
            href="/customer-edit"
            className="bg-gray-800 border border-gray-700 hover:bg-gray-700 px-5 py-3 rounded-xl"
          >
            Edit Profile
          </Link>

          <button className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-medium">
            Post New Request
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-3xl mb-8">

        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="What service do you need?"
            className="bg-gray-800 border border-gray-700 p-4 rounded-xl text-white outline-none md:col-span-2"
          />

          <input
            type="text"
            placeholder="Location"
            className="bg-gray-800 border border-gray-700 p-4 rounded-xl text-white outline-none"
          />

          <button className="bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center justify-center gap-2 font-medium">
            <FaSearch />
            Search
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-6">

        {['requests', 'workers', 'messages', 'complaints'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-xl capitalize border transition ${
              activeTab === tab
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-5">

          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-900 border border-gray-800 p-6 rounded-3xl"
            >

              <div className="flex flex-col md:flex-row justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold mb-2">
                    {request.title}
                  </h2>

                  <p className="text-gray-400 flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt />
                    {request.location}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Posted {request.time}
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">

                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    request.status === 'Completed'
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {request.status}
                  </span>

                  <button className="bg-orange-500 px-5 py-2 rounded-xl">
                    View Details
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* WORKERS */}
      {activeTab === 'workers' && (
        <div className="grid md:grid-cols-2 gap-6">

          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-gray-900 border border-gray-800 p-6 rounded-3xl"
            >

              <div className="flex justify-between mb-4">

                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {worker.name}
                    {worker.verified && (
                      <FaCheckCircle className="text-green-500" />
                    )}
                  </h2>

                  <p className="text-orange-400 font-medium">
                    {worker.skill}
                  </p>
                </div>

                <div className="text-yellow-400 font-bold flex items-center gap-1">
                  <FaStar />
                  {worker.rating}
                </div>

              </div>

              <div className="text-gray-400 space-y-2 mb-5 text-sm">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {worker.location}
                </p>

                <p className="flex items-center gap-2">
                  <FaClipboardList />
                  {worker.jobs} Jobs Completed
                </p>
              </div>

              <div className="flex gap-3">

                <button className="flex-1 bg-orange-500 py-3 rounded-xl">
                  View Profile
                </button>

                <button className="flex-1 bg-green-600 py-3 rounded-xl flex items-center justify-center gap-2">
                  <FaComments />
                  Contact
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">

          <h2 className="text-2xl font-bold mb-5">
            Messages
          </h2>

          <div className="border border-gray-800 rounded-2xl p-5 flex justify-between items-center">

            <div>
              <h3 className="font-semibold">John Electric</h3>
              <p className="text-gray-400 text-sm">
                I can inspect the wiring tomorrow morning.
              </p>
            </div>

            <button className="bg-orange-500 px-5 py-2 rounded-xl">
              Open Chat
            </button>
          </div>

        </div>
      )}

      {/* COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl max-w-5xl">

          <h2 className="text-2xl font-bold mb-2">
            Report Complaint
          </h2>

          <p className="text-gray-400 mb-6">
            Submit a complaint about a worker or service.
          </p>

          <select
            value={complaint.category}
            onChange={(e) =>
              setComplaint({ ...complaint, category: e.target.value })
            }
            className="w-full bg-gray-800 border border-gray-700 p-4 rounded-xl mb-4"
          >
            <option value="">Select Category</option>
            <option>Fraud</option>
            <option>Harassment</option>
            <option>Non Payment</option>
            <option>Fake Job</option>
            <option>Unsafe Environment</option>
            <option>Abusive Behavior</option>
            <option>Other</option>
          </select>

          <textarea
            rows={6}
            placeholder="Describe the issue..."
            value={complaint.message}
            onChange={(e) =>
              setComplaint({ ...complaint, message: e.target.value })
            }
            className="w-full bg-gray-800 border border-gray-700 p-4 rounded-xl mb-4"
          />

          <div className="flex gap-4">

            <button className="bg-orange-500 px-6 py-3 rounded-xl">
              Submit
            </button>

            <button
              onClick={() =>
                setComplaint({ category: '', message: '' })
              }
              className="bg-gray-800 border border-gray-700 px-6 py-3 rounded-xl"
            >
              Clear
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

export default CustomerDashboard