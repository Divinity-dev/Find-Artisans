'use client'

import React, { useEffect, useState } from 'react'
import {
  FaCamera,
  FaPlus,
  FaTrash,
  FaUserShield,
  FaCheckCircle,
  FaSpinner,
  FaMapMarkerAlt,
} from 'react-icons/fa'

import API from '../axios'
import { State, City } from 'country-state-city'
import { lgas } from 'nigerian-states-and-lgas'

const WorkerProfileEditPage = () => {
  // =========================================
  // STATES
  // =========================================
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [governmentId, setGovernmentId] =
    useState(null)

    const [previewPhoto, setPreviewPhoto] = useState('')

  const [newSkill, setNewSkill] =
    useState('')

  const [skills, setSkills] = useState([])

  const [portfolio, setPortfolio] =
    useState([])

    const [verifying, setVerifying] = useState(false);

    // =========================================
// CLOUDINARY IMAGE UPLOAD
// =========================================
const uploadImageToCloudinary = async (file) => {
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: data,
    }
  )

  const result = await response.json()

  console.log("CLOUDINARY FULL RESPONSE:", result)

  if (!response.ok) {
    throw new Error(result?.error?.message || 'Cloudinary upload failed')
  }

  return result.secure_url
}

  // =========================================
  // FORM DATA
  // =========================================
  const [formData, setFormData] =
    useState({
      fullName: '',
      email: '',
      phone: '',
      skill: '',
      hourlyRate: '',
      location: {
        state: '',
        city: '',
        localGovernment: '',
        address: '',
      },
      profilePhoto: '',
      bio: '',
      yearsOfExperience: '',
      specialization: '',
      nin: '',
      availability: 'available',
    })

  const localGovernments = formData.location.state
    ? lgas(formData.location.state)
    : []

  // =========================================
  // FETCH PROFILE
  // =========================================
  const fetchProfile = async () => {
    try {
      const response = await API.get(
        '/users/me'
      )

      const user = response.data.user

      setFormData({
  fullName: user?.fullName || '',
  email: user?.email || '',
  phone: user?.phone || '',
  hourlyRate: user?.hourlyRate || '',
  profilePhoto:
    user?.profilePhoto || '/images/cleaner.jpeg',
  skill: user?.skill || '',

  location: {
    state: user?.location?.state || '',
    city: user?.location?.city || '',
    localGovernment:
      user?.location?.localGovernment || '',
    address: user?.location?.address || '',
  },

  bio: user?.about || '',

  yearsOfExperience:
    user?.yearsOfExperience || '',

  specialization:
    user?.specialization || '',

  nin:
    user?.verification?.nin || '',

  availability:
    user?.availability || 'available',
})

      setSkills(user?.skills || [])
    } catch (error) {
      console.log(error)
      setError('Failed to load profile')
    }
  }

  const isValidNIN = (nin) => {
  return /^\d{11}$/.test(nin)
}

  // =========================================
  // FETCH PORTFOLIO
  // =========================================
  const fetchPortfolio = async () => {
    try {
      const response = await API.get(
        '/portfolio/me'
      )

      const portfolioData =
        response?.data?.data ||
        response?.data?.portfolio ||
        response?.data ||
        []

      setPortfolio(
        Array.isArray(portfolioData)
          ? portfolioData
          : []
      )
    } catch (error) {
      console.log(error)
      setPortfolio([])
    }
  }

  // =========================================
  // LOAD PAGE
  // =========================================
  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true)

        await Promise.all([
          fetchProfile(),
          fetchPortfolio(),
        ])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [])

  // =========================================
  // HANDLE INPUT
  // =========================================
 const handleChange = (e) => {
  const { name, value } = e.target

  if (name.startsWith('location.')) {
    const key = name.split('.')[1]

    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value,
      },
    }))
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
}

  // =========================================
  // ADD SKILL
  // =========================================
  const addSkill = () => {
    if (!newSkill.trim()) return

    setSkills([
      ...skills,
      newSkill.trim(),
    ])

    setNewSkill('')
  }

  // =========================================
  // REMOVE SKILL
  // =========================================
  const removeSkill = (index) => {
    const updated = skills.filter(
      (_, i) => i !== index
    )

    setSkills(updated)
  }

  // =========================================
  // SAVE PROFILE
  // =========================================
  const saveProfile = async () => {
    try {
      setSaving(true)

      const payload = {
  fullName: formData.fullName,
  email: formData.email,
  phone: formData.phone,
   profilePhoto:
  formData.profilePhoto &&
  !formData.profilePhoto.startsWith('blob:')
    ? formData.profilePhoto
    : '',
  about: formData.bio,
  skill: formData.skill,
  skills,
  hourlyRate: formData.hourlyRate,
  yearsOfExperience: formData.yearsOfExperience,
  specialization: formData.specialization,
  availability: formData.availability,
  location: formData.location,
}
console.log('SAVING:', formData.profilePhoto)
      await API.patch(
        '/users/me',
        payload
      )
      alert(
        'Profile updated successfully'
      )
    } catch (error) {
      console.log(error)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  // =========================================
  // SUBMIT VERIFICATION
  // =========================================
const submitVerification = async () => {
  try {
    if (!governmentId) {
      alert('Please upload your ID');
      return;
    }

    if (!formData.nin || !isValidNIN(formData.nin)) {
      alert('NIN must be exactly 11 digits');
      return;
    }

    setVerifying(true);

    // STEP 1: upload ID
    const uploadData = new FormData();
    uploadData.append('document', governmentId);

    const uploadResponse = await API.post(
      '/verification/upload-id',
      uploadData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const documentUrl =
      uploadResponse.data?.imageUrl ||
      uploadResponse.data?.url ||
      uploadResponse.data?.data?.imageUrl;

    if (!documentUrl) {
      throw new Error('Upload failed: no document URL returned');
    }

    // STEP 2: submit verification
    await API.post('/verification', {
      nin: formData.nin,
      governmentId: documentUrl,
    });

    alert('Verification submitted successfully');
  } catch (error) {
    console.log(error);
    alert(
      error?.response?.data?.message ||
        error.message ||
        'Failed to submit verification'
    );
  } finally {
    setVerifying(false);
  }
};

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-lg">
          <FaSpinner className="animate-spin text-orange-500" />
          Loading profile...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-5 md:p-10">

      {/* =========================================
          HEADER
      ========================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Edit Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Complete your profile to
            attract more customers
          </p>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-4 rounded-2xl font-medium transition flex items-center justify-center gap-3"
        >
          {saving && (
            <FaSpinner className="animate-spin" />
          )}

          {saving
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </div>

      {/* =========================================
          ERROR
      ========================================= */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8">
          {error}
        </div>
      )}

      {/* =========================================
          PROFILE SECTION
      ========================================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 mb-8">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center">

            <div className="relative">

              <img
  src={
    previewPhoto ||
    formData.profilePhoto ||
    '/images/download.jpeg'
  }
  alt="profile"
  className="w-40 h-40 rounded-3xl object-cover border border-gray-700"
/>

              <label className="absolute bottom-3 right-3 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl shadow-lg cursor-pointer transition">

                <FaCamera />

             <input
  type="file"
  hidden
  accept="image/*"
onChange={async (e) => {
  try {
    const file = e.target.files[0]

    if (!file) return

    setSaving(true)

    // LOCAL PREVIEW
    const localPreview = URL.createObjectURL(file)

    setPreviewPhoto(localPreview)

    // UPLOAD TO CLOUDINARY
    const imageUrl =
      await uploadImageToCloudinary(file)

    console.log('CLOUDINARY URL:', imageUrl)

    if (!imageUrl) {
      throw new Error('No image URL returned')
    }

    // SAVE CLOUDINARY URL
    setFormData((prev) => ({
      ...prev,
      profilePhoto: imageUrl,
    }))

    // REMOVE LOCAL BLOB AFTER SUCCESS
    setPreviewPhoto('')
  } catch (error) {
    console.log(error)
    alert('Upload failed')
  } finally {
    setSaving(false)
  }
}}
/>
              </label>

            </div>

            <button className="mt-4 text-orange-400 font-medium">
              Change Photo
            </button>

          </div>

          {/* BASIC DETAILS */}
          <div className="flex-1 grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={
                  formData.fullName
                }
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none p-4 rounded-2xl"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Profession
              </label>

              <input
                type="text"
                name="skill"
                value={
                  formData.skill
                }
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none p-4 rounded-2xl"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={
                  formData.phone
                }
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none p-4 rounded-2xl"
              />
            </div>
          <div className="relative">
  <FaMapMarkerAlt className="absolute top-5 left-4 text-gray-500" />

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">

    {/* STATE */}
    <select
      value={formData.location.state}
      onChange={(e) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            state: e.target.value,
            city: '',
            localGovernment: '',
            address: prev.location.address,
          },
        }))
      }}
      className="w-full bg-gray-800 border border-gray-700 p-4 rounded-2xl"
    >
      <option value="">Select State</option>

      {State.getStatesOfCountry('NG').map((state) => (
        <option key={state.isoCode} value={state.name}>
          {state.name}
        </option>
      ))}
    </select>

    {/* CITY */}
    <select
      value={formData.location.city}
      onChange={(e) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            city: e.target.value,
            localGovernment: '',
          },
        }))
      }}
      disabled={!formData.location.state}
      className="w-full bg-gray-800 border border-gray-700 p-4 rounded-2xl"
    >
      <option value="">Select City</option>

      {City.getCitiesOfState(
        'NG',
        State.getStatesOfCountry('NG').find(
          (s) => s.name === formData.location.state
        )?.isoCode
      ).map((city) => (
        <option key={city.name} value={city.name}>
          {city.name}
        </option>
      ))}
    </select>

    {/* LOCAL GOVERNMENT */}
    <select
      value={formData.location.localGovernment}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            localGovernment: e.target.value,
          },
        }))
      }
      disabled={!formData.location.state}
      className="w-full bg-gray-800 border border-gray-700 p-4 rounded-2xl"
    >
      <option value="">Select Local Government</option>
      {localGovernments.map((lga) => (
        <option key={lga} value={lga}>
          {lga}
        </option>
      ))}
    </select>

    {/* ADDRESS */}
    <input
      type="text"
      value={formData.location.address}
      onChange={handleChange}
      name="location.address"
      placeholder="Full Address"
      className="w-full bg-gray-800 border border-gray-700 p-4 rounded-2xl"
    />
  </div>
</div>

          </div>

        </div>

      </div>

      {/* =========================================
          ABOUT
      ========================================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          About You
        </h2>

        <textarea
          rows={6}
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell customers about yourself..."
          className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none p-5 rounded-2xl resize-none"
        />

      </div>

      {/* =========================================
          SKILLS
      ========================================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Skills & Services
        </h2>

        <div className="flex flex-col md:flex-row gap-3 mb-5">

          <input
            type="text"
            value={newSkill}
            onChange={(e) =>
              setNewSkill(
                e.target.value
              )
            }
            placeholder="Add a skill"
            className="flex-1 bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none p-4 rounded-2xl"
          />

          <button
            onClick={addSkill}
            className="bg-orange-500 hover:bg-orange-600 px-6 rounded-2xl flex items-center justify-center gap-2 transition"
          >
            <FaPlus />
            Add
          </button>

        </div>

        <div className="flex flex-wrap gap-3">

          {skills.map(
            (skill, index) => (
              <div
                key={index}
                className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-3 rounded-full flex items-center gap-3"
              >
                {skill}

                <button
                  onClick={() =>
                    removeSkill(
                      index
                    )
                  }
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            )
          )}

        </div>

      </div>

      {/* =========================================
          EXPERIENCE
      ========================================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Work Experience
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Years of Experience
            </label>
 
            <input
              type="text"
              name="yearsOfExperience"
              value={
                formData.yearsOfExperience
              }
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none p-4 rounded-2xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Specialization
            </label>

            <input
              type="text"
              name="specialization"
              value={
                formData.specialization
              }
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none p-4 rounded-2xl"
            />
          </div>

        </div>

      </div>
  {/* =========================================
          Hourly rate
      ========================================= */}
     <div className="mb-8">
  <label className="block mb-2 text-sm text-gray-400">
    Charge Per Hour (₦)
  </label>

  <input
    type="number"
    name="hourlyRate"
    value={formData.hourlyRate}
    onChange={handleChange}
    className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none p-4 rounded-2xl"
    placeholder="e.g. 5000"
  />

  {/* 👇 DISPLAY PREVIEW */}
  {formData.hourlyRate && (
    <p className="text-sm text-orange-400 mt-2">
      ₦{formData.hourlyRate}/hr
    </p>
  )}
</div>

      {/* =========================================
          PORTFOLIO
      ========================================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

          <div>
            <h2 className="text-2xl font-bold">
              Portfolio
            </h2>

            <p className="text-gray-400 mt-1">
              Your uploaded projects
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {portfolio.length ===
          0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6">
              <p className="text-gray-400">
                No portfolio uploaded
              </p>
            </div>
          ) : (
            portfolio.map((item) => (
              <div
                key={item._id}
                className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden"
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">

                  <h3 className="font-bold text-lg mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {
                      item.location
                    }
                  </p>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

      {/* =========================================
          AVAILABILITY
      ========================================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Availability
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <button
            onClick={() =>
             setFormData({
  ...formData,
  availability: 'available'
})
            }
            className={`py-4 rounded-2xl font-medium transition ${
              formData.availability === 'available'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 border border-gray-700'
            }`}
          >
            Available
          </button>

          <button
            onClick={() =>
              setFormData({
                ...formData,
                availability: 'busy',
              })
            }
            className={`py-4 rounded-2xl font-medium transition ${
              formData.availability === 'busy'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 border border-gray-700'
            }`}
          >
            Busy
          </button>

          <button className="bg-gray-800 border border-gray-700 py-4 rounded-2xl font-medium">
  Offline
</button>

        </div>

      </div>

      {/* =========================================
          VERIFICATION
      ========================================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

        <div className="flex items-center gap-3 mb-5">

          <FaUserShield className="text-green-500 text-2xl" />

          <div>
            <h2 className="text-2xl font-bold">
              Verification
            </h2>

            <p className="text-gray-400 mt-1">
              Verified workers get
              more visibility
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 text-sm text-gray-400">
              NIN Number
            </label>

            <input
              type="text"
              name="nin"
              value={formData.nin}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 outline-none p-4 rounded-2xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Upload Government ID
            </label>

            <input
              type="file"
              onChange={(e) =>
                setGovernmentId(
                  e.target.files[0]
                )
              }
              className="w-full bg-gray-800 border border-gray-700 p-4 rounded-2xl"
            />
          </div>

        </div>

        <button
  onClick={submitVerification}
  disabled={verifying}
  className="mt-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-6 py-4 rounded-2xl font-medium transition flex items-center justify-center gap-3"
>
  {verifying ? (
    <>
      <FaSpinner className="animate-spin" />
      Processing...
    </>
  ) : (
    'Submit Verification'
  )}
</button>

      </div>

    </div>
  )
}

export default WorkerProfileEditPage