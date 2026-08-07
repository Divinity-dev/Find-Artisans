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
import { toast } from 'react-toastify'

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
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    label: '',
  })
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
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  // =========================
  // UPDATE COMPLAINT STATUS
  // =========================
  const updateComplaintStatus = async (id, status) => {
    try {
      await API.patch(`/complaints/${id}`, { status })

      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      )
      toast.success('Complaint status updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update complaint')
    }
  }

  // =========================
  // DELETE RESOURCES
  // =========================
  const deleteResource = async (type, id) => {
    const endpointMap = {
      workers: `/admin/users/${id}`,
      customers: `/admin/users/${id}`,
      complaints: `/admin/complaints/${id}`,
      jobs: `/admin/jobs/${id}`,
    }

    const labelMap = {
      workers: 'Worker',
      customers: 'Customer',
      complaints: 'Complaint',
      jobs: 'Job',
    }

    try {
      await API.delete(endpointMap[type])

      if (type === 'workers') {
        setWorkers((prev) => prev.filter((item) => item._id !== id))
      }

      if (type === 'customers') {
        setCustomers((prev) => prev.filter((item) => item._id !== id))
      }

      if (type === 'complaints') {
        setComplaints((prev) => prev.filter((item) => item._id !== id))
      }

      if (type === 'jobs') {
        setJobs((prev) => prev.filter((item) => item._id !== id))
      }

      toast.success(`${labelMap[type]} deleted`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete resource')
    } finally {
      setDeleteModal({ isOpen: false, type: null, id: null, label: '' })
    }
  }

  const openDeleteModal = (type, item) => {
    setDeleteModal({
      isOpen: true,
      type,
      id: item._id,
      label: item.fullName || item.title || item.email || 'this resource',
    })
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
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6 md:p-10 overflow-x-hidden">

      <h1 className="text-3xl font-bold text-white mb-6">
        Admin Dashboard
      </h1>

     
{/* TABS */}
<div className="w-full mb-8 grid grid-cols-2 gap-2 bg-gray-900 p-2 rounded-xl sm:flex sm:flex-wrap sm:items-center">
  {['stats','verifications','workers','customers','complaints','jobs'].map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`w-full px-4 py-2 rounded-lg capitalize text-center transition sm:flex-1 ${
        activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-800'
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
                  alt={`Profile photo for ${w.fullName}`}
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

              <div className="mt-4">
                <button
                  onClick={() => openDeleteModal('workers', w)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
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

              <div className="mt-4">
                <button
                  onClick={() => openDeleteModal('customers', c)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
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

              <div className="mt-4">
                <button
                  onClick={() => openDeleteModal('complaints', c)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Delete
                </button>
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

              <div className="mt-4">
                <button
                  onClick={() => openDeleteModal('jobs', j)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================= DELETE CONFIRM MODAL ========================= */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Confirm deletion
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Are you sure you want to delete <span className="text-white font-semibold">{deleteModal.label}</span>?
                </p>
              </div>
              <button
                onClick={() => setDeleteModal({ isOpen: false, type: null, id: null, label: '' })}
                className="text-gray-400 hover:text-white text-2xl leading-none"
                aria-label="Close delete modal"
              >
                ×
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, type: null, id: null, label: '' })}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteResource(deleteModal.type, deleteModal.id)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboard