'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { State, City } from 'country-state-city'
import {
  FaStar,
  FaWhatsapp,
  FaCheckCircle,
  FaSearch,
} from 'react-icons/fa'

const Page = () => {

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

  const [searchName, setSearchName] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const nigeriaStates = State.getStatesOfCountry('NG')

  const cities = selectedState
    ? City.getCitiesOfState(
        'NG',
        nigeriaStates.find((state) => state.name === selectedState)?.isoCode
      )
    : []

  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      const matchesName =
        artisan.businessName
          .toLowerCase()
          .includes(searchName.toLowerCase()) ||
        artisan.category
          .toLowerCase()
          .includes(searchName.toLowerCase())

      const matchesState = selectedState
        ? artisan.state === selectedState
        : true

      const matchesCity = selectedCity
        ? artisan.city === selectedCity
        : true

      return matchesName && matchesState && matchesCity
    })
  }, [searchName, selectedState, selectedCity])

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <main
        className="relative min-h-screen flex items-center justify-center px-5 md:px-10"
        style={{
          backgroundImage: "url('/images/download.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <div className="absolute inset-0 bg-black/75"></div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent"></div>

        <div className="relative z-10 text-center max-w-5xl w-full pt-24">

          <p className="text-orange-500 font-semibold tracking-widest uppercase mb-4">
            Trusted Artisan Marketplace
          </p>

          <h1 className="text-white text-4xl md:text-7xl font-extrabold leading-tight mb-6">
            Find Skilled <span className="text-orange-500">Artisans</span> Near You
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with verified electricians, plumbers, mechanics,
            cleaners, and trusted professionals across Nigeria.
          </p>

          {/* SEARCH */}
          <div className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/20 shadow-2xl">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <input
                type="text"
                placeholder="Search artisan or category"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full p-4 rounded-xl bg-white text-black outline-none"
              />

              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value)
                  setSelectedCity('')
                }}
                className="w-full p-4 rounded-xl bg-white text-black outline-none"
              >
                <option value="">Select State</option>

                {nigeriaStates.map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-4 rounded-xl bg-white text-black outline-none"
              >
                <option value="">Select City</option>

                {cities.map((city, index) => (
                  <option key={index} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              <button className="bg-orange-500 hover:bg-orange-600 transition rounded-xl text-white font-semibold flex items-center justify-center gap-3 px-6 py-4 shadow-lg">
                <FaSearch />
                Search
              </button>

            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">

            <div>
              <h2 className="text-3xl font-extrabold text-white">10K+</h2>
              <p className="text-gray-400 mt-2">Verified Artisans</p>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-white">36</h2>
              <p className="text-gray-400 mt-2">States Covered</p>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-white">50K+</h2>
              <p className="text-gray-400 mt-2">Happy Customers</p>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-white">4.9★</h2>
              <p className="text-gray-400 mt-2">Average Rating</p>
            </div>

          </div>

        </div>
      </main>

      {/* POPULAR CATEGORIES */}
      <section id="services" className="py-20 px-5 md:px-10 max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Popular Categories
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore skilled professionals across multiple service categories.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">

          {[
            'Electricians',
            'Plumbers',
            'Mechanics',
            'Builders',
            'Cleaners',
            'Painters',
            'AC Repair',
            'Carpenters',
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md hover:shadow-xl transition px-6 py-4 rounded-2xl font-semibold text-gray-700 hover:bg-orange-500 hover:text-white cursor-pointer"
            >
              {item}
            </div>
          ))}

        </div>
      </section>

      {/* ARTISANS */}
      <section id="artisans" className="py-10 px-5 md:px-10 max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">

          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              Featured Artisans
            </h2>

            <p className="text-gray-600 text-lg">
              Hire trusted professionals near you.
            </p>
          </div>

          <button className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold">
            View All
          </button>

        </div>

        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredArtisans.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >

              <div className="relative">

                <Image
                  src={artisan.image}
                  alt={artisan.businessName}
                  width={500}
                  height={300}
                  className="w-full h-60 object-cover"
                />

                {artisan.verified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg">
                    <FaCheckCircle />
                    Verified
                  </div>
                )}

              </div>

              <div className="p-6">

                <div className="flex justify-between items-start gap-4 mb-3">

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {artisan.businessName}
                    </h3>

                    <p className="text-orange-500 font-semibold mt-1">
                      {artisan.category}
                    </p>
                  </div>

                </div>

                <p className="text-gray-600 leading-relaxed mb-5">
                  {artisan.description}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-2 mb-4">

                  <div className="flex text-yellow-500 gap-1">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>

                  <span className="text-gray-700 font-semibold">
                    {artisan.rating}
                  </span>

                  <span className="text-gray-400 text-sm">
                    ({artisan.reviews} reviews)
                  </span>

                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-3 mb-6">

                  <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
                    {artisan.state}
                  </span>

                  <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                    {artisan.city}
                  </span>

                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    {artisan.experience}
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">

                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-semibold shadow-lg">
                    View Profile
                  </button>

                  <a
                    href={`https://wa.me/${artisan.phone}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition px-5 rounded-xl font-semibold"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </a>

                </div>

              </div>
            </div>
          ))}

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="py-24 px-5 md:px-10 bg-gray-900"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              What Customers Are Saying
            </h2>

            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Thousands of Nigerians trust ArtisanHub to connect them with reliable professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              {
                name: 'David, Lagos',
                review:
                  'Found an electrician within 20 minutes. Excellent service and very professional.',
              },
              {
                name: 'Amina, Abuja',
                review:
                  'The platform made it easy to hire a cleaner for my office. Smooth experience.',
              },
              {
                name: 'Tunde, Port Harcourt',
                review:
                  'Very reliable artisans and fast response times. Highly recommended.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-lg"
              >

                <div className="flex text-yellow-500 gap-1 mb-4">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                  “{item.review}”
                </p>

                <h4 className="text-white font-bold text-lg">
                  {item.name}
                </h4>

              </div>
            ))}

          </div>

        </div>
      </section>

    </div>
  )
}

export default Page