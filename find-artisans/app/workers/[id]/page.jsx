'use client'

import React, { useState } from 'react'
import {
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaBriefcase,
  FaComments,
  FaPhone,
  FaCamera,
  FaClock,
  FaUserShield,
  FaTools,
} from 'react-icons/fa'

const WorkerProfilePage = () => {
  const [activeTab, setActiveTab] = useState('about')

  const worker = {
    name: 'John Electric',
    skill: 'Professional Electrician',
    location: 'Lekki, Lagos',
    rating: 4.8,
    totalReviews: 126,
    completedJobs: 42,
    responseTime: '5 mins',
    responseRate: '98%',
    experience: '7 Years',
    verified: true,
    available: true,
    bio: 'Experienced electrician specializing in residential and commercial electrical installations, repairs and maintenance. Fast response time and reliable service delivery.',
    joined: '2023',
  }

  const portfolio = [
    {
      id: 1,
      image: '/content/images/download.jpeg',
      title: 'Office Electrical Installation',
      location: 'Lekki, Lagos',
    },
    {
      id: 2,
      image: '/content/images/download.jpeg',
      title: 'Apartment Wiring Setup',
      location: 'Yaba, Lagos',
    },
    {
      id: 3,
      image: '/content/images/download.jpeg',
      title: 'Generator Connection Project',
      location: 'Ikeja, Lagos',
    },
  ]

  const reviews = [
    {
      id: 1,
      name: 'Sarah K.',
      rating: 5,
      comment: 'Very professional and arrived on time. Excellent work quality.',
      date: '2 weeks ago',
    },
    {
      id: 2,
      name: 'Michael A.',
      rating: 4,
      comment: 'Quick response and fixed the issue perfectly.',
      date: '1 month ago',
    },
  ]

  const skills = [
    'House Wiring',
    'Electrical Repairs',
    'Generator Installation',
    'Socket Installation',
    'Industrial Electrical Work',
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-3xl shadow overflow-hidden mb-8">

        {/* COVER */}
        <div className="h-52 bg-gradient-to-r from-orange-500 to-orange-400"></div>

        <div className="p-6 md:p-8 relative">

          {/* PROFILE IMAGE */}
          <div className="absolute -top-16 left-6 md:left-8">
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl">
              <img
                src="/content/images/download.jpeg"
                alt="worker"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="pt-20 flex flex-col lg:flex-row lg:items-start justify-between gap-6">

            {/* LEFT */}
            <div>

              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">
                  {worker.name}
                </h1>

                {worker.verified && (
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium">
                    <FaCheckCircle />
                    Verified
                  </div>
                )}

                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  worker.available
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {worker.available ? 'Available' : 'Offline'}
                </div>
              </div>

              <p className="text-orange-500 text-lg font-medium mt-2">
                {worker.skill}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-gray-500 mt-4">

                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {worker.location}
                </p>

                <p className="flex items-center gap-2">
                  <FaBriefcase />
                  {worker.completedJobs} Jobs Completed
                </p>

                <p className="flex items-center gap-2 text-yellow-500 font-medium">
                  <FaStar />
                  {worker.rating} ({worker.totalReviews} Reviews)
                </p>

              </div>

              <div className="flex flex-wrap gap-3 mt-5">

                <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm">
                  Responds in {worker.responseTime}
                </div>

                <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm">
                  {worker.responseRate} Response Rate
                </div>

                <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm">
                  {worker.experience} Experience
                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

              <button className="bg-orange-500 text-white px-6 py-4 rounded-2xl font-medium flex items-center justify-center gap-3">
                <FaComments />
                Contact Worker
              </button>

              <button className="bg-green-500 text-white px-6 py-4 rounded-2xl font-medium flex items-center justify-center gap-3">
                <FaPhone />
                Call Worker
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-3xl shadow p-6">
          <p className="text-gray-500 mb-2">Average Rating</p>
          <h2 className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
            <FaStar />
            {worker.rating}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <p className="text-gray-500 mb-2">Completed Jobs</p>
          <h2 className="text-3xl font-bold">
            {worker.completedJobs}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <p className="text-gray-500 mb-2">Experience</p>
          <h2 className="text-3xl font-bold">
            {worker.experience}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <p className="text-gray-500 mb-2">Member Since</p>
          <h2 className="text-3xl font-bold">
            {worker.joined}
          </h2>
        </div>

      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-8 overflow-x-auto">

        {['about', 'portfolio', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-2xl capitalize transition ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : 'bg-white shadow'
            }`}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* ABOUT */}
      {activeTab === 'about' && (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* BIO */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">
              About Worker
            </h2>

            <p className="text-gray-600 leading-8">
              {worker.bio}
            </p>

          </div>

          {/* SKILLS */}
          <div className="bg-white rounded-3xl shadow p-6">

            <h2 className="text-2xl font-bold mb-5">
              Skills & Services
            </h2>

            <div className="flex flex-wrap gap-3">

              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </div>
              ))}

            </div>

          </div>

        </div>
      )}

      {/* PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div>

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold">
                Portfolio Projects
              </h2>

              <p className="text-gray-500 mt-1">
                Previous completed work by the artisan
              </p>
            </div>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow"
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />

                <div className="p-5">

                  <h3 className="text-xl font-bold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 flex items-center gap-2">
                    <FaMapMarkerAlt />
                    {item.location}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

      {/* REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-5">

          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl shadow p-6"
            >

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">

                <div>
                  <h3 className="text-xl font-bold">
                    {review.name}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {review.date}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-yellow-500 text-lg">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

              </div>

              <p className="text-gray-600 leading-7">
                {review.comment}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default WorkerProfilePage

