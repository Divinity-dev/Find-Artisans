'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { State, City } from 'country-state-city'
import { FaStar, FaWhatsapp, FaCheckCircle, FaFilter } from 'react-icons/fa'

const Page = () => {
  const searchParams = useSearchParams()

  const initialSearch = searchParams.get('search') || ''
  const initialState = searchParams.get('state') || ''
  const initialCity = searchParams.get('city') || ''

  const [searchName, setSearchName] = useState(initialSearch)
  const [selectedState, setSelectedState] = useState(initialState)
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [showFilters, setShowFilters] = useState(false)

   const artisans = [
    {
      id: 1,
      businessName: 'John Electrical Services',
      category: 'Electrician',
      description:
        'Professional electrical installations and repairs for homes and offices.',
      image: '/images/electrician.jpeg',
      state: 'Lagos',
      city: 'Ikeja',
      rating: 4.9,
      reviews: 124,
      verified: true,
      experience: '7 Years',
      phone: '2348012345678',
    },
    {
      id: 2,
      businessName: 'Swift Plumbing Solutions',
      category: 'Plumber',
      description:
        'Reliable plumbing repairs, installations, and maintenance services.',
      image: '/images/plumber.jpeg',
      state: 'Abuja Federal Capital Territory',
      city: 'Abuja',
      rating: 4.7,
      reviews: 98,
      verified: true,
      experience: '5 Years',
      phone: '2348098765432',
    },
    {
      id: 3,
      businessName: 'Crystal Cleaning Agency',
      category: 'Cleaner',
      description:
        'Trusted residential and commercial cleaning professionals.',
      image: '/images/cleaner.jpeg',
      state: 'Lagos',
      city: 'Lekki',
      rating: 4.8,
      reviews: 210,
      verified: true,
      experience: '6 Years',
      phone: '2348076543210',
    },
    {
      id: 4,
      businessName: 'Prime Builders Hub',
      category: 'Builder',
      description:
        'Expert building construction and renovation specialists.',
      image: '/images/Builder.jpeg',
      state: 'Rivers',
      city: 'Port Harcourt',
      rating: 4.6,
      reviews: 67,
      verified: false,
      experience: '10 Years',
      phone: '2348067891234',
    },
    {
      id: 5,
      businessName: 'Shield Security Guards',
      category: 'Security',
      description:
        'Professional security personnel for homes and businesses.',
      image: '/images/security.jpeg',
      state: 'Oyo',
      city: 'Ibadan',
      rating: 4.5,
      reviews: 55,
      verified: true,
      experience: '8 Years',
      phone: '2348054321987',
    },
    {
      id: 6,
      businessName: 'AutoFix Mechanics',
      category: 'Mechanic',
      description:
        'Affordable and fast automobile repair services.',
      image: '/images/mechanic.jpeg',
      state: 'Kano',
      city: 'Kano',
      rating: 4.9,
      reviews: 180,
      verified: true,
      experience: '9 Years',
      phone: '2348033332222',
    },
  ]

  const nigeriaStates = State.getStatesOfCountry('NG')

  const cities = selectedState
    ? City.getCitiesOfState(
        'NG',
        nigeriaStates.find((s) => s.name === selectedState)?.isoCode
      )
    : []

  const filtered = useMemo(() => {
    return artisans.filter((a) => {
      const matchName =
        a.businessName.toLowerCase().includes(searchName.toLowerCase()) ||
        a.category.toLowerCase().includes(searchName.toLowerCase())

      const matchState = selectedState ? a.state === selectedState : true
      const matchCity = selectedCity ? a.city === selectedCity : true

      return matchName && matchState && matchCity
    })
  }, [searchName, selectedState, selectedCity])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-black text-white py-6 px-5 md:px-10">
        <h1 className="text-3xl font-extrabold">Find Artisans</h1>
        <p className="text-gray-300">Browse and hire trusted professionals</p>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-7xl mx-auto p-5">

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          <FaFilter /> Filters
        </button>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow">

            <input
              placeholder="Search artisan or category"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="p-3 border rounded-lg"
            />

            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
                setSelectedCity('')
              }}
              className="p-3 border rounded-lg"
            >
              <option value="">Select State</option>
              {nigeriaStates.map((s) => (
                <option key={s.isoCode}>{s.name}</option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="">Select City</option>
              {cities.map((c, i) => (
                <option key={i}>{c.name}</option>
              ))}
            </select>

          </div>
        )}

      </div>

      {/* RESULTS */}
      <div className="max-w-350 mx-auto px-5 md:px-10 pb-20">

        <p className="mb-6 text-gray-600">
          {filtered.length} artisans found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filtered.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition">

              <div className="relative">
                <Image
                  src={a.image}
                  alt={a.businessName}
                  width={500}
                  height={300}
                  className="w-full h-52 object-cover rounded-t-2xl"
                />

                {a.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <FaCheckCircle /> Verified
                  </div>
                )}
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold">{a.businessName}</h2>
                <p className="text-orange-500 font-medium">{a.category}</p>

                <div className="flex items-center gap-2 mt-2 text-yellow-500">
                  <FaStar /> {a.rating} ({a.reviews})
                </div>

                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    {a.state}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {a.city}
                  </span>
                </div>

                <a
                  href={`https://wa.me/${a.phone}`}
                  className="mt-4 flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg"
                >
                  <FaWhatsapp /> Contact
                </a>
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default Page
