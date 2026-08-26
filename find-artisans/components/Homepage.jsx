'use client'

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import Image from 'next/image'
import Link from 'next/link'

import {
  State,
  City,
} from 'country-state-city'

import {
  lgas,
} from 'nigerian-states-and-lgas'

import {
  motion,
  AnimatePresence,
} from 'framer-motion'

import useGeolocation from '../hooks/useGeolocation'
import WorkerCard from '../components/WorkerCard'

import {
  FaStar,
  FaWhatsapp,
  FaCheckCircle,
  FaSearch,
  FaQuoteLeft,
  FaBolt,
  FaUserCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaUndo,
  FaShieldAlt,
  FaArrowRight,
  FaCompass,
  FaLocationArrow,
  FaUserTie,
  FaPhoneAlt,
  FaChevronRight,
  FaHammer,
  FaWrench,
  FaPaintRoller,
  FaBroom,
  FaCar,
} from 'react-icons/fa'


// ============================================================
// TESTIMONIALS
// ============================================================

const testimonials = [
  {
    id: 1,
    type: 'Customer',
    name: 'Chinedu O.',
    location: 'Lagos',
    image: '/images/worker3.jpeg',
    message:
      'I found a verified plumber within 15 minutes. The service was excellent and affordable.',
    rating: 5,
  },
  {
    id: 2,
    type: 'Worker',
    name: 'Aisha M.',
    location: 'Abuja',
    image: '/images/worker1.jpeg',
    message:
      "Since joining FindArtisans, I've gained more customers than ever before.",
    rating: 5,
  },
  {
    id: 3,
    type: 'Customer',
    name: 'David E.',
    location: 'Port Harcourt',
    image: '/images/worker2.jpeg',
    message:
      'The ratings and verification gave me confidence. My electrician did a fantastic job.',
    rating: 5,
  },
  {
    id: 4,
    type: 'Worker',
    name: 'Blessing K.',
    location: 'Benin',
    image: '/images/electrician.jpeg',
    message:
      'FindArtisans has helped me grow my business and reach more clients.',
    rating: 5,
  },
]


// ============================================================
// CATEGORIES
// ============================================================

const categories = [
  {
    title: 'Electricians',
    icon: <FaBolt />,
    description:
      'Electrical installations, repairs and maintenance.',
  },
  {
    title: 'Plumbers',
    icon: <FaWrench />,
    description:
      'Reliable plumbing installation and repairs.',
  },
  {
    title: 'Carpenters',
    icon: <FaHammer />,
    description:
      'Furniture, woodwork and custom carpentry.',
  },
  {
    title: 'Painters',
    icon: <FaPaintRoller />,
    description:
      'Interior, exterior and decorative painting.',
  },
  {
    title: 'Cleaners',
    icon: <FaBroom />,
    description:
      'Professional home and office cleaning services.',
  },
  {
    title: 'Mechanics',
    icon: <FaCar />,
    description:
      'Vehicle repairs, servicing and diagnostics.',
  },
]


// ============================================================
// HOMEPAGE
// ============================================================

const Homepage = ({ workers = [] }) => {

  // ==========================================================
  // GEOLOCATION
  // ==========================================================

  const {
    location,
    loading: locationLoading,
    error: locationError,
    getLocation,
  } = useGeolocation()


  // ==========================================================
  // WORKER RESULTS
  // ==========================================================

  const [filteredWorkers, setFilteredWorkers] =
    useState([])

  const [totalWorkers, setTotalWorkers] =
    useState(0)

  const [totalPages, setTotalPages] =
    useState(1)

  const [currentPage, setCurrentPage] =
    useState(1)

  const [workersLoading, setWorkersLoading] =
    useState(false)

  const [workersError, setWorkersError] =
    useState('')


  // ==========================================================
  // NEARBY SEARCH
  // ==========================================================

  const [locationSearch, setLocationSearch] =
    useState(false)

  const [locationSearchSkill, setLocationSearchSkill] =
    useState('')

  const [locationSearchLoading, setLocationSearchLoading] =
    useState(false)

  const [selectedRadius, setSelectedRadius] =
    useState(5)


  // ==========================================================
  // FILTERS
  // ==========================================================

  const [searchName, setSearchName] =
    useState('')

  const [selectedState, setSelectedState] =
    useState('')

  const [selectedCity, setSelectedCity] =
    useState('')

  const [selectedLGA, setSelectedLGA] =
    useState('')


  // ==========================================================
  // TESTIMONIAL STATE
  // ==========================================================

  const [currentTestimonial, setCurrentTestimonial] =
    useState(0)


  // ==========================================================
  // CONSTANTS
  // ==========================================================

  const distanceOptions = [
    1,
    3,
    5,
    10,
  ]

  const workersPerPage = 12


  // ==========================================================
  // NIGERIA LOCATION DATA
  // ==========================================================

  const nigeriaStates =
    useMemo(
      () =>
        State.getStatesOfCountry('NG'),
      []
    )


  // ==========================================================
  // CITIES
  // ==========================================================

  const cities = useMemo(() => {

    if (!selectedState) {
      return []
    }

    const state =
      nigeriaStates.find(
        (item) =>
          item.name === selectedState
      )

    if (!state) {
      return []
    }

    return City.getCitiesOfState(
      'NG',
      state.isoCode
    )

  }, [
    selectedState,
    nigeriaStates,
  ])


  // ==========================================================
  // LGAs
  // ==========================================================

  const localGovernments =
    useMemo(() => {

      if (!selectedState) {
        return []
      }

      return lgas(selectedState) || []

    }, [
      selectedState,
    ])


  // ==========================================================
  // NORMAL FILTER CHECK
  // ==========================================================

  const hasNormalFilters =
    Boolean(
      searchName.trim()
    ) ||
    Boolean(selectedState) ||
    Boolean(selectedCity) ||
    Boolean(selectedLGA)


  // ==========================================================
  // ACTIVE FILTER COUNT
  // ==========================================================

  const activeFilterCount =
    Number(
      Boolean(searchName.trim())
    ) +
    Number(
      Boolean(selectedState)
    ) +
    Number(
      Boolean(selectedCity)
    ) +
    Number(
      Boolean(selectedLGA)
    ) +
    Number(
      Boolean(locationSearch)
    )


  // ==========================================================
  // TESTIMONIAL SLIDER
  // ==========================================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setCurrentTestimonial(
          (previous) =>
            previous ===
            testimonials.length - 1
              ? 0
              : previous + 1
        )

      }, 5000)

    return () =>
      clearInterval(interval)

  }, [])


  // ==========================================================
  // FETCH WORKERS FROM BACKEND
  // ==========================================================

  useEffect(() => {

    /*
     * We need coordinates when doing
     * "near me" search.
     */

    if (
      locationSearch &&
      !location
    ) {
      return
    }


    /*
     * Debounce normal skill searching.
     *
     * This prevents a request for
     * every individual keystroke.
     */

    const timeout =
      setTimeout(async () => {

        try {

          setWorkersError('')


          if (locationSearch) {

            setLocationSearchLoading(true)

          } else {

            setWorkersLoading(true)

          }


          const params =
            new URLSearchParams()


          // ======================================
          // NORMAL SKILL SEARCH
          // ======================================

          if (
            searchName.trim()
          ) {

            params.set(
              'skill',
              searchName.trim()
            )

          }


          // ======================================
          // NORMAL LOCATION FILTERS
          // ======================================

          if (
            !locationSearch &&
            selectedState
          ) {

            params.set(
              'state',
              selectedState
            )

          }

          if (
            !locationSearch &&
            selectedCity
          ) {

            params.set(
              'city',
              selectedCity
            )

          }

          if (
            !locationSearch &&
            selectedLGA
          ) {

            params.set(
              'localGovernment',
              selectedLGA
            )

          }


          // ======================================
          // NEARBY SEARCH
          // ======================================

          if (
            locationSearch &&
            location
          ) {

            params.set(
              'latitude',
              String(location.latitude)
            )

            params.set(
              'longitude',
              String(location.longitude)
            )

            params.set(
              'radius',
              String(selectedRadius)
            )

            /*
             * For nearby search use the
             * saved skill rather than
             * the normal search input.
             */

            if (
              locationSearchSkill.trim()
            ) {

              params.set(
                'skill',
                locationSearchSkill.trim()
              )

            }

          }


          // ======================================
          // PAGINATION
          // ======================================

          params.set(
            'page',
            String(currentPage)
          )

          params.set(
            'limit',
            String(workersPerPage)
          )


          // ======================================
          // API REQUEST
          // ======================================

          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL


          if (!apiUrl) {

            throw new Error(
              'NEXT_PUBLIC_API_URL is not configured'
            )

          }


          const response =
            await fetch(
              `${apiUrl}/users/workers/all?${params.toString()}`,
              {
                method: 'GET',
                cache: 'no-store',
              }
            )


          const data =
            await response.json()


          if (!response.ok) {

            throw new Error(
              data.message ||
              'Failed to fetch workers'
            )

          }


          // ======================================
          // SAVE RESULTS
          // ======================================

          setFilteredWorkers(
            data.workers || []
          )

          setTotalWorkers(
            Number(data.total) || 0
          )

          setTotalPages(
            Number(data.totalPages) || 1
          )

        } catch (error) {

          console.error(
            'Worker fetch error:',
            error
          )

          setFilteredWorkers([])

          setTotalWorkers(0)

          setTotalPages(1)

          setWorkersError(
            error.message ||
            'Unable to load artisans'
          )

        } finally {

          setWorkersLoading(false)

          setLocationSearchLoading(false)

        }

      }, 400)


    return () =>
      clearTimeout(timeout)

  }, [
    searchName,
    selectedState,
    selectedCity,
    selectedLGA,
    currentPage,
    locationSearch,
    location,
    locationSearchSkill,
    selectedRadius,
  ])


  // ==========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================================

  useEffect(() => {

    setCurrentPage(1)

  }, [
    searchName,
    selectedState,
    selectedCity,
    selectedLGA,
    locationSearch,
    locationSearchSkill,
    selectedRadius,
  ])


  // ==========================================================
  // USE MY LOCATION
  // ==========================================================

  const handleUseLocation = () => {

    /*
     * Save whatever skill the user
     * currently typed.
     */

    setLocationSearchSkill(
      searchName.trim()
    )


    /*
     * Clear normal location filters.
     */

    setSelectedState('')

    setSelectedCity('')

    setSelectedLGA('')


    /*
     * Turn on nearby search.
     */

    setLocationSearch(true)

    setCurrentPage(1)


    /*
     * Ask browser for location.
     */

    getLocation()

  }


  // ==========================================================
  // CLEAR NORMAL FILTERS
  // ==========================================================

  const clearNormalFilters = () => {

    setSearchName('')

    setSelectedState('')

    setSelectedCity('')

    setSelectedLGA('')

    setCurrentPage(1)

  }


  // ==========================================================
  // CLEAR LOCATION SEARCH
  // ==========================================================

  const clearLocationSearch = () => {

    setLocationSearch(false)

    setLocationSearchSkill('')

    setCurrentPage(1)

  }


  // ==========================================================
  // CLEAR EVERYTHING
  // ==========================================================

  const clearAllFilters = () => {

    setSearchName('')

    setSelectedState('')

    setSelectedCity('')

    setSelectedLGA('')

    setLocationSearch(false)

    setLocationSearchSkill('')

    setCurrentPage(1)

  }


  // ==========================================================
  // PAGE CHANGE
  // ==========================================================

  const goToPage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return
    }

    setCurrentPage(page)

    /*
     * Scroll back to results.
     */

    setTimeout(() => {

      document
        .getElementById(
          'worker-results'
        )
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })

    }, 50)

  }


  // ==========================================================
  // WORKERS TO DISPLAY
  // ==========================================================

  const workersToDisplay =
    filteredWorkers


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  const isLoading =
    workersLoading ||
    locationSearchLoading ||
    (
      locationSearch &&
      locationLoading
    )


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="min-h-screen bg-gray-950 text-white">


      {/* =====================================================
          HERO + SEARCH
      ====================================================== */}

      <main
        className="relative min-h-screen flex items-center justify-center px-5 md:px-10 overflow-hidden"
        style={{
          backgroundImage:
            "url('/images/download.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <div className="absolute inset-0 bg-black/80" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-950" />


        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="relative z-10 text-center max-w-6xl w-full pt-24 pb-20"
        >


          {/* BADGE */}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-semibold mb-6">

            <FaCheckCircle />

            Nigeria's trusted artisan marketplace

          </div>


          {/* TITLE */}

          <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6">

            Find the Right

            <span className="text-orange-500">
              {' '}Artisan
            </span>

            <br />

            Without the Guesswork.

          </h1>


          {/* DESCRIPTION */}

          <p className="text-gray-300 text-base md:text-xl max-w-3xl mx-auto leading-8 mb-10">

            Find verified electricians, plumbers,
            mechanics, cleaners, carpenters and
            other skilled professionals — wherever
            you are in Nigeria.

          </p>


          {/* =================================================
              SEARCH PANEL
          ================================================== */}

          <div className="bg-white/10 backdrop-blur-2xl p-4 md:p-6 rounded-3xl border border-white/10 shadow-2xl max-w-5xl mx-auto">


            <div className="text-left mb-4">

              <p className="text-white font-semibold">
                Find an artisan
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Search an area or let us find artisans
                around you.
              </p>

            </div>


            {/* FILTERS */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


              {/* SEARCH */}

              <div className="flex items-center bg-white rounded-xl px-3">

                <FaSearch className="text-gray-500" />

                <input
                  type="text"
                  placeholder="Search by profession"
                  value={searchName}
                  onChange={(e) => {

                    setSearchName(
                      e.target.value
                    )

                    if (
                      locationSearch
                    ) {

                      clearLocationSearch()

                    }

                  }}
                  className="w-full p-3 outline-none text-black bg-transparent"
                />

              </div>


              {/* STATE */}

              <select
                value={selectedState}
                onChange={(e) => {

                  setSelectedState(
                    e.target.value
                  )

                  setSelectedCity('')

                  setSelectedLGA('')

                  if (
                    locationSearch
                  ) {

                    clearLocationSearch()

                  }

                }}
                className="w-full p-3 rounded-xl bg-white text-black"
              >

                <option value="">
                  Select State
                </option>

                {nigeriaStates.map(
                  (state) => (

                    <option
                      key={state.isoCode}
                      value={state.name}
                    >
                      {state.name}
                    </option>

                  )
                )}

              </select>


              {/* CITY */}

              <select
                value={selectedCity}
                onChange={(e) => {

                  setSelectedCity(
                    e.target.value
                  )

                  if (
                    locationSearch
                  ) {

                    clearLocationSearch()

                  }

                }}
                disabled={!selectedState}
                className="w-full p-3 rounded-xl bg-white text-black disabled:bg-gray-300"
              >

                <option value="">
                  {selectedState
                    ? 'Select City'
                    : 'Select state first'}
                </option>

                {cities.map(
                  (city, index) => (

                    <option
                      key={index}
                      value={city.name}
                    >
                      {city.name}
                    </option>

                  )
                )}

              </select>


              {/* LGA */}

              <select
                value={selectedLGA}
                onChange={(e) => {

                  setSelectedLGA(
                    e.target.value
                  )

                  if (
                    locationSearch
                  ) {

                    clearLocationSearch()

                  }

                }}
                disabled={!selectedState}
                className="w-full p-3 rounded-xl bg-white text-black disabled:bg-gray-300"
              >

                <option value="">
                  {selectedState
                    ? 'Local Government Area'
                    : 'Select state first'}
                </option>

                {localGovernments.map(
                  (lga, index) => (

                    <option
                      key={index}
                      value={lga}
                    >
                      {lga}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* LOCATION */}

            <div className="mt-4">

              <button
                type="button"
                onClick={
                  handleUseLocation
                }
                disabled={
                  locationLoading ||
                  locationSearchLoading
                }
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition"
              >

                {locationLoading ||
                locationSearchLoading ? (

                  <>

                    <span className="animate-spin">
                      <FaCompass />
                    </span>

                    Finding artisans near you...

                  </>

                ) : (

                  <>

                    <FaMapMarkerAlt />

                    Find artisans near me

                  </>

                )}

              </button>


              {/* LOCATION ERROR */}

              {locationError && (

                <p className="text-red-400 text-sm text-center mt-2">
                  {locationError}
                </p>

              )}


              {/* DISTANCE */}

              {locationSearch && (

                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                  }}
                  className="mt-5 pt-5 border-t border-white/10"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div className="text-left">

                      <p className="text-sm font-semibold text-white">
                        How far should we search?
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Choose a distance from your current location.
                      </p>

                    </div>


                    <div className="grid grid-cols-4 gap-2">

                      {distanceOptions.map(
                        (distance) => (

                          <button
                            key={distance}
                            type="button"
                            onClick={() =>
                              setSelectedRadius(
                                distance
                              )
                            }
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                              selectedRadius ===
                              distance
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                          >

                            {distance} km

                          </button>

                        )
                      )}

                    </div>

                  </div>

                </motion.div>

              )}

            </div>

          </div>


          {/* TRUST */}

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8 text-gray-400 text-sm">

            <span className="flex items-center gap-2">

              <FaCheckCircle className="text-green-500" />

              Verified professionals

            </span>


            <span className="flex items-center gap-2">

              <FaMapMarkerAlt className="text-orange-500" />

              Search anywhere in Nigeria

            </span>


            <span className="flex items-center gap-2">

              <FaUserCheck className="text-blue-400" />

              Ratings & reviews

            </span>

          </div>

        </motion.div>

      </main>


      {/* =====================================================
          LIVE WORKER RESULTS
      ====================================================== */}

      <section
        id="worker-results"
        className="py-16 px-5 md:px-10 bg-gray-950"
      >

        <div className="max-w-7xl mx-auto">


          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

            <div>

              <div className="flex items-center gap-3">

                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />

                <span className="text-green-400 text-sm font-semibold">
                  LIVE RESULTS
                </span>

              </div>


              <h2 className="text-3xl md:text-4xl font-extrabold mt-3">

                {locationSearch
                  ? 'Artisans Near You'
                  : hasNormalFilters
                  ? 'Artisans Matching Your Search'
                  : 'Trusted Artisans Across Nigeria'}

              </h2>


              <p className="text-gray-400 mt-2">

                {locationSearch
                  ? `Professionals within ${selectedRadius} km of your location`
                  : hasNormalFilters
                  ? 'Results update automatically as you refine your search.'
                  : 'Start searching above to find the right professional.'}

              </p>

            </div>


            <div className="flex items-center gap-3">

              <div className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800">

                <span className="text-orange-500 font-bold">
                  {totalWorkers}
                </span>

                <span className="text-gray-400 text-sm ml-1">

                  {totalWorkers === 1
                    ? 'artisan'
                    : 'artisans'}{' '}
                  found

                </span>

              </div>


              {activeFilterCount > 0 && (

                <button
                  type="button"
                  onClick={
                    clearAllFilters
                  }
                  className="flex items-center gap-2 text-sm bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2 rounded-xl transition"
                >

                  <FaUndo />

                  Clear

                </button>

              )}

            </div>

          </div>


          {/* ACTIVE FILTERS */}

          {activeFilterCount > 0 && (

            <div className="flex flex-wrap items-center gap-2 mb-8">

              <span className="text-gray-500 text-sm">
                Filtering by:
              </span>


              {searchName.trim() && (

                <button
                  type="button"
                  onClick={() =>
                    setSearchName('')
                  }
                  className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full text-sm"
                >

                  {searchName}

                  <FaTimes className="text-xs" />

                </button>

              )}


              {selectedState && (

                <button
                  type="button"
                  onClick={() => {

                    setSelectedState('')

                    setSelectedCity('')

                    setSelectedLGA('')

                  }}
                  className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full text-sm"
                >

                  {selectedState}

                  <FaTimes className="text-xs" />

                </button>

              )}


              {selectedCity && (

                <button
                  type="button"
                  onClick={() =>
                    setSelectedCity('')
                  }
                  className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full text-sm"
                >

                  {selectedCity}

                  <FaTimes className="text-xs" />

                </button>

              )}


              {selectedLGA && (

                <button
                  type="button"
                  onClick={() =>
                    setSelectedLGA('')
                  }
                  className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full text-sm"
                >

                  {selectedLGA}

                  <FaTimes className="text-xs" />

                </button>

              )}


              {locationSearch && (

                <button
                  type="button"
                  onClick={
                    clearLocationSearch
                  }
                  className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-sm"
                >

                  <FaMapMarkerAlt />

                  Near me · {selectedRadius} km

                  {locationSearchSkill &&
                    ` · ${locationSearchSkill}`}

                  <FaTimes className="text-xs" />

                </button>

              )}

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================== */}

          {workersError && (

            <div className="mb-8 text-center py-5 bg-red-500/10 border border-red-500/20 rounded-2xl">

              <p className="text-red-400">
                {workersError}
              </p>

            </div>

          )}


          {/* =================================================
              LOADING
          ================================================== */}

          {isLoading ? (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (

                  <div
                    key={item}
                    className="h-80 rounded-2xl bg-gray-900 border border-gray-800 animate-pulse"
                  />

                )
              )}

            </div>

          ) : workersToDisplay.length > 0 ? (

            <>
              <motion.div
                layout
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >

                <AnimatePresence mode="popLayout">

                  {workersToDisplay.map(
                    (worker) => (

                      <motion.div
                        layout
                        key={worker._id}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.95,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >

                        <WorkerCard
                          worker={worker}
                        />

                      </motion.div>

                    )
                  )}

                </AnimatePresence>

              </motion.div>


              {/* =================================================
                  PAGINATION
              ================================================== */}

              {totalPages > 1 && (

                <div className="flex flex-wrap justify-center items-center gap-2 mt-10">

                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                  >
                    Previous
                  </button>


                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (

                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        goToPage(page)
                      }
                      className={`min-w-10 px-3 py-2 rounded-xl font-semibold transition ${
                        currentPage === page
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
                      }`}
                    >

                      {page}

                    </button>

                  ))}


                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                  >
                    Next
                  </button>

                </div>

              )}

            </>

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================== */

            <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-3xl">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-800 flex items-center justify-center text-gray-600 text-2xl mb-5">

                <FaSearch />

              </div>


              <h3 className="text-xl font-bold">
                No artisans found
              </h3>


              <p className="text-gray-500 mt-2 max-w-lg mx-auto">

                {locationSearch
                  ? `We couldn't find any professionals within ${selectedRadius} km. Try expanding your search distance.`
                  : "We couldn't find workers matching your current search. Try another skill or location."}

              </p>


              {locationSearch && (

                <div className="flex flex-wrap justify-center gap-2 mt-5">

                  {distanceOptions
                    .filter(
                      (distance) =>
                        distance >
                        selectedRadius
                    )
                    .map(
                      (distance) => (

                        <button
                          key={distance}
                          type="button"
                          onClick={() =>
                            setSelectedRadius(
                              distance
                            )
                          }
                          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
                        >

                          Try {distance} km

                        </button>

                      )
                    )}

                </div>

              )}


              <button
                type="button"
                onClick={
                  clearAllFilters
                }
                className="mt-6 bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-xl font-semibold transition"
              >

                Show all artisans

              </button>

            </div>

          )}


          {/* BROWSE ALL */}

          {!hasNormalFilters &&
            !locationSearch &&
            totalWorkers > 12 && (

              <div className="text-center mt-8">

                <Link
                  href="/workers"
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-semibold"
                >

                  Browse all artisans

                  <FaArrowRight />

                </Link>

              </div>

            )}

        </div>

      </section>


      {/* =====================================================
          TWO WAYS TO FIND AN ARTISAN
      ====================================================== */}

      <section className="py-24 px-5 md:px-10 bg-gray-950">

        <div className="max-w-6xl mx-auto">


          <div className="text-center max-w-3xl mx-auto mb-14">

            <span className="text-orange-500 font-semibold uppercase tracking-widest text-sm">
              Find your way
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold mt-3">

              Two simple ways to find

              <span className="text-orange-500">
                {' '}the right person.
              </span>

            </h2>

            <p className="text-gray-400 mt-5 text-lg leading-8">

              Whether you know exactly where you
              need help or simply want to know who
              is closest to you, FindArtisans makes
              the search simple.

            </p>

          </div>


          <div className="grid md:grid-cols-2 gap-6">


            {/* AREA SEARCH */}

            <motion.div
              whileHover={{
                y: -6,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative overflow-hidden bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-10"
            >

              <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full" />


              <div className="relative">

                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-2xl mb-6">

                  <FaSearch />

                </div>


                <span className="text-orange-500 font-bold text-sm">
                  OPTION 01
                </span>


                <h3 className="text-2xl font-bold mt-3">
                  Search by area
                </h3>


                <p className="text-gray-400 mt-3 leading-7">

                  Know where you need a service?
                  Select the state, city and local
                  government area where you want to
                  find an artisan.

                </p>


                <div className="flex flex-wrap gap-2 mt-6">

                  {[
                    'State',
                    'City',
                    'LGA',
                  ].map(
                    (item, index) => (

                      <React.Fragment
                        key={item}
                      >

                        <span className="px-3 py-2 bg-gray-800 rounded-lg text-sm text-gray-300">

                          {item}

                        </span>


                        {index < 2 && (

                          <FaChevronRight className="text-gray-600 self-center text-xs" />

                        )}

                      </React.Fragment>

                    )
                  )}

                </div>


                <div className="mt-7 flex items-center gap-2 text-sm text-orange-400 font-semibold">

                  <FaCheckCircle />

                  Great when you know the area

                </div>

              </div>

            </motion.div>


            {/* NEARBY SEARCH */}

            <motion.div
              whileHover={{
                y: -6,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-900 border border-orange-500/20 rounded-3xl p-8 md:p-10"
            >

              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full" />


              <div className="relative">

                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-6">

                  <FaLocationArrow />

                </div>


                <span className="text-blue-400 font-bold text-sm">
                  OPTION 02
                </span>


                <h3 className="text-2xl font-bold mt-3">
                  Find artisans near you
                </h3>


                <p className="text-gray-400 mt-3 leading-7">

                  Don't know the area? Let your location
                  do the work. Choose how far you want
                  us to search and discover artisans
                  around you.

                </p>


                <div className="flex flex-wrap gap-2 mt-6">

                  {distanceOptions.map(
                    (distance) => (

                      <span
                        key={distance}
                        className="px-3 py-2 bg-gray-800 rounded-lg text-sm text-gray-300"
                      >

                        {distance} km

                      </span>

                    )
                  )}

                </div>


                <div className="mt-7 flex items-center gap-2 text-sm text-blue-400 font-semibold">

                  <FaCheckCircle />

                  Great when you need someone close

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="py-24 px-5 md:px-10 bg-gray-900/50">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <span className="text-orange-500 font-semibold uppercase tracking-widest text-sm">
              Simple from start to finish
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold mt-3">
              Find. Verify. Connect.
            </h2>

            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">

              We make it easier to discover the right
              professional without wasting time asking
              around.

            </p>

          </div>


          <div className="grid md:grid-cols-4 gap-6">

            {[
              {
                number: '01',
                icon: <FaSearch />,
                title: 'Find',
                description:
                  'Search by your area or use your location to discover nearby artisans.',
              },
              {
                number: '02',
                icon: <FaCheckCircle />,
                title: 'Verify',
                description:
                  'Look for verified profiles and learn more about the artisan before contacting them.',
              },
              {
                number: '03',
                icon: <FaStar />,
                title: 'Compare',
                description:
                  'Compare experience, skills, ratings and reviews to make a confident choice.',
              },
              {
                number: '04',
                icon: <FaWhatsapp />,
                title: 'Connect',
                description:
                  'Contact your preferred artisan directly and discuss the job.',
              },
            ].map(
              (step, index) => (

                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      index * 0.1,
                  }}
                  className="relative bg-gray-900 border border-gray-800 rounded-2xl p-7"
                >

                  <div className="flex items-center justify-between mb-6">

                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xl">

                      {step.icon}

                    </div>


                    <span className="text-gray-700 font-black text-4xl">
                      {step.number}
                    </span>

                  </div>


                  <h3 className="text-xl font-bold">
                    {step.title}
                  </h3>


                  <p className="text-gray-400 mt-3 leading-7 text-sm">
                    {step.description}
                  </p>

                </motion.div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY FINDARTISANS
      ====================================================== */}

      <section className="py-24 px-5 md:px-10 bg-gray-950">

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <span className="text-orange-500 font-semibold uppercase tracking-widest text-sm">
              Why FindArtisans?
            </span>


            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight">

              Stop searching blindly.

              <br />

              <span className="text-orange-500">
                Start choosing confidently.
              </span>

            </h2>


            <p className="text-gray-400 mt-6 leading-8 text-lg">

              Finding a skilled professional shouldn't
              depend on asking five different people for
              recommendations. FindArtisans puts useful
              information in one place so you can make
              a better decision.

            </p>


            <Link
              href="/workers"
              className="inline-flex items-center gap-3 mt-8 bg-orange-500 hover:bg-orange-600 px-6 py-3.5 rounded-xl font-bold transition"
            >

              Browse all artisans

              <FaArrowRight />

            </Link>

          </div>


          <div className="grid sm:grid-cols-2 gap-4">

            {[
              {
                icon: <FaShieldAlt />,
                title: 'Verified Professionals',
                text:
                  'Find artisans whose profiles have gone through our verification process.',
              },
              {
                icon: <FaMapMarkerAlt />,
                title: 'Location-Based Search',
                text:
                  'Search by area or discover professionals close to your current location.',
              },
              {
                icon: <FaStar />,
                title: 'Ratings & Reviews',
                text:
                  'See what other customers have to say before making your choice.',
              },
              {
                icon: <FaPhoneAlt />,
                title: 'Direct Contact',
                text:
                  'Connect directly with artisans instead of going through unnecessary middlemen.',
              },
            ].map(
              (item) => (

                <motion.div
                  key={item.title}
                  whileHover={{
                    y: -4,
                  }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                >

                  <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-lg mb-5">

                    {item.icon}

                  </div>


                  <h3 className="font-bold text-lg">
                    {item.title}
                  </h3>


                  <p className="text-gray-400 text-sm mt-2 leading-6">
                    {item.text}
                  </p>

                </motion.div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          POPULAR CATEGORIES
      ====================================================== */}

      <section className="py-24 px-5 md:px-10 bg-gray-900/50">

        <div className="max-w-7xl mx-auto">


          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">

            <div>

              <span className="text-orange-500 font-semibold uppercase tracking-widest text-sm">
                Explore services
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
                What kind of artisan do you need?
              </h2>

            </div>


            <Link
              href="/workers"
              className="text-orange-500 hover:text-orange-400 font-semibold flex items-center gap-2"
            >

              View all workers

              <FaArrowRight />

            </Link>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

            {categories.map(
              (category) => (

                <Link
                  key={category.title}
                  href={`/workers?skill=${encodeURIComponent(
                    category.title.replace(/s$/, '')
                  )}`}
                  className="group bg-gray-900 border border-gray-800 hover:border-orange-500/40 rounded-2xl p-5 transition"
                >

                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 group-hover:bg-orange-500 text-orange-500 group-hover:text-white flex items-center justify-center text-xl transition">

                    {category.icon}

                  </div>


                  <h3 className="font-bold mt-5">
                    {category.title}
                  </h3>


                  <p className="text-gray-500 text-xs leading-5 mt-2">
                    {category.description}
                  </p>

                </Link>

              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIALS
      ====================================================== */}

      <section className="py-24 px-5 md:px-10 bg-gray-900/50">

        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-12">

            <span className="text-orange-500 font-semibold uppercase tracking-widest text-sm">
              Real experiences
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold mt-3">
              People are finding their people.
            </h2>

            <p className="text-gray-400 mt-3">
              Hear from customers and artisans using FindArtisans.
            </p>

          </div>


          <AnimatePresence mode="wait">

            <motion.div
              key={
                testimonials[
                  currentTestimonial
                ].id
              }
              initial={{
                opacity: 0,
                x: 80,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -80,
              }}
              transition={{
                duration: 0.7,
              }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-12"
            >

              <FaQuoteLeft className="text-4xl text-orange-500 mb-6" />


              <p className="text-xl md:text-2xl text-gray-300 leading-9 italic">

                "
                {
                  testimonials[
                    currentTestimonial
                  ].message
                }
                "

              </p>


              <div className="flex mt-6">

                {[
                  ...Array(
                    testimonials[
                      currentTestimonial
                    ].rating
                  ),
                ].map(
                  (_, index) => (

                    <FaStar
                      key={index}
                      className="text-yellow-400 mr-1"
                    />

                  )
                )}

              </div>


              <div className="flex items-center mt-8">

                <Image
                  src={
                    testimonials[
                      currentTestimonial
                    ].image
                  }
                  alt={
                    testimonials[
                      currentTestimonial
                    ].name
                  }
                  width={70}
                  height={70}
                  className="rounded-full object-cover h-20 w-20"
                />


                <div className="ml-5">

                  <h3 className="font-bold text-lg">

                    {
                      testimonials[
                        currentTestimonial
                      ].name
                    }

                  </h3>


                  <p className="text-gray-400">

                    {
                      testimonials[
                        currentTestimonial
                      ].type
                    }

                    {' • '}

                    {
                      testimonials[
                        currentTestimonial
                      ].location
                    }

                  </p>

                </div>

              </div>

            </motion.div>

          </AnimatePresence>


          <div className="flex justify-center gap-2 mt-6">

            {testimonials.map(
              (testimonial, index) => (

                <button
                  key={testimonial.id}
                  type="button"
                  onClick={() =>
                    setCurrentTestimonial(
                      index
                    )
                  }
                  className={`h-2 rounded-full transition-all ${
                    index ===
                    currentTestimonial
                      ? 'w-8 bg-orange-500'
                      : 'w-2 bg-gray-700'
                  }`}
                />

              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-5 md:px-10 py-24">

        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-orange-500 p-8 md:p-16">

          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10" />

          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-black/10" />


          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">

            <div>

              <p className="text-orange-100 uppercase tracking-widest text-sm font-bold">
                Your next job starts here
              </p>


              <h2 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight">
                Need a skilled artisan?
              </h2>


              <p className="text-orange-50 mt-5 text-lg leading-8 max-w-xl">

                Find someone you can trust,
                check their profile, compare your
                options and get in touch.

              </p>

            </div>


            <div className="flex flex-col sm:flex-row md:justify-end gap-3">

              <Link
                href="/workers"
                className="inline-flex items-center justify-center gap-3 bg-white text-orange-600 hover:bg-gray-100 px-6 py-3.5 rounded-xl font-bold transition"
              >

                Browse artisans

                <FaArrowRight />

              </Link>


              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-3 bg-black/20 hover:bg-black/30 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold transition"
              >

                Join FindArtisans

                <FaUserTie />

              </Link>

            </div>

          </div>

        </div>

      </section>


    </div>

  )

}


export default Homepage