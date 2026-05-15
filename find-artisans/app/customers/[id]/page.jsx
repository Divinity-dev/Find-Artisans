'use client'

import React, { useState } from 'react'
import {
  FaStar,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUserShield,
  FaClipboardList,
  FaExclamationTriangle,
  FaComments,
  FaPhone,
} from 'react-icons/fa'

const CustomerProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const customer = {
    name: 'Sarah Johnson',
    location: 'Lekki, Lagos',
    memberSince: '2023',
    trustScore: 4.6,
    totalJobs: 12,
    completedJobs: 10,
    cancelledJobs: 1,
    verifiedPhone: true,
    verifiedEmail: true,
  }

  const jobHistory = [
    {
      id: 1,
      title: 'Electrical Repair',
      worker: 'John Electric',
      status: 'Completed',
    },
    {
      id: 2,
      title: 'Plumbing Fix',
      worker: 'Swift Plumbing',
      status: 'Completed',
    },
    {
      id: 3,
      title: 'AC Installation',
      worker: 'Cool Air Tech',
      status: 'Cancelled',
    },
  ]

  const workerReviews = [
    {
      id: 1,
      worker: 'John Electric',
      rating: 5,
      comment: 'Very clear instructions and fast payment.',
      tag: 'Good communication',
    },
    {
      id: 2,
      worker: 'Swift Plumbing',
      rating: 4,
      comment: 'Nice customer, easy to work with.',
      tag: 'Punctual',
    },
  ]

  const flags = [
    {
      type: 'Positive',
      text: 'Fast response time',
    },
    {
      type: 'Positive',
      text: 'Reliable payments',
    },
    {
      type: 'Warning',
      text: '1 cancelled job',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">

      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {customer.name}
              {customer.verifiedEmail && (
                <FaCheckCircle className="text-blue-500" />
              )}
            </h1>

            <p className="text-gray-500 flex items-center gap-2 mt-2">
              <FaMapMarkerAlt />
              {customer.location}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Member since {customer.memberSince}
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-500">Trust Score</p>
            <h2 className="text-4xl font-bold text-green-600">
              <FaUserShield className="inline mr-2" />
              {customer.trustScore}
            </h2>
          </div>

        </div>

        {/* QUICK STATS */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-gray-500">Total Jobs</p>
            <h3 className="text-2xl font-bold">{customer.totalJobs}</h3>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-gray-500">Completed</p>
            <h3 className="text-2xl font-bold text-green-600">
              {customer.completedJobs}
            </h3>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-gray-500">Cancelled</p>
            <h3 className="text-2xl font-bold text-red-500">
              {customer.cancelledJobs}
            </h3>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-gray-500">Verification</p>
            <h3 className="text-2xl font-bold">
              {customer.verifiedPhone ? 'Verified' : 'Unverified'}
            </h3>
          </div>

        </div>

      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {['overview', 'jobs', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-2xl capitalize ${
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
        <div className="grid lg:grid-cols-2 gap-6">

          {/* FLAGS */}
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">
              Behavior Insights
            </h2>

            <div className="space-y-3">
              {flags.map((f, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl flex items-center gap-3 ${
                    f.type === 'Warning'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600'
                  }`}
                >
                  {f.type === 'Warning' ? (
                    <FaExclamationTriangle />
                  ) : (
                    <FaCheckCircle />
                  )}
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">
              Trust Summary
            </h2>

            <p className="text-gray-600 leading-7">
              This customer has a generally reliable history with workers.
              Most jobs are completed successfully with clear communication.
              Occasional cancellations exist but within acceptable range.
            </p>

            <div className="mt-6 flex gap-3">
              <button className="bg-green-500 text-white px-5 py-3 rounded-2xl">
                Contact Customer
              </button>

              <button className="bg-gray-200 px-5 py-3 rounded-2xl">
                View Jobs
              </button>
            </div>
          </div>

        </div>
      )}

      {/* JOBS */}
      {activeTab === 'jobs' && (
        <div className="space-y-5">
          {jobHistory.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl shadow p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-gray-500">Worker: {job.worker}</p>
              </div>

              <span
                className={`px-4 py-2 rounded-xl font-medium ${
                  job.status === 'Completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {job.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-5">
          {workerReviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl shadow p-6"
            >
              <div className="flex justify-between mb-3">
                <h3 className="font-bold">{r.worker}</h3>
                <div className="flex text-yellow-500">
                  {[...Array(r.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>

              <p className="text-gray-600 mb-2">{r.comment}</p>
              <span className="text-sm text-orange-500 font-medium">
                {r.tag}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default CustomerProfilePage
