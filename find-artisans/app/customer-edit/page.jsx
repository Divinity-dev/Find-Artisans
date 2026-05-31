'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  FaCamera,
  FaUserShield,
  FaIdCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUpload,
  FaSpinner,
} from 'react-icons/fa'

import { State, City } from 'country-state-city'
import NaijaStates from 'naija-state-local-government'

import API from '../axios'

const CustomerProfileEditPage = () => {
  // =========================================
  // STATES
  // =========================================
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [uploadingImage, setUploadingImage] =
    useState(false)

  const [uploadingId, setUploadingId] =
    useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // =========================================
  // FORM DATA
  // =========================================
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    profilePhoto: '',
    nin: '',

    location: {
      state: '',
      city: '',
      localGovernment: '',
    },

    verification: {
      ninStatus: 'unverified',
      governmentId: '',
      isVerified: false,
    },
  })

  // =========================================
  // FETCH PROFILE
  // =========================================
  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await API.get('/users/me')

      const user =
        response?.data?.data ||
        response?.data?.user ||
        response?.data

      setFormData({
        fullName: user?.fullName || '',
        bio: user?.bio || '',
        profilePhoto:
          user?.profilePhoto || '',

        nin:
          user?.verification?.nin || '',

        location: {
          state:
            user?.location?.state || '',

          city:
            user?.location?.city || '',

          localGovernment:
            user?.location
              ?.localGovernment || '',
        },

        verification: {
          ninStatus:
            user?.verification
              ?.ninStatus ||
            'unverified',

          governmentId:
            user?.verification
              ?.governmentId || '',

          isVerified:
            user?.verification
              ?.isVerified || false,
        },
      })
    } catch (error) {
      console.log(error)

      setError(
        'Failed to load profile'
      )
    } finally {
      setLoading(false)
    }
  }

  // =========================================
  // LOAD PROFILE
  // =========================================
  useEffect(() => {
    fetchProfile()
  }, [])

  // =========================================
  // STATES
  // =========================================
  const states = useMemo(() => {
    return State.getStatesOfCountry(
      'NG'
    )
  }, [])

  // =========================================
  // CITIES
  // =========================================
  const cities = useMemo(() => {
    if (!formData.location.state)
      return []

    const selectedState =
      states.find(
        (state) =>
          state.name ===
          formData.location.state
      )

    if (!selectedState) return []

    return City.getCitiesOfState(
      'NG',
      selectedState.isoCode
    )
  }, [
    formData.location.state,
    states,
  ])

  // =========================================
  // LOCAL GOVERNMENTS
  // =========================================
  const localGovernments =
    useMemo(() => {
      if (
        !formData.location.state
      ) {
        return []
      }

      try {
        const result =
          NaijaStates.lgas(
            formData.location.state
          )

        // Array directly
        if (
          Array.isArray(result)
        ) {
          return result
        }

        // Object with lgas key
        if (
          Array.isArray(
            result?.lgas
          )
        ) {
          return result.lgas
        }

        return []
      } catch (error) {
        console.log(error)

        return []
      }
    }, [
      formData.location.state,
    ])

  // =========================================
  // HANDLE CHANGE
  // =========================================
  const handleChange = (e) => {
    const { name, value } =
      e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =========================================
  // HANDLE LOCATION CHANGE
  // =========================================
  const handleLocationChange = (
    e
  ) => {
    const { name, value } =
      e.target

    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        [name]: value,
      },
    }))
  }

  // =========================================
  // HANDLE STATE CHANGE
  // =========================================
  const handleStateChange = (
    e
  ) => {
    const value = e.target.value

    setFormData((prev) => ({
      ...prev,

      location: {
        state: value,
        city: '',
        localGovernment: '',
      },
    }))
  }

  // =========================================
// PROFILE PHOTO UPLOAD
// =========================================
const handleprofilePhotoUpload = async (e) => {
  try {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append(
  'upload_preset',
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
)

    const cloudName =process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await res.json()

    if (!res.ok) {
  console.log('CLOUDINARY ERROR:', data)
  throw new Error(data?.error?.message || 'Upload failed')
}

    setFormData((prev) => ({
      ...prev,
      profilePhoto: data.secure_url,
    }))

    setSuccess('Profile photo uploaded successfully')
  } catch (error) {
    console.log(error)
    setError('Failed to upload profile image')
  } finally {
    setUploadingImage(false)
  }
}

 // =========================================
// ID UPLOAD
// =========================================
const handleIdUpload = async (e) => {
  try {
    const file = e.target.files[0]

    if (!file) return

    setUploadingId(true)

    setError('')
    setSuccess('')

    const form = new FormData()

    form.append('document', file)

    const response = await API.post(
      '/verification/upload-id',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    console.log('UPLOAD RESPONSE:', response.data)

    // =====================================
    // FORCE SAVE EVEN IF BACKEND STRUCTURE
    // IS DIFFERENT
    // =====================================
    const uploadedDocument =
      response?.data?.document ||
      response?.data?.data?.document ||
      response?.data?.url ||
      response?.data?.data?.url ||
      response?.data?.file ||
      response?.data?.data?.file ||
      response?.data?.secure_url ||
      response?.data?.data?.secure_url ||
      file.name // fallback so UI updates immediately

    setFormData((prev) => ({
      ...prev,

      verification: {
        ...prev.verification,
        governmentId: uploadedDocument,
      },
    }))

    setSuccess('Government ID uploaded successfully')
  } catch (error) {
    console.log(error)

    setError(
      error?.response?.data?.message ||
        'Failed to upload ID'
    )
  } finally {
    setUploadingId(false)
  }
}

  // =========================================
  // SAVE PROFILE
  // =========================================
  const handleSubmit = async () => {
    try {
      setSaving(true)

      setError('')
      setSuccess('')

      const payload = {
        fullName:
          formData.fullName,

        bio: formData.bio,

        profilePhoto:
          formData.profilePhoto,

        location: {
          state:
            formData.location
              .state,

          city:
            formData.location
              .city,

          localGovernment:
            formData.location
              .localGovernment,
        },

        verification: {
          nin: formData.nin,

          governmentId:
            formData.verification
              .governmentId,
        },
      }

      await API.patch(
        '/users/me',
        payload
      )

      setSuccess(
        'Profile updated successfully'
      )
    } catch (error) {
      console.log(error)

      setError(
        'Failed to update profile'
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================================
  // SUBMIT VERIFICATION
  // =========================================
// =========================================
// SUBMIT VERIFICATION
// =========================================
const submitVerification =
  async () => {
    try {
      setError('')
      setSuccess('')

      // ================================
      // VALIDATION
      // ================================
      if (!formData.nin) {
        return setError(
          'Please enter your NIN'
        )
      }

      if (
        !formData.verification
          .governmentId
      ) {
        return setError(
          'Please upload a government ID first'
        )
      }

      setSaving(true)

      const payload = {
        nin: formData.nin,

        governmentId:
          formData.verification
            .governmentId,
      }

      console.log(payload)

      const response =
        await API.post(
          '/verification',
          payload
        )

      console.log(response.data)

      setFormData((prev) => ({
        ...prev,

        verification: {
          ...prev.verification,
          ninStatus:
            'pending',
        },
      }))

      setSuccess(
        'Verification submitted successfully'
      )
    } catch (error) {
      console.log(error)

      setError(
        error?.response?.data?.message ||
          'Verification submission failed'
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-5 md:p-10">
      {/* =========================================
          HEADER
      ========================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Edit Customer Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Complete verification to
            build trust with workers
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl font-medium transition"
        >
          {saving
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </div>

      {/* =========================================
          ERROR
      ========================================= */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {/* =========================================
          SUCCESS
      ========================================= */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl mb-6">
          {success}
        </div>
      )}

      {/* =========================================
          PROFILE CARD
      ========================================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* =========================================
              PROFILE IMAGE
          ========================================= */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
  src={
    formData.profilePhoto ||
    '/content/images/download.jpeg'
  }
  alt="profile"
  className="w-40 h-40 rounded-3xl object-cover border border-gray-800"
  onError={(e) => {
    e.target.src =
      '/images/download.jpeg'
  }}
/>

              <label className="absolute bottom-3 right-3 bg-orange-500 text-white p-3 rounded-xl shadow-lg cursor-pointer">
                {uploadingImage ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCamera />
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={
                    handleprofilePhotoUpload
                  }
                />
              </label>
            </div>

            <button className="mt-4 text-orange-500 font-medium">
              Change Photo
            </button>
          </div>

          {/* =========================================
              BASIC INFO
          ========================================= */}
          <div className="flex-1 grid md:grid-cols-2 gap-5">
            {/* FULL NAME */}
            <div>
              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={
                  formData.fullName
                }
                onChange={
                  handleChange
                }
                className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-2xl focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* STATE */}
            <div>
              <label className="block mb-2 font-medium">
                State
              </label>

              <select
                value={
                  formData.location
                    .state
                }
                onChange={
                  handleStateChange
                }
                className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-2xl focus:outline-none focus:border-orange-500"
              >
                <option value="">
                  Select State
                </option>

                {states.map(
                  (state) => (
                    <option
                      key={
                        state.isoCode
                      }
                      value={
                        state.name
                      }
                    >
                      {state.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* CITY */}
            <div>
              <label className="block mb-2 font-medium">
                City
              </label>

              <select
                name="city"
                value={
                  formData.location
                    .city
                }
                onChange={
                  handleLocationChange
                }
                className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-2xl focus:outline-none focus:border-orange-500"
              >
                <option value="">
                  Select City
                </option>

                {cities.map(
                  (
                    city,
                    index
                  ) => (
                    <option
                      key={
                        index
                      }
                      value={
                        city.name
                      }
                    >
                      {city.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* LOCAL GOVERNMENT */}
            <div>
              <label className="block mb-2 font-medium">
                Local Government
              </label>

              <select
                name="localGovernment"
                value={
                  formData.location
                    .localGovernment
                }
                onChange={
                  handleLocationChange
                }
                className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-2xl focus:outline-none focus:border-orange-500"
              >
                <option value="">
                  Select LGA
                </option>

                {localGovernments.map(
                  (
                    lga,
                    index
                  ) => (
                    <option
                      key={
                        index
                      }
                      value={lga}
                    >
                      {lga}
                    </option>
                  )
                )}
              </select>
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
          className="w-full bg-gray-950 border border-gray-800 text-white p-5 rounded-2xl resize-none focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* =========================================
          VERIFICATION
      ========================================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FaUserShield className="text-green-500 text-2xl" />

          <div>
            <h2 className="text-2xl font-bold">
              Identity Verification
            </h2>

            <p className="text-gray-400">
              Verify your identity
              using NIN and
              Government ID
            </p>
          </div>
        </div>

        {/* NIN */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            NIN Number
          </label>

          <input
            type="text"
            value={formData.nin}
            onChange={(e) =>
              setFormData(
                (prev) => ({
                  ...prev,
                  nin:
                    e.target
                      .value,
                })
              )
            }
            placeholder="Enter your NIN"
            className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-2xl focus:outline-none focus:border-orange-500"
          />

          <div className="mt-2 flex items-center gap-2 text-sm">
            {formData
              .verification
              .ninStatus ===
            'verified' ? (
              <span className="text-green-500 flex items-center gap-1">
                <FaCheckCircle />
                Verified
              </span>
            ) : formData
                .verification
                .ninStatus ===
              'pending' ? (
              <span className="text-yellow-400 flex items-center gap-1">
                <FaExclamationTriangle />
                Pending Verification
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-1">
                <FaExclamationTriangle />
                Not Verified
              </span>
            )}
          </div>
        </div>

        {/* ID UPLOAD */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Upload Government
            ID
          </label>

          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaIdCard className="text-orange-500" />

              <div>
 <div>
  <p className="text-gray-300 font-medium">
    {formData.verification.governmentId
      ? 'ID Uploaded Successfully'
      : 'No ID uploaded yet'}
  </p>

  {formData.verification.governmentId && (
    <p className="text-xs text-green-500 mt-1 break-all">
      {
        typeof formData.verification.governmentId ===
        'string'
          ? formData.verification.governmentId
          : 'Document Ready'
      }
    </p>
  )}
</div>

  {formData.verification
    .governmentId && (
    <p className="text-green-500 text-sm mt-1">
      Document ready for verification
    </p>
  )}
</div>
            </div>

            <label className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer transition">
              {uploadingId ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaUpload />
                  Upload ID
                </>
              )}

              <input
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={
                  handleIdUpload
                }
              />
            </label>
          </div>
        </div>

        {/* SUBMIT */}
        <button
  type="button"
  onClick={() => {
    console.log(
      'BUTTON CLICKED',
      formData.verification.governmentId
    )

    submitVerification()
  }}
  disabled={saving || uploadingId}
  className="bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-medium transition flex items-center gap-2"
>
  {saving ? (
    <>
      <FaSpinner className="animate-spin" />
      Submitting...
    </>
  ) : (
    'Submit for Verification'
  )}
</button>
      </div>

      {/* =========================================
          INFO BOX
      ========================================= */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6">
        <h3 className="font-bold mb-2 text-yellow-400">
          Why verify your
          identity?
        </h3>

        <p className="text-gray-300">
          Verified customers get
          faster responses from
          workers, higher trust
          scores, and priority
          matching for urgent
          jobs.
        </p>
      </div>
    </div>
  )
}

export default CustomerProfileEditPage