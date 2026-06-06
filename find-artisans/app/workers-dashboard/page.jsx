'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaStar,
  FaBriefcase,
  FaClock,
  FaWallet,
  FaChartLine,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaTools,
  FaArrowRight,
} from 'react-icons/fa'

import API from '../axios'

const WorkerDashboard = () => {
  // =====================================
  // STATES
  // =====================================
  const [activeTab, setActiveTab] = useState('available')
  const [loading, setLoading] = useState(false)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [error, setError] = useState('')
  const [reviewModal, setReviewModal] = useState(false)
const [selectedJob, setSelectedJob] = useState(null)

const [review, setReview] = useState({
  rating: 5,
  comment: '',
})

  // =====================================
  // WORKER PROFILE
  // =====================================
  const [worker, setWorker] = useState(null)
  const [isAvailable, setIsAvailable] = useState(false)

  // =====================================
  // JOBS
  // =====================================
  const [availableJobs, setAvailableJobs] = useState([])
  const [activeJobs, setActiveJobs] = useState([])
  const [completedJobs, setCompletedJobs] = useState([])

  // =====================================
  // PORTFOLIO
  // =====================================
  const [portfolio, setPortfolio] = useState([])

  // =====================================
  // EARNINGS
  // =====================================
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
  })

  // =====================================
  // SAFE RESPONSE HELPER
  // =====================================
  const extractData = (response, fallback = []) => {
    return (
      response?.data?.data ||
      response?.data?.jobs ||
      response?.data?.portfolio ||
      response?.data?.payments ||
      response?.data?.worker ||
      response?.data?.user ||
      response?.data ||
      fallback
    )
  }

  // =====================================
  // FETCH PROFILE
  // =====================================
  const fetchProfile = async () => {
    try {
      const response = await API.get('/users/me')

      const workerData = extractData(response, null)

      setWorker(workerData)
      setIsAvailable(workerData?.isAvailable || false)
    } catch (error) {
      console.log(error)
    }
  }

  // =====================================
  // FETCH AVAILABLE JOBS
  // =====================================
  const fetchAvailableJobs = async () => {
    try {
      const response = await API.get('/jobs/available')

      const jobsData = extractData(response, [])

      setAvailableJobs(Array.isArray(jobsData) ? jobsData : [])
    } catch (error) {
      console.log(error)
      setAvailableJobs([])
    }
  }

  // =====================================
  // FETCH ACTIVE JOBS
  // =====================================
  const fetchActiveJobs = async () => {
    try {
      const response = await API.get('/jobs/worker/active')

      const jobsData = extractData(response, [])

      setActiveJobs(Array.isArray(jobsData) ? jobsData : [])
    } catch (error) {
      console.log(error)
      setActiveJobs([])
    }
  }

  // =====================================
  // FETCH COMPLETED JOBS
  // =====================================
  const fetchCompletedJobs = async () => {
    try {
      const response = await API.get('/jobs/worker/completed')

      const jobsData = extractData(response, [])

      setCompletedJobs(Array.isArray(jobsData) ? jobsData : [])
    } catch (error) {
      console.log(error)
      setCompletedJobs([])
    }
  }

  // =====================================
  // FETCH PORTFOLIO
  // =====================================
  const fetchPortfolio = async () => {
    try {
      const response = await API.get('/portfolio/me')

      const portfolioData = extractData(response, [])

      setPortfolio(Array.isArray(portfolioData) ? portfolioData : [])
    } catch (error) {
      console.log(error)
      setPortfolio([])
    }
  }

  // =====================================
  // FETCH EARNINGS
  // =====================================
  const fetchEarnings = async () => {
    try {
      const response = await API.get('/payments/worker/me')

      const earningsData = extractData(response, {})

      setEarnings({
        today: earningsData?.today || 0,
        week: earningsData?.week || 0,
        month: earningsData?.month || 0,
      })
    } catch (error) {
      console.log(error)
    }
  }

  // =====================================
  // TOGGLE AVAILABILITY
  // =====================================
  const toggleAvailability = async () => {
    try {
      setAvailabilityLoading(true)

      const response = await API.patch('/users/worker/availability')

      const updatedUser = extractData(response, {})

      setIsAvailable(updatedUser?.isAvailable)
    } catch (error) {
      console.log(error)
    } finally {
      setAvailabilityLoading(false)
    }
  }

  // =====================================
  // ACCEPT JOB
  // =====================================
  const acceptJob = async (jobId) => {
    try {
      await API.patch(`/jobs/${jobId}/accept`)

      fetchAvailableJobs()
      fetchActiveJobs()
    } catch (error) {
      console.log(error)
      alert('Failed to accept job')
    }
  }

  // =====================================
  // MARK JOB COMPLETE
  // =====================================
  const completeJob = async (jobId) => {
    try {
      await API.patch(`/jobs/${jobId}/complete`)

      fetchActiveJobs()
      fetchCompletedJobs()
    } catch (error) {
      console.log(error)
      alert('Failed to complete job')
    }
  }

  // =====================================
  // LOAD DASHBOARD
  // =====================================
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        await Promise.all([
          fetchProfile(),
          fetchAvailableJobs(),
          fetchActiveJobs(),
          fetchCompletedJobs(),
          fetchPortfolio(),
          fetchEarnings(),
        ])
      } catch (error) {
        console.log(error)
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const openReviewModal = (job) => {
  setSelectedJob(job)

  setReview({
    rating: 5,
    comment: '',
  })

  setReviewModal(true)
}

const submitCustomerReview = async () => {
  try {
    await API.post('/reviews/customer-review', {
      jobId: selectedJob._id,
      rating: review.rating,
      comment: review.comment,
    })

    setReviewModal(false)
    setSelectedJob(null)

    fetchCompletedJobs()

    alert('Customer review submitted')
  } catch (err) {
    alert(
      err?.response?.data?.message ||
      'Failed to submit review'
    )
  }
}

  // =====================================
  // STATUS STYLE
  // =====================================
  const renderStatus = (status) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      assigned: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      completed: 'bg-green-500/10 text-green-400 border-green-500/20',
      'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    }

    return (
      styles[status] ||
      'bg-gray-500/10 text-gray-300 border-gray-500/20'
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-5 md:p-10">
      {/* =====================================
          HEADER
      ===================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Worker Dashboard
          </h1>

          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Manage jobs, earnings, availability and portfolio
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Link
            href="/worker-edit"
            className="group flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 px-5 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-gray-200 shadow-lg shadow-black/20"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition">
              <FaTools className="text-gray-300 text-sm" />
            </div>

            <div className="text-left">
              <p className="text-xs text-gray-500">
                Manage Account
              </p>
              <p className="font-semibold">
                Edit Profile
              </p>
            </div>
          </Link>

          <button
            onClick={toggleAvailability}
            disabled={availabilityLoading}
            className={`flex items-center justify-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-200 min-w-[180px] ${
              isAvailable
                ? 'bg-green-600 hover:bg-green-700 border-green-500 text-white'
                : 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-gray-200'
            }`}
          >
            {availabilityLoading ? (
              <FaSpinner className="animate-spin text-lg" />
            ) : isAvailable ? (
              <FaToggleOn className="text-xl" />
            ) : (
              <FaToggleOff className="text-xl" />
            )}

            <div className="text-left">
              <p className="text-xs opacity-80">
                Worker Status
              </p>
              <p className="font-semibold">
                {isAvailable ? 'Available' : 'Offline'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* =====================================
          ERROR
      ===================================== */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {/* =====================================
          LOADING
      ===================================== */}
      {loading && (
        <div className="text-gray-400 text-sm">
          Loading dashboard...
        </div>
      )}

      {/* =====================================
          PROFILE
      ===================================== */}
      {!loading && worker && (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8 grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {worker?.fullName || 'Worker'}

              {(worker?.verified || worker?.verification?.isVerified) && (
                <FaCheckCircle className="text-green-500" />
              )}
            </h2>

            <p className="text-orange-400 font-medium mt-1">
              {worker?.skill || 'Artisan'}
            </p>

            <p className="text-gray-400 flex items-center gap-2 mt-3 text-sm">
              
             <p className="text-gray-400 flex items-center gap-2 mt-3 text-sm">
  <FaMapMarkerAlt />
  {worker?.location?.city}, {worker?.location?.state},{worker?.location?.localGovernment}
</p>
            </p>
          </div>

          <div className="bg-gray-950/60 rounded-2xl p-4 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">
              Rating
            </p>

            <h3 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
              <FaStar />
              {worker?.rating || 0}
            </h3>
          </div>

          <div className="bg-gray-950/60 rounded-2xl p-4 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">
              Jobs
            </p>

            <h3 className="text-2xl font-bold">
              {worker?.jobsCompleted || 0}
            </h3>
          </div>

          <div className="bg-gray-950/60 rounded-2xl p-4 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">
              Response Time
            </p>

            <h3 className="text-2xl font-bold text-green-400">
              {worker?.responseTime || 'N/A'}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {worker?.responseRate || '0%'}
            </p>
          </div>
        </div>
      )}

      {/* =====================================
          EARNINGS
      ===================================== */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {[
          {
            label: 'Today',
            value: `₦${earnings.today}`,
            icon: <FaWallet className="text-green-400" />,
          },
          {
            label: 'This Week',
            value: `₦${earnings.week}`,
            icon: <FaChartLine className="text-orange-400" />,
          },
          {
            label: 'This Month',
            value: `₦${earnings.month}`,
            icon: <FaBriefcase className="text-blue-400" />,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">
                {item.label}
              </p>

              <div className="text-xl">
                {item.icon}
              </div>
            </div>

            <h2 className="text-3xl font-bold">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* =====================================
          TABS
      ===================================== */}
      <div className="flex flex-wrap gap-3 mb-8 overflow-x-auto pb-2">
        {['available', 'active', 'completed', 'portfolio'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-2xl capitalize border transition whitespace-nowrap ${
              activeTab === tab
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
            }`}
          >
            {tab} jobs
          </button>
        ))}
      </div>

      {/* =====================================
          AVAILABLE JOBS
      ===================================== */}
      {!loading && activeTab === 'available' && (
        <div className="grid md:grid-cols-2 gap-6">
          {availableJobs.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
              <p className="text-gray-400">
                No available jobs.
              </p>
            </div>
          ) : (
            availableJobs.map((job) => (
              <div
                key={job._id}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      {job.title}
                    </h2>

                    <div className="space-y-2 text-gray-400 text-sm">
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        {job.location || 'No location'}
                      </p>

                      <p className="flex items-center gap-2">
                        <FaClock />
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleString()
                          : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs border ${renderStatus(job.status)}`}>
                    {job.status || 'pending'}
                  </span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl transition flex items-center justify-center gap-2">
                    Details
                    <FaArrowRight className="text-xs" />
                  </button>

                  <button
                    onClick={() => acceptJob(job._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl transition"
                  >
                    Accept Job
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* =====================================
          ACTIVE JOBS
      ===================================== */}
      {!loading && activeTab === 'active' && (
        <div className="grid md:grid-cols-2 gap-6">
          {activeJobs.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
              <p className="text-gray-400">
                No active jobs.
              </p>
            </div>
          ) : (
            activeJobs.map((job) => (
              <div
                key={job._id}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      {job.title}
                    </h2>

                    <div className="space-y-2 text-sm text-gray-400">
                      <p>
                        Customer: {job?.customer?.fullName || 'Customer'}
                      </p>

                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        {job.location || 'No location'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs border ${renderStatus(job.status)}`}>
                    {job.status}
                  </span>
                </div>

                <button
                  onClick={() => completeJob(job._id)}
                  className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl transition"
                >
                  Mark as Completed
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* =====================================
          COMPLETED JOBS
      ===================================== */}
      {!loading && activeTab === 'completed' && (
        <div className="grid md:grid-cols-2 gap-6">
          {completedJobs.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
              <p className="text-gray-400">
                No completed jobs.
              </p>
            </div>
          ) : (
            completedJobs.map((job) => (
              <div
                key={job._id}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      {job.title}
                    </h2>

                    <p className="text-gray-400 text-sm">
                      Customer: {job?.customer?.fullName || 'Customer'}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs border ${renderStatus(job.status)}`}>
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-yellow-400 mt-5">
                  <FaStar />
                  <span className="font-semibold">
                    {job?.rating || 5}
                  </span>
                </div>
                {!job.customerReview && (
  <button
    onClick={() => openReviewModal(job)}
    className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl"
  >
    ⭐ Review Customer
  </button>
)}
              </div>
            ))
          )}
        </div>
      )}

      {/* =====================================
          PORTFOLIO
      ===================================== */}
      {!loading && activeTab === 'portfolio' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
              <p className="text-gray-400">
                No portfolio uploaded.
              </p>
            </div>
          ) : (
            portfolio.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-lg font-bold mb-2">
                    {item.title}
                  </h2>

                  <p className="text-gray-400 flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt />
                    {item.location}
                  </p>

                  {item.description && (
                    <p className="text-gray-500 text-sm mt-3 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {reviewModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 w-full max-w-md">

      <h2 className="text-xl font-bold mb-2">
        Review Customer
      </h2>

      <p className="text-gray-400 mb-5">
        {selectedJob?.customer?.fullName}
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
          placeholder="Describe your experience with this customer..."
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
          onClick={submitCustomerReview}
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

export default WorkerDashboard

