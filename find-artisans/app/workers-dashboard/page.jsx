'use client'

import React, { useState } from 'react'
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaStar,
  FaComments,
  FaUserShield,
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
    <div className="min-h-screen bg-gray-950 text-white p-5 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Worker Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage jobs, clients, portfolio and earnings
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">

          <Link
            href="/worker-edit"
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-3 rounded-xl"
          >
            Edit Profile
          </Link>

          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition ${
              isAvailable
                ? 'bg-green-600 border-green-500'
                : 'bg-gray-800 border-gray-700'
            }`}
          >
            {isAvailable ? <FaToggleOn /> : <FaToggleOff />}
            {isAvailable ? 'Available' : 'Offline'}
          </button>
        </div>
      </div>

      {/* PROFILE */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8 grid md:grid-cols-5 gap-6">

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {worker.name}
            {worker.verified && (
              <FaCheckCircle className="text-green-500" />
            )}
          </h2>

          <p className="text-orange-400 font-medium mt-1">
            {worker.skill}
          </p>

          <p className="text-gray-400 flex items-center gap-2 mt-3">
            <FaMapMarkerAlt />
            {worker.location}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Rating</p>
          <h3 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
            <FaStar /> {worker.rating}
          </h3>
        </div>

        <div>
          <p className="text-gray-400">Jobs</p>
          <h3 className="text-2xl font-bold">{worker.jobsCompleted}</h3>
        </div>

        <div>
          <p className="text-gray-400">Response Time</p>
          <h3 className="text-2xl font-bold text-green-400">
            {worker.responseTime}
          </h3>
          <p className="text-sm text-gray-500">
            {worker.responseRate}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">

        {[
          { label: 'Today', value: earnings.today, icon: <FaWallet className="text-green-400" /> },
          { label: 'Week', value: earnings.week, icon: <FaChartLine className="text-orange-400" /> },
          { label: 'Month', value: earnings.month, icon: <FaBriefcase className="text-blue-400" /> },
        ].map((item, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <div className="flex justify-between mb-4 text-gray-400">
              <p>{item.label}</p>
              {item.icon}
            </div>
            <h2 className="text-3xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-3 flex-wrap mb-8">

        {[
          'available',
          'active',
          'completed',
          'messages',
          'reviews',
          'portfolio',
          'verification',
          'complaints',
        ].map((tab) => (
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

      {/* AVAILABLE JOBS */}
      {activeTab === 'available' && (
        <div className="grid md:grid-cols-2 gap-6">

          {availableJobs.map((job) => (
            <div key={job.id} className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

              <h2 className="text-xl font-bold mb-3">{job.title}</h2>

              <div className="text-gray-400 space-y-2 mb-5">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt /> {job.location}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock /> {job.time}
                </p>
                <p>{job.distance}</p>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-orange-500 py-3 rounded-xl">
                  Details
                </button>
                <button className="flex-1 bg-green-600 py-3 rounded-xl flex items-center justify-center gap-2">
                  <FaComments /> Contact
                </button>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* ACTIVE / OTHER SECTIONS */}
      {/* (same structure converted similarly — can expand next if you want) */}

    </div>
  )
}

export default WorkerDashboard