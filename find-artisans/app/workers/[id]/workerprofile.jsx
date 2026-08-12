'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import API from '../../axios'

import {
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaBriefcase,
  FaComments,
  FaPhone,
    FaWhatsapp
} from 'react-icons/fa'

const Workerprofile = ({
    worker,
    reviews,
    jobs,
    ratingStats,
    id
}) => {
//   const { id } = useParams()
  const router = useRouter()

//   const [worker, setWorker] = useState(null)
//   const [reviews, setReviews] = useState([])
  const [portfolio, setPortfolio] = useState([])
//   const [ratingStats, setRatingStats] = useState(null)
//   const [jobs, setJobs] = useState([])
  const [selectedJobStatus, setSelectedJobStatus] = useState('all')

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('about')
  const [contact, setContact] = useState(false)

  // =========================
  // FETCH WORKER + REVIEWS + JOBS
  // =========================
//   const fetchWorker = async () => {
//     try {
//       setLoading(true)

//       const [workerRes, reviewRes] = await Promise.all([
//         API.get(`/users/${id}`),
//         API.get(`/reviews/worker/${id}`).catch(() => ({ data: { reviews: [], stats: null } })),
//       ])

//       // Handle multiple possible response structures for worker data
//       const workerData =
//         workerRes?.data?.data || workerRes?.data?.user || workerRes?.data

//       setWorker(workerData)

//       setReviews(reviewRes?.data?.reviews || [])
//       setRatingStats(reviewRes?.data?.stats || null)

//       // Fetch jobs for this worker 
//       try {
//         const res = await API.get(`/jobs/worker/public/${id}`)
//         const jobsData = res?.data?.data?.jobs || res?.data || []
//         setJobs(Array.isArray(jobsData) ? jobsData : [])
//       } catch (jobErr) {
//         console.error('Failed to fetch worker jobs:', jobErr)
//         setJobs([])
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (id) fetchWorker()
//   }, [id])

//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
//         Loading worker...
//       </div>
//     )

//   if (error)
//     return (
//       <div className="min-h-screen bg-gray-950 text-red-500 flex items-center justify-center">
//         {error}
//       </div>
//     )

//   if (!worker) return null

 const phoneLink = worker?.user?.phone
  ? `https://wa.me/${worker?.user?.phone
      .replace(/\D/g, "")
      .replace(/^0/, "234")}`
  : "#";

  const filteredJobs = jobs.filter(job => {
    if (selectedJobStatus === 'all') return true
    return job.status === selectedJobStatus
  })

  console.log(worker)

  // Compute completed jobs for this worker by checking assigned worker id and job status
  const completedJobsCount = jobs.filter(j => {
    const assignedId = j.assignedWorker?._id || j.assignedWorker?.id
    return String(assignedId) === String(id) && j.status === 'completed'
  }).length

  console.log(worker)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-5 md:p-10">

      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden mb-8">

        <div className="h-52 bg-linear-to-r from-orange-600 to-orange-500" />

        <div className="p-6 md:p-8 relative">

          {/* PROFILE IMAGE */}
          <div className="absolute -top-16 left-6 md:left-8">
            <div className="w-32 h-32 rounded-3xl bg-gray-900 p-2 border border-gray-700">
              <img
                src={worker?.user?.profilePhoto || worker?.user?.profilePhoto || '/images/cleaner.jpeg'}
                alt={worker?.user?.fullName}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="pt-20 flex flex-col lg:flex-row justify-between gap-6">

            {/* LEFT */}
            <div>

              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">
                  {worker?.user?.fullName}
                </h1>

                {worker?.user?.verification?.isVerified && (
                  <span className="bg-green-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <FaCheckCircle /> Verified
                  </span>
                )}
              </div>

              <p className="text-orange-400 text-lg mt-2">
                {worker?.user?.skill}
              </p>

              <div className="flex flex-wrap gap-4 text-gray-400 mt-4">

                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {worker?.user?.location?.city}, {worker?.user?.location?.state}
                </p>

                <p className="flex items-center gap-2">
                  <FaBriefcase />
                  {completedJobsCount} Jobs
                </p>

                <p className="flex items-center gap-2 text-yellow-400">
                  <FaStar />
                  {ratingStats?.user?.avgRating?.toFixed(1) || worker?.user?.rating || 0}
                  ({ratingStats?.user?.totalReviews || worker?.totalReviews || 0})
                </p>

              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="bg-gray-800 px-4 py-2 rounded-xl text-sm">
                  {worker?.user?.yearsOfExperience || 0} Years Experience
                </div>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4">

              <a
                href={phoneLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-medium
                  ${worker?.user?.phone
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-700 opacity-50 cursor-not-allowed'
                  }`}
              >
                <FaWhatsapp />
                WhatsApp
              </a>

              <button
  disabled={!worker?.user?.phone}
  onClick={() => setContact((prev) => !prev)}
  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 px-6 py-4 rounded-2xl flex items-center gap-3 font-medium"
>
  <FaPhone className="text-lg" />

  <div className="flex flex-col items-start">
    <span>Contact</span>

    {contact && (
      <span className="text-sm text-gray-200">
        {worker.user.phone}
      </span>
    )}
  </div>
</button>

            </div>

          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-3 mb-8 overflow-x-auto">

        {['about', 'portfolio', 'jobs', 'reviews'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-xl capitalize transition
              ${activeTab === tab
                ? 'bg-orange-600'
                : 'bg-gray-900 border border-gray-800'
              }`}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* ================= ABOUT ================= */}
      {activeTab === 'about' && (
        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-400 leading-7">
              {worker.bio || 'No bio available'}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>

            <div className="flex flex-wrap gap-2">
              {(worker?.user?.skills || []).map((s, i) => (
                <span
                  key={i}
                  className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= PORTFOLIO ================= */}
      {activeTab === 'portfolio' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {(worker?.user?.portfolio || []).length === 0 ? (
            <p className="text-gray-400">No portfolio yet</p>
          ) : (
            worker?.user?.portfolio.map((p, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

                {p.image && (
                  <img
                    src={p?.image}
                    alt={p?.title}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="font-bold">{p?.title}</h3>
                  <p className="text-gray-400 text-sm">{p?.location}</p>
                </div>

              </div>
            ))
          )}

        </div>
      )}

      {/* ================= JOBS ================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Completed Jobs</h2>

          {/* Only show completed jobs for this worker */}
          {(() => {
            const completedJobs = jobs

            if (completedJobs.length === 0) {
              return (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center">
                  <p className="text-gray-400">No completed jobs found</p>
                </div>
              )
            }

            return completedJobs.map(job => (
              <div key={job._id} className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <p className="text-gray-400 mt-2">Budget: ₦{job.budget || 'N/A'}</p>
                    <p className="text-gray-500 text-sm mt-1">Posted by: {job.postedBy?.fullName || job.postedBy?.name || 'Unknown'}</p>
                  </div>

                  <span className="px-4 py-2 rounded-xl text-sm whitespace-nowrap bg-green-900/20 text-green-400">completed</span>
                </div>

                <div className="mb-5">
                  <p className="text-gray-300 mb-3">{job.description}</p>
                </div>

              </div>
            ))
          })()}

        </div>
      )}

      {/* ================= REVIEWS ================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-5">

          {(reviews || []).length === 0 ? (
            <p className="text-gray-400">No reviews yet</p>
          ) : (
            reviews.map(r => (
              <div key={r._id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">

                <div className="flex justify-between items-center">

                  <p className="font-bold">
                    {r.reviewer?.fullName}
                  </p>

                  <div className="text-yellow-400 flex items-center gap-1">
                    <FaStar />
                    {r.rating}
                  </div>

                </div>

                <p className="text-gray-400 mt-2">
                  {r.comment}
                </p>

              </div>
            ))
          )}

        </div>
      )}

    </div>
  )
}

export default Workerprofile