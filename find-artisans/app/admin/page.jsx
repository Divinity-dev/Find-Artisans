'use client'

import React, { useEffect, useState } from 'react'
import API from '../axios'

import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaWallet,
  FaCheck,
  FaTimes,
} from 'react-icons/fa'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [stats, setStats] = useState({})

  const [verifications, setVerifications] = useState([])
  const [workers, setWorkers] = useState([])
  const [customers, setCustomers] = useState([])
  const [complaints, setComplaints] = useState([])
  const [jobs, setJobs] = useState([])

  const [page, setPage] = useState({
    verifications: 1,
    workers: 1,
    customers: 1,
    complaints: 1,
  })

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true)

      const [
        statsRes,
        verRes,
        workersRes,
        customersRes,
        complaintsRes,
        jobsRes,
      ] = await Promise.all([
        API.get('/admin/stats'),
        API.get(`/admin/verifications?page=${page.verifications}`),
        API.get(`/admin/workers?page=${page.workers}`),
        API.get(`/admin/customers?page=${page.customers}`),
        API.get(`/admin/complaints?page=${page.complaints}`),
        API.get('/admin/jobs'),
      ])

      setStats(statsRes.data.stats || statsRes.data.data)
      setVerifications(verRes.data.data || [])
      setWorkers(workersRes.data.data || [])
      setCustomers(customersRes.data.data || [])
      setComplaints(complaintsRes.data.data || [])
      setJobs(jobsRes.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  // =========================
  // VERIFY / REJECT WORKER
  // =========================
  const verifyWorker = async (id, action) => {
    try {
      await API.put(`/admin/verifications/${id}/verify`, {
        isVerified: action === 'approve',
      })

      setVerifications((prev) => prev.filter((w) => w._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed')
    }
  }

  // =========================
  // UPDATE COMPLAINT STATUS
  // =========================
  const updateComplaintStatus = async (id, status) => {
    try {
      await API.patch(`/admin/complaints/${id}/status`, { status })

      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update complaint')
    }
  }

  // =========================
  // UI STATES
  // =========================
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    )

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-red-500">
        {error}
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6 md:p-10">

      <h1 className="text-3xl font-bold text-white mb-6">
        Admin Dashboard
      </h1>

      {/* TABS */}
      <div className="flex gap-3 flex-wrap mb-8">
        {['stats','verifications','workers','customers','complaints','jobs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab ? 'bg-orange-500' : 'bg-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ========================= STATS ========================= */}
      {activeTab === 'stats' && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-gray-900 p-5 rounded-xl">
            <FaUserTie />
            <p>Workers</p>
            <h2>{stats.workers || 0}</h2>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl">
            <FaUsers />
            <p>Customers</p>
            <h2>{stats.customers || 0}</h2>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl">
            <FaClipboardList />
            <p>Jobs</p>
            <h2>{stats.totalJobs || 0}</h2>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl">
            <FaWallet />
            <p>Revenue</p>
            <h2>₦{(stats.revenue || 0).toLocaleString()}</h2>
          </div>
        </div>
      )}

      {/* ========================= VERIFICATIONS ========================= */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          {verifications.map(v => (
            <div key={v._id} className="bg-gray-900 p-5 rounded-xl">
              
              <p className="text-lg font-bold">{v.fullName}</p>
              <p className="text-gray-400">{v.skill}</p>

              <p className="mt-2 text-sm text-gray-300">
                NIN: {v.verification?.nin || 'Not provided'}
              </p>

              <div className="mt-2 flex gap-3">
                {v.verification?.governmentId && (
                  <a
                    href={v.verification.governmentId}
                    target="_blank"
                    className="text-blue-400 underline"
                  >
                    View ID Document
                  </a>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => verifyWorker(v._id, 'approve')}
                  className="bg-green-500 px-3 py-1 rounded"
                >
                  <FaCheck />
                </button>

                <button
                  onClick={() => verifyWorker(v._id, 'reject')}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================= WORKERS ========================= */}
      {activeTab === 'workers' && (
        <div className="grid md:grid-cols-2 gap-4">
          {workers.map(w => (
            <div key={w._id} className="bg-gray-900 p-5 rounded-xl">

              <div className="flex items-center gap-3">
                <img
                  src={w.profilePhoto}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold">{w.fullName}</p>
                  <p className="text-gray-400">{w.email}</p>
                </div>
              </div>

              <p className="mt-2">Skill: {w.skill}</p>
              <p>Experience: {w.yearsOfExperience} yrs</p>

              <p className="text-sm text-gray-400 mt-2">
                {w.location?.city}, {w.location?.state}
              </p>

              <p className="text-sm mt-2">
                Skills: {(w.skills || []).join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ========================= CUSTOMERS ========================= */}
      {activeTab === 'customers' && (
        <div className="grid md:grid-cols-2 gap-4">
          {customers.map(c => (
            <div key={c._id} className="bg-gray-900 p-5 rounded-xl">

              <p className="font-bold">{c.fullName}</p>
              <p className="text-gray-400">{c.email}</p>
              <p className="text-gray-400">{c.phone}</p>

              <p className="text-sm mt-2">
                {c.location?.city}, {c.location?.state}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ========================= COMPLAINTS ========================= */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.map(c => (
            <div key={c._id} className="bg-gray-900 p-5 rounded-xl">

              <p className="font-bold">{c.title}</p>
              <p className="text-gray-400">{c.description}</p>

              <p className="text-sm mt-2">
                Customer: {c.customer?.fullName}
              </p>

              <p className="text-sm">
                Worker: {c.worker?.fullName}
              </p>

              {/* STATUS CONTROL */}
              <div className="mt-3">
                <select
                  value={c.status}
                  onChange={(e) =>
                    updateComplaintStatus(c._id, e.target.value)
                  }
                  className="bg-gray-800 p-2 rounded"
                >
                  <option>pending</option>
                  <option>reviewed</option>
                  <option>resolved</option>
                  <option>rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================= JOBS ========================= */}
      {activeTab === 'jobs' && (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map(j => (
            <div key={j._id} className="bg-gray-900 p-5 rounded-xl">

              <p className="font-bold">{j.title}</p>
              <p className="text-gray-400">{j.description}</p>

              <p className="mt-2">Status: {j.status}</p>

              <p className="text-sm">
                Customer: {j.customer?.fullName}
              </p>

              <p className="text-sm">
                Worker: {j.assignedWorker?.fullName || 'Not assigned'}
              </p>

              <p className="text-sm mt-2">
                Budget: ₦{j.budget}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default AdminDashboard