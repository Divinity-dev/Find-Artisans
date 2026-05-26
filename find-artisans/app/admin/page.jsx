'use client'

import React, { useEffect, useState } from 'react'
import API from '../axios'

import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaWallet,
  FaSearch,
  FaMapMarkerAlt,
} from 'react-icons/fa'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const [stats, setStats] = useState(null)
  const [verifications, setVerifications] = useState([])
  const [complaints, setComplaints] = useState([])
  const [jobs, setJobs] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)

      const [statsRes, verRes, compRes, jobsRes] =
        await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/verifications'),
          API.get('/admin/complaints'),
          API.get('/admin/jobs'),
        ])

      setStats(statsRes.data)

      setVerifications(
        Array.isArray(verRes.data)
          ? verRes.data
          : verRes.data?.verifications || []
      )

      setComplaints(
        Array.isArray(compRes.data)
          ? compRes.data
          : compRes.data?.complaints || []
      )

      setJobs(
        Array.isArray(jobsRes.data)
          ? jobsRes.data
          : jobsRes.data?.jobs || []
      )

      setError(null)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage workers, customers, complaints and jobs
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl flex items-center gap-3 w-full md:w-80">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full text-gray-200"
          />
        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5 mb-10">

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <FaUserTie className="text-orange-400 text-2xl" />
          <p className="text-gray-400 mt-3">Workers</p>
          <h2 className="text-3xl font-bold text-white">
            {stats?.workers || 0}
          </h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <FaUsers className="text-blue-400 text-2xl" />
          <p className="text-gray-400 mt-3">Customers</p>
          <h2 className="text-3xl font-bold text-white">
            {stats?.customers || 0}
          </h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <FaClipboardList className="text-green-400 text-2xl" />
          <p className="text-gray-400 mt-3">Jobs</p>
          <h2 className="text-3xl font-bold text-white">
            {stats?.jobs || 0}
          </h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <FaWallet className="text-purple-400 text-2xl" />
          <p className="text-gray-400 mt-3">Revenue</p>
          <h2 className="text-3xl font-bold text-white">
            {stats?.revenue || '₦0'}
          </h2>
        </div>

      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-8 flex-wrap">

        {['overview', 'verifications', 'complaints', 'jobs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl capitalize transition ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : 'bg-gray-900 border border-gray-800 text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* ===================== OVERVIEW ===================== */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* VERIFICATIONS */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-5">
              Pending Verifications
            </h2>

            {verifications.map(v => (
              <div key={v._id} className="border border-gray-800 rounded-xl p-4 mb-4">
                <h3 className="text-white font-semibold">{v.name}</h3>
                <p className="text-orange-400">{v.skill}</p>

                <p className="text-gray-400 flex items-center gap-2 mt-2">
                  <FaMapMarkerAlt />
                  {v.location}
                </p>

                <div className="flex gap-3 mt-4">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COMPLAINTS */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-5">
              Complaints
            </h2>

            {complaints.map(c => (
              <div key={c._id} className="border border-gray-800 rounded-xl p-4 mb-4">
                <h3 className="text-white font-semibold">
                  {c.category}
                </h3>

                <p className="text-gray-400 mt-2">
                  {c.message}
                </p>

                <span className="text-yellow-400 text-sm">
                  {c.status}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ===================== JOBS ===================== */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">

          {jobs.map(job => (
            <div key={job._id} className="bg-gray-900 border border-gray-800 p-5 rounded-xl">

              <h2 className="text-white font-bold text-lg">
                {job.title}
              </h2>

              <p className="text-gray-400">
  Worker: {typeof job.worker === 'object'
    ? job.worker?.fullName
    : job.worker}
</p>

<p className="text-gray-400">
  Customer: {typeof job.customer === 'object'
    ? job.customer?.fullName
    : job.customer}
</p>

              <span className="text-blue-400 text-sm">
                {job.status}
              </span>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default AdminDashboard