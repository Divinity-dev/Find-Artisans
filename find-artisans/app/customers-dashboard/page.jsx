'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaClipboardList,
} from 'react-icons/fa'

import API from '../axios'

const CustomerDashboard = () => {
  // =========================
  // STATES
  // =========================
  const [activeTab, setActiveTab] = useState('jobs')
  const [loading, setLoading] = useState(false)
  const [searchingWorkers, setSearchingWorkers] = useState(false)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [workers, setWorkers] = useState([])
  const [myComplaints, setMyComplaints] = useState([])

  const [searchFilters, setSearchFilters] = useState({
    skill: '',
    state: '',
    city: '',
    lga: '',
  })

  const [complaint, setComplaint] = useState({
    category: '',
    message: '',
  })

  // =========================
  // REVIEW STATE
  // =========================
  const [reviewModal, setReviewModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [review, setReview] = useState({ rating: 0, comment: '' })

  // =========================
  // SAFE GET
  // =========================
  const safeGet = async (url, setter, fallback = []) => {
    try {
      const res = await API.get(url)

      const data =
        res?.data?.data ||
        res?.data?.jobs ||
        res?.data?.workers ||
        res?.data?.complaints ||
        res?.data ||
        fallback

      setter(Array.isArray(data) ? data : fallback)
    } catch (err) {
      console.log(err)
      setter(fallback)
    }
  }

  // =========================
  // FETCH
  // =========================
  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/me')
      setProfile(res?.data?.data || res?.data?.user || res?.data)
    } catch {
      setError('Failed to load profile')
    }
  }

  const fetchJobs = () => safeGet('/jobs/me', setJobs, [])
  const fetchMyComplaints = () => safeGet('/complaints/my', setMyComplaints, [])

  // =========================
  // SEARCH WORKERS
  // =========================
  const searchWorkers = async () => {
    try {
      setSearchingWorkers(true)

      const res = await API.get('/users/workers/search', {
        params: searchFilters,
      })

      const data =
        res?.data?.data ||
        res?.data?.workers ||
        res?.data ||
        []

      setWorkers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.log(err)
      setWorkers([])
    } finally {
      setSearchingWorkers(false)
    }
  }

  // =========================
  // COMPLAINT
  // =========================
  const submitComplaint = async () => {
    try {
      if (!complaint.category || !complaint.message) {
        alert('Please fill all fields')
        return
      }

      await API.post('/complaints', complaint)
      alert('Complaint submitted successfully')

      setComplaint({ category: '', message: '' })
      fetchMyComplaints()
    } catch (err) {
      console.log(err)
      alert('Failed to submit complaint')
    }
  }

  // =========================
  // REVIEW LOGIC
  // =========================
  const openReview = (job) => {
    setSelectedJob(job)
    setReview({ rating: 0, comment: '' })
    setReviewModal(true)
  }

  const submitReview = async () => {
    try {
      if (!selectedJob) return

      if (!review.rating || !review.comment) {
        alert('Please add rating and comment')
        return
      }

      await API.post('/reviews', {
        jobId: selectedJob._id,
        workerId: selectedJob.worker,
        rating: review.rating,
        comment: review.comment,
      })

      alert('Review submitted successfully')

      setReviewModal(false)
      setSelectedJob(null)
      setReview({ rating: 0, comment: '' })
    } catch (err) {
      console.log(err)
      alert('Failed to submit review')
    }
  }

  // =========================
  // LOAD DASHBOARD
  // =========================
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')

      await Promise.all([
        fetchProfile(),
        fetchJobs(),
        fetchMyComplaints(),
      ])

      setLoading(false)
    }

    load()
  }, [])

  // =========================
  // STATUS STYLE
  // =========================
  const renderStatus = (job) => {
    const map = {
      completed: 'bg-green-600/20 text-green-400',
      'in-progress': 'bg-blue-600/20 text-blue-400',
      assigned: 'bg-purple-600/20 text-purple-400',
    }

    return map[job.status] || 'bg-yellow-600/20 text-yellow-400'
  }

  const renderComplaintStatus = (status) => {
    const map = {
      resolved: 'bg-green-600/20 text-green-400',
      rejected: 'bg-red-600/20 text-red-400',
    }

    return map[status] || 'bg-yellow-600/20 text-yellow-400'
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-950 text-white p-5 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-gray-400">
            Welcome {profile?.fullName || 'Customer'}
          </p>
        </div>

       <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
  
  <Link
    href="/customer-edit"
    className="group flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 px-5 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-gray-200"
  >
    <span className="w-2 h-2 rounded-full bg-gray-500 group-hover:bg-gray-300 transition"></span>
    Edit Profile
  </Link>

  <Link
    href="/post-job"
    className="relative overflow-hidden flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 text-sm text-white shadow-lg shadow-orange-500/20"
  >
    <span className="w-2 h-2 rounded-full bg-white/70"></span>
    Post Job

    {/* subtle glow effect */}
    <span className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-white/10"></span>
  </Link>

</div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {['jobs', 'find-workers', 'create-complaint', 'my-complaints'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl ${
              activeTab === tab ? 'bg-orange-500' : 'bg-gray-800'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* ========================= JOBS ========================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="bg-gray-900 p-6 rounded-3xl">
              <p className="text-gray-400">No jobs found yet.</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="bg-gray-900 p-6 rounded-3xl border border-gray-800">

                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold text-lg">{job.title}</h2>
                    <p className="text-gray-400 flex items-center gap-2">
                      <FaMapMarkerAlt /> {job.location}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full ${renderStatus(job)}`}>
                    {job.status}
                  </span>
                </div>

                {job.status === 'completed' && job.worker && (
                  <button
                    onClick={() => openReview(job)}
                    className="mt-3 bg-orange-500 px-4 py-2 rounded-xl"
                  >
                    Leave Review
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================= FIND WORKERS (RESTORED) ========================= */}
      {activeTab === 'find-workers' && (
        <div>

          <div className="bg-gray-900 p-6 rounded-3xl mb-6">
            <h2 className="text-xl font-bold mb-4">Search Workers</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
           {Object.keys(searchFilters).map((key) => (
  <input
    key={key}
    placeholder={key}
    value={searchFilters[key]}
    onChange={(e) =>
      setSearchFilters({
        ...searchFilters,
        [key]: e.target.value,
      })
    }
    className="w-full bg-gray-800 border border-gray-700 px-3 py-4 rounded-xl text-sm outline-none focus:border-orange-500"
  />
))}
            </div>

            <button
              onClick={searchWorkers}
              className="mt-4 bg-orange-500 px-4 py-2 rounded-xl"
            >
              {searchingWorkers ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {workers.map(worker => (
              <div key={worker._id} className="bg-gray-900 p-5 rounded-3xl">
                <h3 className="font-bold flex items-center gap-2">
                  {worker.fullName}
                  {worker?.verification?.isVerified && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                </h3>

                <p className="text-orange-400">{worker.skill}</p>
                <p className="text-gray-400">{worker.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================= REVIEW MODAL ========================= */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">Leave Review</h2>

            <div className="flex gap-2 mb-4">
              {[1,2,3,4,5].map(star => (
                <FaStar
                  key={star}
                  onClick={() => setReview({ ...review, rating: star })}
                  className={`cursor-pointer ${
                    review.rating >= star ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>

            <textarea
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
              className="w-full p-3 bg-gray-800 rounded-xl"
              rows={4}
            />

            <div className="flex gap-3 mt-4">
              <button onClick={submitReview} className="bg-orange-500 flex-1 py-2 rounded-xl">
                Submit
              </button>

              <button onClick={() => setReviewModal(false)} className="bg-gray-700 flex-1 py-2 rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default CustomerDashboard