'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import API from '@/app/axios'

import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaCheckCircle,
  FaUserShield,
  FaClock,
} from 'react-icons/fa'

const JobDetailsPage = () => {
  const { id } = useParams()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (id) {
      fetchJob()
    }
  }, [id])

  const fetchJob = async () => {
    try {
      const { data } = await API.get(`/jobs/${id}`)
      setJob(data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
console.log(job)
  const handleApply = async () => {
    try {
      setApplying(true)

      const { data } = await API.post(
        `/jobs/${id}/apply`
      )

      alert(data.message)

      setJob(prev => ({
        ...prev,
        hasApplied: true,
      }))
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Failed to apply'
      )
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Job not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <div className="max-w-6xl mx-auto px-5 py-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* JOB CARD */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

              <h1 className="text-3xl font-bold mb-4">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-gray-400 mb-6">

                <div className="flex items-center gap-2">
                  <FaBriefcase />
                  {job.category}
                </div>

                <div className="flex items-center gap-2">
                  <FaMoneyBillWave />
                  ₦{job.budget?.toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {job.location?.city},{' '}
                  {job.location?.state}
                </div>

                <div className="flex items-center gap-2">
                  <FaClock />
                  {new Date(
                    job.createdAt
                  ).toLocaleDateString()}
                </div>

              </div>

              <div className="mb-4">
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm">
                  {job.status}
                </span>
              </div>

              <h2 className="text-xl font-semibold mb-3">
                Description
              </h2>

              <p className="text-gray-400 leading-7">
                {job.description}
              </p>

            </div>

            {/* IMAGES */}
            {job.images?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

                <h2 className="text-xl font-bold mb-5">
                  Job Photos
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  {job.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Job ${index + 1}`}
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                  ))}

                </div>

              </div>
            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* CUSTOMER CARD */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

              <h2 className="text-xl font-bold mb-5">
                Posted By
              </h2>

              <div className="flex items-center gap-4">

                <img
                  src={
                    job.customer?.profilePhoto ||
                    '/images/default.png'
                  }
                  alt={job.customer?.fullName}
                  className="w-16 h-16 rounded-2xl object-cover"
                />

                <div>
                  <h3 className="font-semibold text-lg">
                    {job.customer?.fullName}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {job.customer?.location?.city},{' '}
                    {job.customer?.location?.state}
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                {job.customer?.verification
                  ?.isVerified && (
                  <div className="flex items-center gap-2 text-green-400">
                    <FaCheckCircle />
                    Verified Customer
                  </div>
                )}

                <div className="flex items-center gap-2 text-blue-400">
                  <FaUserShield />
                  Trust Profile Available
                </div>

              </div>

              <Link
                href={`/customers/${job.customer?._id}`}
                className="mt-6 block w-full text-center bg-gray-800 hover:bg-gray-700 py-3 rounded-xl"
              >
                View Customer Profile
              </Link>

            </div>

            {/* APPLY CARD */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

              <h2 className="font-bold text-xl mb-3">
                Interested?
              </h2>

              <p className="text-gray-400 mb-5">
                Apply for this job and the customer
                will be able to review your profile.
              </p>

              <button
                onClick={handleApply}
                disabled={
                  applying || job.hasApplied
                }
                className={`w-full py-4 rounded-xl font-semibold ${
                  job.hasApplied
                    ? 'bg-green-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {job.hasApplied
                  ? 'Applied ✓'
                  : applying
                  ? 'Applying...'
                  : 'Apply Now'}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default JobDetailsPage