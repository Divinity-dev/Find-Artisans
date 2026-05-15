'use client'

import React, { useState } from 'react'
import {
  FaCamera,
  FaMapMarkerAlt,
  FaTools,
  FaUserShield,
  FaCheckCircle,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'

const WorkerProfileEditPage = () => {
  const [skills, setSkills] = useState([
    'Electrical Repairs',
    'House Wiring',
  ])

  const [newSkill, setNewSkill] = useState('')

  const addSkill = () => {
    if (newSkill.trim() !== '') {
      setSkills([...skills, newSkill])
      setNewSkill('')
    }
  }

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index)
    setSkills(updated)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Edit Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Complete your profile to attract more customers
          </p>
        </div>

        <button className="bg-orange-500 text-white px-6 py-4 rounded-2xl font-medium">
          Save Changes
        </button>

      </div>

      {/* PROFILE TOP */}
      <div className="bg-white rounded-3xl shadow p-6 md:p-8 mb-8">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center">

            <div className="relative">

              <img
                src="/content/images/download.jpeg"
                alt="profile"
                className="w-40 h-40 rounded-3xl object-cover"
              />

              <button className="absolute bottom-3 right-3 bg-orange-500 text-white p-3 rounded-xl shadow-lg">
                <FaCamera />
              </button>

            </div>

            <button className="mt-4 text-orange-500 font-medium">
              Change Photo
            </button>

          </div>

          {/* BASIC DETAILS */}
          <div className="flex-1 grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Electric"
                className="w-full border p-4 rounded-2xl"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Skill / Profession
              </label>

              <input
                type="text"
                placeholder="Electrician"
                className="w-full border p-4 rounded-2xl"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Phone Number
              </label>

              <input
                type="text"
                placeholder="+234 800 000 0000"
                className="w-full border p-4 rounded-2xl"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Location
              </label>

              <input
                type="text"
                placeholder="Lekki, Lagos"
                className="w-full border p-4 rounded-2xl"
              />
            </div>

          </div>

        </div>

      </div>

      {/* ABOUT */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          About You
        </h2>

        <textarea
          rows={6}
          placeholder="Tell customers about yourself, your experience and services..."
          className="w-full border p-5 rounded-2xl resize-none"
        />

      </div>

      {/* SKILLS */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Skills & Services
        </h2>

        <div className="flex gap-3 mb-5">

          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className="flex-1 border p-4 rounded-2xl"
          />

          <button
            onClick={addSkill}
            className="bg-orange-500 text-white px-6 rounded-2xl flex items-center gap-2"
          >
            <FaPlus />
            Add
          </button>

        </div>

        <div className="flex flex-wrap gap-3">

          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-orange-100 text-orange-600 px-4 py-3 rounded-full flex items-center gap-3"
            >
              {skill}

              <button onClick={() => removeSkill(index)}>
                <FaTrash className="text-sm" />
              </button>
            </div>
          ))}

        </div>

      </div>

      {/* EXPERIENCE */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Work Experience
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Years of Experience
            </label>

            <input
              type="text"
              placeholder="7 Years"
              className="w-full border p-4 rounded-2xl"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Specialization
            </label>

            <input
              type="text"
              placeholder="Residential Electrical Repairs"
              className="w-full border p-4 rounded-2xl"
            />
          </div>

        </div>

      </div>

      {/* PORTFOLIO */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

          <div>
            <h2 className="text-2xl font-bold">
              Portfolio
            </h2>

            <p className="text-gray-500 mt-1">
              Upload images of your past work
            </p>
          </div>

          <button className="bg-orange-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2">
            <FaCamera />
            Upload Project
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-gray-100 rounded-3xl overflow-hidden"
            >

              <img
                src="/content/images/download.jpeg"
                alt="portfolio"
                className="w-full h-56 object-cover"
              />

              <div className="p-4">

                <input
                  type="text"
                  placeholder="Project Title"
                  className="w-full border p-3 rounded-xl mb-3"
                />

                <input
                  type="text"
                  placeholder="Location"
                  className="w-full border p-3 rounded-xl"
                />

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* AVAILABILITY */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Availability
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <button className="bg-green-500 text-white py-4 rounded-2xl font-medium">
            Available
          </button>

          <button className="bg-gray-200 py-4 rounded-2xl font-medium">
            Busy
          </button>

          <button className="bg-gray-200 py-4 rounded-2xl font-medium">
            Offline
          </button>

        </div>

      </div>

      {/* VERIFICATION */}
      <div className="bg-white rounded-3xl shadow p-6">

        <div className="flex items-center gap-3 mb-5">

          <FaUserShield className="text-green-500 text-2xl" />

          <div>
            <h2 className="text-2xl font-bold">
              Verification
            </h2>

            <p className="text-gray-500 mt-1">
              Verified workers get more visibility and trust
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              NIN Number
            </label>

            <input
              type="text"
              placeholder="Enter NIN"
              className="w-full border p-4 rounded-2xl"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Upload Government ID
            </label>

            <input
              type="file"
              className="w-full border p-4 rounded-2xl"
            />
          </div>

        </div>

        <button className="mt-6 bg-orange-500 text-white px-6 py-4 rounded-2xl font-medium">
          Submit Verification
        </button>

      </div>

    </div>
  )
}

export default WorkerProfileEditPage