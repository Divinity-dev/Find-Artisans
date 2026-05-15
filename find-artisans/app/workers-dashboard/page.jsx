'use client'

import React, { useState } from 'react'
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaStar,
  FaClipboardList,
  FaComments,
  FaUserShield,
  FaTools,
  FaBriefcase,
  FaClock,
  FaWallet,
  FaChartLine,
  FaCamera,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa'
import Link from 'next/link'

const WorkerDashboard = () => {
  const [activeTab, setActiveTab] = useState('available')
  const [isAvailable, setIsAvailable] = useState(true)
  const [complaint, setComplaint] = useState({
  category: '',
  message: '',
})

  const worker = {
    name: 'John Electric',
    skill: 'Electrician',
    location: 'Lagos, Nigeria',
    rating: 4.8,
    jobsCompleted: 42,
    responseTime: '5 mins',
    responseRate: '98%',
    verified: true,
  }

  const availableJobs = [
    {
      id: 1,
      title: 'Need electrician for unstable wiring',
      location: 'Lekki, Lagos',
      time: '2 hours ago',
      distance: '2km away',
      urgent: true,
      images: true,
    },
    {
      id: 2,
      title: 'Install ceiling fan',
      location: 'Yaba, Lagos',
      time: '5 hours ago',
      distance: '6km away',
      urgent: false,
      images: false,
    },
  ]

  const activeJobs = [
    {
      id: 1,
      title: 'Kitchen Plumbing Repair',
      customer: 'Sarah K.',
      status: 'In Progress',
      date: 'Tomorrow • 9AM',
      location: 'Ikeja, Lagos',
    },
    {
      id: 2,
      title: 'Generator Wiring',
      customer: 'Michael A.',
      status: 'Negotiating',
      date: 'Today • 4PM',
      location: 'Lekki, Lagos',
    },
  ]

  const completedJobs = [
    {
      id: 1,
      title: 'Apartment Wiring Repair',
      customer: 'Michael A.',
      rating: 5,
    },
    {
      id: 2,
      title: 'Generator Setup',
      customer: 'Sarah K.',
      rating: 4,
    },
  ]

  const portfolio = [
    {
      id: 1,
      title: 'Office Wiring Installation',
      image: '/content/images/download.jpeg',
      location: 'Lekki, Lagos',
    },
    {
      id: 2,
      title: 'Apartment Electrical Repair',
      image: '/content/images/download.jpeg',
      location: 'Yaba, Lagos',
    },
  ]

  const earnings = {
    today: '₦12,000',
    week: '₦65,000',
    month: '₦240,000',
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Worker Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage jobs, clients, portfolio and earnings
          </p>
        </div>

       <div className='flex flex-col md:flex-row gap-4'>
        <Link href="/worker-edit" className="bg-green-500 text-white px-5 py-3 rounded-xl font-medium">
          Edit Profile
        </Link>
         {/* AVAILABILITY TOGGLE */}
        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-white font-medium transition ${
            isAvailable ? 'bg-green-500' : 'bg-gray-500'
          }`}
        >
          {isAvailable ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
          {isAvailable ? 'Available for Work' : 'Offline'}
        </button>
       </div>

      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8 grid md:grid-cols-5 gap-6">

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {worker.name}

            {worker.verified && (
              <FaCheckCircle className="text-blue-500" />
            )}
          </h2>

          <p className="text-orange-500 font-medium text-lg mt-1">
            {worker.skill}
          </p>

          <p className="text-gray-500 flex items-center gap-2 mt-3">
            <FaMapMarkerAlt />
            {worker.location}
          </p>
        </div>

        <div>
          <p className="text-gray-500 mb-2">Rating</p>

          <h3 className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
            <FaStar />
            {worker.rating}
          </h3>
        </div>

        <div>
          <p className="text-gray-500 mb-2">Completed Jobs</p>

          <h3 className="text-2xl font-bold">
            {worker.jobsCompleted}
          </h3>
        </div>

        <div>
          <p className="text-gray-500 mb-2">Response Time</p>

          <h3 className="text-2xl font-bold text-green-600">
            {worker.responseTime}
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            {worker.responseRate} response rate
          </p>
        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500">Today</p>
            <FaWallet className="text-green-500" />
          </div>

          <h2 className="text-3xl font-bold">
            {earnings.today}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500">This Week</p>
            <FaChartLine className="text-orange-500" />
          </div>

          <h2 className="text-3xl font-bold">
            {earnings.week}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500">This Month</p>
            <FaBriefcase className="text-blue-500" />
          </div>

          <h2 className="text-3xl font-bold">
            {earnings.month}
          </h2>
        </div>

      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-8 overflow-x-auto">

        {[
          'available',
          'active',
          'completed',
          'messages',
          'reviews',
          'portfolio',
          'verification',
          'complaints'
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-2xl capitalize whitespace-nowrap transition ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : 'bg-white shadow'
            }`}
          >
            {tab} Jobs
          </button>
        ))}

      </div>

      {/* AVAILABLE JOBS */}
      {activeTab === 'available' && (
        <div className="grid md:grid-cols-2 gap-6">

          {availableJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl shadow p-6"
            >

              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold max-w-[70%]">
                  {job.title}
                </h2>

                {job.urgent && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    Urgent
                  </span>
                )}
              </div>

              <div className="space-y-3 text-gray-500 mb-6">

                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {job.location}
                </p>

                <p className="flex items-center gap-2">
                  <FaClock />
                  Posted {job.time}
                </p>

                <p>
                  {job.distance}
                </p>

                {job.images && (
                  <p className="text-green-600 font-medium">
                    Images Attached
                  </p>
                )}

              </div>

              <div className="grid grid-cols-3 gap-3">

                <button className="bg-orange-500 text-white py-3 rounded-xl font-medium">
                  Details
                </button>

                <button className="bg-green-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                  <FaComments />
                  Contact
                </button>

                <button className="bg-gray-200 py-3 rounded-xl font-medium">
                  Save
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* ACTIVE JOBS */}
      {activeTab === 'active' && (
        <div className="space-y-5">

          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl shadow p-6"
            >

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {job.title}
                  </h2>

                  <div className="space-y-2 text-gray-500">
                    <p>Customer: {job.customer}</p>
                    <p>{job.date}</p>
                    <p>{job.location}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-4">

                  <span className={`px-4 py-2 rounded-full font-medium ${
                    job.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {job.status}
                  </span>

                  <div className="flex gap-3">
                    <button className="bg-orange-500 text-white px-5 py-3 rounded-xl">
                      Open Chat
                    </button>

                    <button className="bg-green-500 text-white px-5 py-3 rounded-xl">
                      Mark Completed
                    </button>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* COMPLETED JOBS */}
      {activeTab === 'completed' && (
        <div className="space-y-5">

          {completedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl shadow p-6"
            >

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold mb-2">
                    {job.title}
                  </h2>

                  <p className="text-gray-500">
                    Customer: {job.customer}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
                  <FaStar />
                  {job.rating}.0
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Messages
          </h2>

          <div className="space-y-4">

            <div className="border rounded-2xl p-5 flex items-center justify-between">

              <div>
                <h3 className="font-semibold text-lg">
                  Michael A.
                </h3>

                <p className="text-gray-500 mt-1">
                  Can you come by 9am tomorrow?
                </p>
              </div>

              <button className="bg-orange-500 text-white px-5 py-3 rounded-xl">
                Open Chat
              </button>

            </div>

          </div>

        </div>
      )}

      {/* REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-5">

          <div className="bg-white rounded-3xl shadow p-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                Customer Reviews
              </h2>

              <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
                <FaStar />
                4.8
              </div>
            </div>

            <div className="border-t pt-5">

              <div className="flex items-center gap-2 text-yellow-500 mb-3">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <p className="text-gray-700 mb-2">
                Very professional and arrived on time.
              </p>

              <p className="text-sm text-gray-400">
                — Sarah K.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

            <div>
              <h2 className="text-2xl font-bold">
                Portfolio Projects
              </h2>

              <p className="text-gray-500 mt-1">
                Showcase your completed work
              </p>
            </div>

            <button className="bg-orange-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2">
              <FaCamera />
              Upload Project
            </button>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow"
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-60 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-500">
                    {item.location}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>
      )}

      {/* VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-3xl shadow p-6 max-w-2xl">

          <div className="flex items-center gap-3 mb-5">
            <FaUserShield className="text-green-500 text-2xl" />

            <div>
              <h2 className="text-2xl font-bold">
                Verification Center
              </h2>

              <p className="text-gray-500 mt-1">
                Verified workers get more visibility and trust
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="NIN Number"
              className="w-full border p-4 rounded-2xl"
            />

            <input
              type="file"
              className="w-full border p-4 rounded-2xl"
            />

            <input
              type="file"
              className="w-full border p-4 rounded-2xl"
            />

            <button className="bg-orange-500 text-white px-6 py-4 rounded-2xl font-medium">
              Submit Verification
            </button>

          </div>

        </div>
      )}
            {/* COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl shadow p-6 max-w-7xl mx-auto">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Report Customer
            </h2>

            <p className="text-gray-500 mt-2">
              Submit complaints or report issues experienced with a customer.
            </p>
          </div>

          <div className="space-y-5">

            {/* CATEGORY */}
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

            {/* MESSAGE */}
            <div>
              <label className="block mb-2 font-medium">
                Complaint Details
              </label>

              <textarea
                rows={6}
                placeholder="Describe the issue with the customer..."
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

            {/* ACTIONS */}
            <div className="flex gap-4">

              <button
                className="bg-red-500 text-white px-6 py-4 rounded-2xl font-medium"
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

export default WorkerDashboard

