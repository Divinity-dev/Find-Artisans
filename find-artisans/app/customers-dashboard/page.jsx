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
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import VerifyAccountModal from "@/components/VerifyAccountModal";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [myComplaints, setMyComplaints] = useState([])

  const [complaint, setComplaint] = useState({
  title: '',
  description: '',
})

  const [reviewModal, setReviewModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [review, setReview] = useState({ rating: 0, comment: '' })

  // ========================= SAFE GET =========================
  const safeGet = async (url, setter, key = 'data') => {
    try {
      const res = await API.get(url)
      const data = res?.data?.[key]
      setter(Array.isArray(data) ? data : [])
    } catch (err) {
      console.log(err)
      setter([])
    }
  }

  // ========================= FETCH =========================
  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/me')
      setProfile(res?.data?.data || res?.data?.user || res?.data)
    } catch {
      setError('Failed to load profile')
    }
  }

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs/me')
      const data = res?.data?.data || []
      setJobs(Array.isArray(data) ? data : [])
    } catch (err) {
      console.log(err)
      setJobs([])
    }
  }

  const fetchMyComplaints = () =>
    safeGet('/complaints/my', setMyComplaints)

  // ========================= ACTIONS =========================
  const assignWorker = async (jobId, workerId) => {
    try {
      setLoading(true)
      await API.patch(`/jobs/${jobId}/assign`, { workerId })
      await fetchJobs()
      toast.success('Worker assigned successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to assign worker')
    } finally {
      setLoading(false)
    }
  }

  const updateJobStatus = async (jobId, status) => {
    try {
      await API.patch(`/jobs/${jobId}/status`, { status })
      await fetchJobs()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status')
    }
  }

  const searchWorkers = async () => {
    try {
      setSearchingWorkers(true)

      const res = await API.get('/users/workers/search', {
        params: searchFilters,
      })

      const data = res?.data?.data || []
      setWorkers(Array.isArray(data) ? data : [])
    } catch {
      setWorkers([])
    } finally {
      setSearchingWorkers(false)
    }
  }

 const submitComplaint = async () => {
  try {
    if (!complaint.title || !complaint.description) {
      return toast.error('Please fill all fields')
    }

    await API.post('/complaints', complaint)

    toast.success('Complaint submitted successfully')

    setComplaint({
      title: '',
      description: '',
    })

    fetchMyComplaints()
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
      'Failed to submit complaint'
    )
  }
}

useEffect(() => {
  fetchProfile()
  fetchJobs()
  fetchMyComplaints()
}, [])

const { user } = useSelector((state) => state.auth);
const router = useRouter();
useEffect(() => {
  if (
    profile &&
    !profile?.verified &&
    !profile?.verification?.isVerified
  ) {
    setShowVerifyModal(true)
  }
}, [profile])

  // ========================= STATUS STYLE =========================
  const statusStyle = (status) => {
    const map = {
      completed: 'bg-green-600/20 text-green-400',
      'in-progress': 'bg-blue-600/20 text-blue-400',
      assigned: 'bg-purple-600/20 text-purple-400',
      open: 'bg-yellow-600/20 text-yellow-400',
    }
    return map[status] || map.open
  }

  // ========================= REVIEWS =========================

const openReviewModal = (job) => {
  setSelectedJob(job)
  setReview({
    rating: 5,
    comment: '',
  })
  setReviewModal(true)
}

const submitReview = async () => {
  try {
    await API.post('/reviews', {
      jobId: selectedJob._id,
      rating: Number(review.rating),
      comment: review.comment,
    })

    setReviewModal(false)
    setSelectedJob(null)

    fetchJobs()

    toast.success('Review submitted successfully')
  } catch (err) {
    console.log(err.response?.data)

    toast.error(
      err?.response?.data?.message ||
      'Failed to submit review'
    )
  }
}

  // ========================= UI =========================
  return (
    <div className="min-h-screen bg-gray-950 text-white p-5 md:p-10">
<VerifyAccountModal
  isOpen={showVerifyModal}
  onClose={() => setShowVerifyModal(false)}
  onVerify={() =>
    router.push("/customer-edit?scrollTo=verification")
  }
/>
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-gray-400">
            Welcome {profile?.fullName || 'Customer'}
          </p>
          {profile?.stats?.trustScore !== undefined && (
  <div className="mt-2 flex items-center gap-2">
    <FaStar className="text-yellow-400" />
    <p className="text-sm text-gray-300">
      Trust Score:{" "}
      <span className="text-orange-400 font-bold">
        {profile.stats.trustScore}
      </span>
    </p>
  </div>
)}
        </div>

        <div className="flex gap-3">
          <Link
            href="/customer-edit"
            className="bg-gray-900 px-4 py-2 flex items-center rounded-xl"
          >
            Edit Profile
          </Link>

          <Link
            href="/post-job"
            className="bg-orange-500 flex items-center px-4 py-2 rounded-xl"
          >
            Post Job
          </Link>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {['jobs', 'create-complaint', 'my-complaints'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl ${
              activeTab === tab ? 'bg-orange-500' : 'bg-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= JOBS ================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-5">

          {jobs.length === 0 ? (
            <p className="text-gray-400">No jobs found</p>
          ) : (
            jobs.map(job => (
              <div
                key={job._id}
                className="bg-gray-900 p-6 rounded-3xl border border-gray-800"
              >

                {/* JOB INFO */}
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold text-lg">{job.title}</h2>

                    <p className="text-gray-400 text-sm mt-1">
                      {job.description}
                    </p>

                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                      <FaMapMarkerAlt />
                      {job.location?.city}, {job.location?.state}
                    </p>

                    {job.assignedWorker && (
                      <p className="text-green-400 text-sm mt-2">
                        Assigned: {job.assignedWorker.fullName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-xl ${statusStyle(job.status)}`}>
                      {job.status}
                    </span>

                    <select
                      value={job.status}
                      onChange={(e) =>
                        updateJobStatus(job._id, e.target.value)
                      }
                      className="bg-gray-800 p-2 rounded-lg"
                    >
                      <option value="open">Open</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* APPLICANTS */}
                <div className="mt-6">
                  <h3 className="text-gray-400 mb-3">
                    Applicants ({job.applicants?.length || 0})
                  </h3>

                  {job.applicants?.length === 0 ? (
                    <p className="text-gray-500">No applicants</p>
                  ) : (
                    job.applicants.map(app => {
                      const w = app.worker

                      return (
                        <div
                          key={app._id}
                          className="bg-gray-800 p-4 rounded-xl flex justify-between items-center mb-3"
                        >
                          <div>
                            <p className="font-semibold flex items-center gap-2">
                              {w.fullName}
                              {w.verification?.isVerified && (
                                <FaCheckCircle className="text-green-500" />
                              )}
                            </p>

                            <p className="text-sm text-gray-400">
                              {w.skill}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              href={`/workers/${w._id}`}
                              className="bg-gray-700 px-3 py-1 rounded-lg"
                            >
                              View
                            </Link>

                            <button
                              disabled={!!job.assignedWorker}
                              onClick={() =>
                                assignWorker(job._id, w._id)
                              }
                              className="bg-orange-500 px-3 py-1 rounded-lg disabled:opacity-50"
                            >
                              {job.assignedWorker
                                ? 'Assigned'
                                : 'Assign'}
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                          {/* REVIEW WORKER */}
{job.status === 'completed' &&
  job.assignedWorker &&
  !job.review && (
    <div className="mt-5 pt-5 border-t border-gray-800">
      <button
        onClick={() => openReviewModal(job)}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-xl"
      >
        ⭐ Give Review
      </button>
    </div>
)}
              </div>
            ))
          )}


        </div>
      )}

      {/* CREATE COMPLAINT */}
{activeTab === 'create-complaint' && (
  <div className="max-w-2xl">
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

      <div className="flex items-center gap-3 mb-5">
        <FaClipboardList className="text-orange-500 text-xl" />
        <h2 className="text-xl font-bold">
          Submit Complaint
        </h2>
      </div>

      <div className="space-y-4">

        <div>
          <label className="block mb-2 text-sm text-gray-400">
            Complaint Title
          </label>

          <input
            type="text"
            value={complaint.title}
            onChange={(e) =>
              setComplaint({
                ...complaint,
                title: e.target.value,
              })
            }
            placeholder="Brief title"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-400">
            Description
          </label>

          <textarea
            value={complaint.description}
            onChange={(e) =>
              setComplaint({
                ...complaint,
                description: e.target.value,
              })
            }
            placeholder="Describe your complaint..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 h-40 resize-none"
          />
        </div>

        <button
          onClick={submitComplaint}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold"
        >
          Submit Complaint
        </button>

      </div>
    </div>
  </div>
)}

{/* MY COMPLAINTS */}
{activeTab === 'my-complaints' && (
  <div className="space-y-4">

    {myComplaints.length === 0 ? (
      <p className="text-gray-400">
        No complaints submitted yet.
      </p>
    ) : (
      myComplaints.map((item) => (
        <div
          key={item._id}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
        >
          <div className="flex justify-between items-start">

            <div>
              <h3 className="font-bold text-lg">
                {item.title}
              </h3>

              <p className="text-gray-400 mt-2">
                {item.description}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-xl text-sm ${
                item.status === 'resolved'
                  ? 'bg-green-600/20 text-green-400'
                  : item.status === 'rejected'
                  ? 'bg-red-600/20 text-red-400'
                  : item.status === 'reviewed'
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'bg-yellow-600/20 text-yellow-400'
              }`}
            >
              {item.status}
            </span>

          </div>
        </div>
      ))
    )}

  </div>
)}
{/* REVIEW MODAL */}
{reviewModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 w-full max-w-md">

      <h2 className="text-xl font-bold mb-2">
        Review Worker
      </h2>

      <p className="text-gray-400 mb-5">
        {selectedJob?.assignedWorker?.fullName}
      </p>

      <div className="mb-4">
        <label className="block mb-2 text-sm">
          Rating
        </label>

        <select
          value={review.rating}
          onChange={(e) =>
            setReview({
              ...review,
              rating: Number(e.target.value),
            })
          }
          className="w-full bg-gray-800 rounded-xl p-3"
        >
          <option value={5}>★★★★★ (5)</option>
          <option value={4}>★★★★☆ (4)</option>
          <option value={3}>★★★☆☆ (3)</option>
          <option value={2}>★★☆☆☆ (2)</option>
          <option value={1}>★☆☆☆☆ (1)</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm">
          Comment
        </label>

        <textarea
          value={review.comment}
          onChange={(e) =>
            setReview({
              ...review,
              comment: e.target.value,
            })
          }
          placeholder="Tell others about your experience..."
          className="w-full bg-gray-800 rounded-xl p-3 h-32 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setReviewModal(false)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={submitReview}
          className="flex-1 bg-orange-500 hover:bg-orange-600 py-3 rounded-xl"
        >
          Submit Review
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default CustomerDashboard