'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import API from '@/app/axios'

import {
  FaStar,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUserShield,
  FaBriefcase,
  FaPhone,
} from 'react-icons/fa'
import { toast } from 'react-toastify'

const renderStars = (score = 0) => {
  const fullStars = Math.round(score)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={
            star <= fullStars
              ? 'text-yellow-400'
              : 'text-gray-600'
          }
        />
      ))}
    </div>
  )
}

const CustomerProfilePage = () => {
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState(null)
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState(null)

  const getTrustLevel = (score = 0) => {
  if (score >= 4) {
    return {
      label: 'Excellent',
      color: 'text-green-400',
    }
  }

  if (score >= 2.5) {
    return {
      label: 'Good',
      color: 'text-yellow-400',
    }
  }

  return {
    label: 'Low',
    color: 'text-red-400',
  }
}

  useEffect(() => {
    if (id) fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    try {
      setLoading(true)

      const { data } = await API.get(`/users/${id}`)

      // Handle multiple possible response structures
      const userData = data.user || data.data || data
      setCustomer(userData.user)
setStats(userData.stats || {})
setJobs(userData.jobs || [])
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load profile'
      )
      toast.error(
        err.response?.data?.message || 'Failed to load profile'
      )
    } finally {
      setLoading(false)
    }
  }

  const trust = getTrustLevel(stats?.trustScore)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-950">
        Loading profile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-gray-950">
        {error}
      </div>
    )
  }

  if (!customer) return null

  const memberSince = customer.createdAt
    ? new Date(customer.createdAt)
    : null

  const memberSinceLabel = memberSince?.getTime()
    ? memberSince.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Unknown'

    

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* HEADER */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-6">

        <h1 className="text-3xl font-bold">
          {customer.fullName}
        </h1>

        <p className="text-gray-400 flex items-center gap-2 mt-2">
          <FaMapMarkerAlt />
          {customer.location?.city}, {customer.location?.state}
        </p>

        <p className="text-gray-500 mt-2">
          Member since {memberSinceLabel}
        </p>

        {customer.verification?.isVerified && (
          <span className="inline-flex items-center gap-2 mt-3 text-green-400">
            <FaCheckCircle />
            Verified Customer
          </span>
        )}
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p>Total Jobs</p>
          <h2 className="text-2xl font-bold">{stats?.totalJobs || 0}</h2>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p>Completed</p>
          <h2 className="text-2xl text-green-400 font-bold">
            {stats?.completedJobs || 0}
          </h2>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">

  <p className="text-gray-400 mb-2">
    Trust Score
  </p>

  <div className="flex items-center gap-2">
    <FaUserShield className="text-orange-400" />

    <span className="text-3xl font-bold">
      {stats?.trustScore?.toFixed(1)}
    </span>

    <span className="text-gray-400">
      /5
    </span>
  </div>

  <div className="mt-2">
    {renderStars(stats?.trustScore)}
  </div>

  <p className={`mt-2 font-semibold ${trust.color}`}>
    {trust.label}
  </p>

</div>
      </div>

      {/* JOB HISTORY (ONLY COMPLETED JOBS) */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

        <h2 className="text-xl font-bold mb-4">
          Completed Jobs
        </h2>

        {jobs.length === 0 ? (
          <p className="text-gray-500">No job history yet</p>
        ) : (
          jobs.map(job => (
            <div
              key={job._id}
              className="p-4 bg-gray-800 rounded-xl mb-3"
            >
              <h3 className="font-semibold">{job.title}</h3>

              <p className="text-gray-400 text-sm">
                {job.category}
              </p>

              <p className="text-gray-500 text-sm">
                Assigned Worker: {job.assignedWorker?.fullName || 'N/A'}
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default CustomerProfilePage