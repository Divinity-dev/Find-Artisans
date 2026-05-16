'use client'

import React, { useState } from 'react'
import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaComments,
  FaExclamationTriangle,
  FaChartLine,
  FaSearch,
  FaEye,
  FaTrash,
  FaBan,
  FaMapMarkerAlt,
  FaClock,
} from 'react-icons/fa'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = {
    workers: 245,
    customers: 890,
    jobs: 1230,
    revenue: '₦4.2M',
  }

  const pendingWorkers = [
    {
      id: 1,
      name: 'John Electric',
      skill: 'Electrician',
      location: 'Lekki, Lagos',
    },
    {
      id: 2,
      name: 'Sarah Plumbing',
      skill: 'Plumber',
      location: 'Ikeja, Lagos',
    },
  ]

  const complaints = [
    {
      id: 1,
      worker: 'John Electric',
      customer: 'Michael A.',
      category: 'Non Payment',
      message:
        'Customer refused to pay after the work was completed.',
      status: 'Pending',
    },
    {
      id: 2,
      worker: 'Sarah Plumbing',
      customer: 'David K.',
      category: 'Harassment',
      message:
        'Customer used abusive language during negotiation.',
      status: 'Investigating',
    },
  ]

  const jobs = [
    {
      id: 1,
      title: 'Generator Repair',
      worker: 'John Electric',
      customer: 'Michael A.',
      status: 'In Progress',
      location: 'Lekki, Lagos',
    },
    {
      id: 2,
      title: 'Pipe Installation',
      worker: 'Sarah Plumbing',
      customer: 'Blessing O.',
      status: 'Completed',
      location: 'Yaba, Lagos',
    },
  ]

  const users = [
    {
      id: 1,
      name: 'John Electric',
      role: 'Worker',
      status: 'Verified',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Michael A.',
      role: 'Customer',
      status: 'Active',
      rating: 4.5,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage workers, customers, complaints, jobs and platform activities
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl shadow flex items-center gap-3">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search users, jobs..."
            className="outline-none"
          />
        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500">Workers</p>

            <FaUserTie className="text-orange-500 text-2xl" />
          </div>

          <h2 className="text-3xl font-bold">
            {stats.workers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500">Customers</p>

            <FaUsers className="text-blue-500 text-2xl" />
          </div>

          <h2 className="text-3xl font-bold">
            {stats.customers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500">Total Jobs</p>

            <FaClipboardList className="text-green-500 text-2xl" />
          </div>

          <h2 className="text-3xl font-bold">
            {stats.jobs}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500">Revenue</p>

            <FaWallet className="text-purple-500 text-2xl" />
          </div>

          <h2 className="text-3xl font-bold">
            {stats.revenue}
          </h2>
        </div>

      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-8 overflow-x-auto">

        {[
          'overview',
          'verifications',
          'complaints',
          'jobs',
          'users',
          'analytics',
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
            {tab}
          </button>
        ))}

      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl shadow p-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                Pending Worker Verifications
              </h2>

              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>

            <div className="space-y-5">

              {pendingWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="border rounded-2xl p-5"
                >

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                    <div>
                      <h3 className="text-xl font-bold">
                        {worker.name}
                      </h3>

                      <p className="text-orange-500 mt-1">
                        {worker.skill}
                      </p>

                      <p className="text-gray-500 flex items-center gap-2 mt-2">
                        <FaMapMarkerAlt />
                        {worker.location}
                      </p>
                    </div>

                    <div className="flex gap-3">

                      <button className="bg-green-500 text-white px-5 py-3 rounded-xl">
                        Approve
                      </button>

                      <button className="bg-red-500 text-white px-5 py-3 rounded-xl">
                        Reject
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow p-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                Recent Complaints
              </h2>

              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>

            <div className="space-y-5">

              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border rounded-2xl p-5"
                >

                  <div className="flex items-start justify-between mb-3">

                    <div>
                      <h3 className="font-bold text-lg">
                        {complaint.category}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        Worker: {complaint.worker}
                      </p>

                      <p className="text-gray-500">
                        Customer: {complaint.customer}
                      </p>
                    </div>

                    <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm">
                      {complaint.status}
                    </span>

                  </div>

                  <p className="text-gray-700">
                    {complaint.message}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>
      )}

      {/* VERIFICATIONS */}
      {activeTab === 'verifications' && (
        <div className="space-y-5">

          {pendingWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-3xl shadow p-6"
            >

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                <div>
                  <h2 className="text-2xl font-bold">
                    {worker.name}
                  </h2>

                  <p className="text-orange-500 mt-2">
                    {worker.skill}
                  </p>

                  <p className="text-gray-500 mt-2">
                    {worker.location}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">

                  <button className="bg-blue-500 text-white px-5 py-3 rounded-xl flex items-center gap-2">
                    <FaEye />
                    View Documents
                  </button>

                  <button className="bg-green-500 text-white px-5 py-3 rounded-xl">
                    Approve
                  </button>

                  <button className="bg-red-500 text-white px-5 py-3 rounded-xl">
                    Reject
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="space-y-5">

          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-3xl shadow p-6"
            >

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">

                <div className="max-w-3xl">

                  <div className="flex items-center gap-3 mb-3">

                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      {complaint.category}
                    </span>

                    <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                      {complaint.status}
                    </span>

                  </div>

                  <h2 className="text-xl font-bold mb-2">
                    Complaint Against {complaint.customer}
                  </h2>

                  <p className="text-gray-500 mb-3">
                    Submitted by {complaint.worker}
                  </p>

                  <p className="text-gray-700">
                    {complaint.message}
                  </p>

                </div>

                <div className="flex flex-col gap-3">

                  <button className="bg-blue-500 text-white px-5 py-3 rounded-xl">
                    Investigate
                  </button>

                  <button className="bg-red-500 text-white px-5 py-3 rounded-xl flex items-center gap-2">
                    <FaBan />
                    Suspend Customer
                  </button>

                  <button className="bg-gray-200 px-5 py-3 rounded-xl">
                    Resolve
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* JOBS */}
      {activeTab === 'jobs' && (
        <div className="space-y-5">

          {jobs.map((job) => (
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
                    <p>Worker: {job.worker}</p>
                    <p>Customer: {job.customer}</p>

                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      {job.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-4">

                  <span className={`px-4 py-2 rounded-full font-medium ${
                    job.status === 'Completed'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {job.status}
                  </span>

                  <div className="flex gap-3">

                    <button className="bg-blue-500 text-white px-5 py-3 rounded-xl">
                      View
                    </button>

                    <button className="bg-red-500 text-white px-5 py-3 rounded-xl">
                      Cancel Job
                    </button>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* USERS */}
      {activeTab === 'users' && (
        <div className="space-y-5">

          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-3xl shadow p-6"
            >

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                <div>

                  <div className="flex items-center gap-3 mb-2">

                    <h2 className="text-2xl font-bold">
                      {user.name}
                    </h2>

                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {user.role}
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-gray-500">

                    <span>
                      {user.status}
                    </span>

                    <span className="flex items-center gap-1 text-yellow-500">
                      <FaStar />
                      {user.rating}
                    </span>

                  </div>

                </div>

                <div className="flex gap-3">

                  <button className="bg-blue-500 text-white px-5 py-3 rounded-xl">
                    View Profile
                  </button>

                  <button className="bg-yellow-500 text-white px-5 py-3 rounded-xl">
                    Warn
                  </button>

                  <button className="bg-red-500 text-white px-5 py-3 rounded-xl flex items-center gap-2">
                    <FaTrash />
                    Remove
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-3xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500">
                Daily Active Users
              </p>

              <FaChartLine className="text-green-500 text-2xl" />
            </div>

            <h2 className="text-4xl font-bold">
              1,240
            </h2>

            <p className="text-green-500 mt-3">
              +12% this week
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500">
                Jobs Completed
              </p>

              <FaClipboardList className="text-orange-500 text-2xl" />
            </div>

            <h2 className="text-4xl font-bold">
              840
            </h2>

            <p className="text-green-500 mt-3">
              +18% this month
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500">
                Complaint Resolution
              </p>

              <FaComments className="text-blue-500 text-2xl" />
            </div>

            <h2 className="text-4xl font-bold">
              92%
            </h2>

            <p className="text-green-500 mt-3">
              Excellent resolution rate
            </p>
          </div>

        </div>
      )}

    </div>
  )
}

export default AdminDashboard