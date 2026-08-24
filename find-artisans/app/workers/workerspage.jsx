'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { State, City } from 'country-state-city'
import { lgas } from 'nigerian-states-and-lgas'
import useGeolocation from '../../hooks/useGeolocation'
import WorkerCard from '../../components/WorkerCard'

import {
  FaWhatsapp,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaFilter,
  FaSearch,
  FaTimes,
  FaUndo,
  FaCompass,
  FaUserTie,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'

const NIGERIA_STATES = State.getStatesOfCountry('NG')

const DISTANCE_OPTIONS = [
  { value: '1', label: '1 km' },
  { value: '3', label: '3 km' },
  { value: '5', label: '5 km' },
  { value: '10', label: '10 km' },
]

const WORKERS_PER_PAGE = 12

const WorkersPage = ({ workers = [] }) => {
  // =====================================================
  // GEOLOCATION
  // =====================================================

  const {
    location,
    loading: locationLoading,
    error: locationError,
    getLocation,
  } = useGeolocation()

  const [nearbyWorkers, setNearbyWorkers] = useState([])
  const [locationSearch, setLocationSearch] = useState(false)
  const [locationSearchLoading, setLocationSearchLoading] =
    useState(false)
  const [locationSearchSkill, setLocationSearchSkill] =
    useState('')

  const [selectedRadius, setSelectedRadius] = useState('5')

  // =====================================================
  // NORMAL FILTERS
  // =====================================================

  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedLGA, setSelectedLGA] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] = useState(1)

  // =====================================================
  // LOCATION DATA
  // =====================================================

  const cities = useMemo(() => {
    if (!selectedState) return []

    const state = NIGERIA_STATES.find(
      (item) => item.name === selectedState
    )

    if (!state?.isoCode) return []

    return City.getCitiesOfState('NG', state.isoCode)
  }, [selectedState])

  const localGovernments = useMemo(() => {
    if (!selectedState) return []

    return lgas(selectedState) || []
  }, [selectedState])

  // =====================================================
  // NORMAL FILTER LOGIC
  // =====================================================

  const filteredWorkers = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return workers.filter((worker) => {
      const fullName =
        worker.fullName?.toLowerCase() || ''

      const skill =
        worker.skill?.toLowerCase() || ''

      const skills =
        Array.isArray(worker.skills)
          ? worker.skills.join(' ').toLowerCase()
          : ''

      const matchSearch = searchValue
        ? fullName.includes(searchValue) ||
          skill.includes(searchValue) ||
          skills.includes(searchValue)
        : true

      const matchState = selectedState
        ? worker.location?.state === selectedState
        : true

      const matchCity = selectedCity
        ? worker.location?.city === selectedCity
        : true

      const matchLGA = selectedLGA
        ? worker.location?.localGovernment === selectedLGA
        : true

      return (
        matchSearch &&
        matchState &&
        matchCity &&
        matchLGA
      )
    })
  }, [
    workers,
    search,
    selectedState,
    selectedCity,
    selectedLGA,
  ])

  // =====================================================
  // FETCH NEARBY WORKERS
  // =====================================================

  useEffect(() => {
    if (!location || !locationSearch) return

    const fetchNearbyWorkers = async () => {
      try {
        setLocationSearchLoading(true)

        const params = new URLSearchParams()

        if (locationSearchSkill) {
          params.append(
            'skill',
            locationSearchSkill
          )
        }

        params.append(
          'latitude',
          location.latitude
        )

        params.append(
          'longitude',
          location.longitude
        )

        params.append(
          'radius',
          selectedRadius
        )

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL

        const response = await fetch(
          `${apiUrl}/users/workers/all?${params.toString()}`,
          {
            cache: 'no-store',
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to find nearby workers'
          )
        }

        setNearbyWorkers(data.workers || [])
      } catch (error) {
        console.error(
          'Nearby workers error:',
          error
        )

        setNearbyWorkers([])
      } finally {
        setLocationSearchLoading(false)
      }
    }

    fetchNearbyWorkers()
  }, [
    location,
    locationSearch,
    locationSearchSkill,
    selectedRadius,
  ])

  // =====================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // =====================================================

  useEffect(() => {
    setPage(1)
  }, [
    search,
    selectedState,
    selectedCity,
    selectedLGA,
    selectedRadius,
    locationSearch,
  ])

  // =====================================================
  // DETERMINE CURRENT WORKER LIST
  // =====================================================

  const workersToDisplay = locationSearch
    ? nearbyWorkers
    : filteredWorkers

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      workersToDisplay.length /
        WORKERS_PER_PAGE
    )
  )

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedWorkers =
    workersToDisplay.slice(
      (page - 1) * WORKERS_PER_PAGE,
      page * WORKERS_PER_PAGE
    )

  // =====================================================
  // SCROLL TO RESULTS WHEN PAGE CHANGES
  // =====================================================

  useEffect(() => {
    if (page === 1) return

    const resultsSection =
      document.getElementById(
        'workers-results'
      )

    if (resultsSection) {
      resultsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [page])

  // =====================================================
  // ACTIVE FILTER COUNT
  // =====================================================

  const activeFilterCount =
    Number(Boolean(search.trim())) +
    Number(Boolean(selectedState)) +
    Number(Boolean(selectedCity)) +
    Number(Boolean(selectedLGA)) +
    Number(locationSearch)

  // =====================================================
  // LOCATION SEARCH
  // =====================================================

  const handleUseLocation = () => {
    const currentSearch = search.trim()

    setLocationSearchSkill(
      currentSearch
    )

    setLocationSearch(true)

    setSelectedState('')
    setSelectedCity('')
    setSelectedLGA('')

    getLocation()
  }

  // =====================================================
  // RADIUS CHANGE
  // =====================================================

  const handleRadiusChange = (radius) => {
    setSelectedRadius(radius)
  }

  // =====================================================
  // CLEAR LOCATION SEARCH
  // =====================================================

  const clearLocationSearch = () => {
    setLocationSearch(false)
    setNearbyWorkers([])
    setLocationSearchSkill('')
  }

  // =====================================================
  // EXIT LOCATION SEARCH WHEN NORMAL FILTER CHANGES
  // =====================================================

  const exitLocationSearch = () => {
    if (locationSearch) {
      clearLocationSearch()
    }
  }

  // =====================================================
  // CLEAR ALL FILTERS
  // =====================================================

  const clearAllFilters = () => {
    setSearch('')
    setSelectedState('')
    setSelectedCity('')
    setSelectedLGA('')

    clearLocationSearch()

    setPage(1)
  }

  // =====================================================
  // SEARCH BY AREA
  // =====================================================

  const handleSearchByArea = () => {
    clearLocationSearch()

    setShowFilters(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // =====================================================
  // NO NEARBY WORKERS
  // =====================================================

  const noNearbyWorkers =
    locationSearch &&
    !locationSearchLoading &&
    Boolean(location) &&
    nearbyWorkers.length === 0

  // =====================================================
  // PAGINATION NUMBERS
  // =====================================================

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return []

    const pages = []

    if (totalPages <= 5) {
      for (
        let index = 1;
        index <= totalPages;
        index += 1
      ) {
        pages.push(index)
      }

      return pages
    }

    pages.push(1)

    if (page > 3) {
      pages.push('...')
    }

    const start = Math.max(2, page - 1)
    const end = Math.min(
      totalPages - 1,
      page + 1
    )

    for (
      let index = start;
      index <= end;
      index += 1
    ) {
      pages.push(index)
    }

    if (page < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)

    return pages
  }, [page, totalPages])

  // =====================================================
  // WHATSAPP NUMBER
  // =====================================================

  const getWhatsAppNumber = (phone) => {
    if (!phone) return null

    const cleaned = phone.replace(
      /\D/g,
      ''
    )

    if (!cleaned) return null

    return cleaned.replace(
      /^0/,
      '234'
    )
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* =====================================================
          PAGE HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-gray-900">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/5" />

        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10 pt-12 md:pt-16 pb-10">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold">
              <FaCheckCircle />
              Nigeria's trusted artisan marketplace
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-5">
              Find a trusted{' '}
              <span className="text-orange-500">
                artisan
              </span>{' '}
              near you.
            </h1>

            <p className="text-gray-400 text-base md:text-lg leading-7 mt-4 max-w-2xl">
              Search verified electricians,
              plumbers, mechanics, cleaners,
              carpenters and other skilled
              professionals across Nigeria.
            </p>

          </div>

          {/* =====================================================
              SEARCH BAR
          ====================================================== */}

          <div className="mt-8 max-w-5xl">

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 md:p-4 shadow-2xl">

              <div className="flex flex-col lg:flex-row gap-3">

                {/* SEARCH */}

                <div className="relative flex-1">

                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(
                        event.target.value
                      )
                      exitLocationSearch()
                    }}
                    placeholder="Search by name, skill or service..."
                    className="w-full h-12 pl-11 pr-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder:text-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch('')
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  )}

                </div>

                {/* FILTER BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(
                      (previous) =>
                        !previous
                    )
                  }
                  className={`h-12 px-5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition ${
                    showFilters
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-gray-900 border-gray-800 text-gray-200 hover:border-gray-700'
                  }`}
                >
                  <FaFilter />

                  {showFilters
                    ? 'Hide Filters'
                    : 'Filters'}

                  {activeFilterCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-white text-orange-500 text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}

                </button>

                {/* LOCATION */}

                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={
                    locationLoading ||
                    locationSearchLoading
                  }
                  className="h-12 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center gap-2 transition"
                >
                  {locationLoading ||
                  locationSearchLoading ? (
                    <>
                      <span className="animate-spin">
                        <FaCompass />
                      </span>

                      Finding...
                    </>
                  ) : (
                    <>
                      <FaMapMarkerAlt />
                      <span className="hidden sm:inline">
                        Near me
                      </span>
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FILTER PANEL
      ====================================================== */}

      {showFilters && (
        <section className="max-w-7xl mx-auto px-5 md:px-10 pt-6">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 md:p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

              <div>

                <h2 className="font-bold text-lg">
                  Search by location
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Narrow your search to a
                  specific area.
                </p>

              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition"
                >
                  <FaUndo />
                  Clear all
                </button>
              )}

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* STATE */}

              <div>

                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  State
                </label>

                <select
                  value={selectedState}
                  onChange={(event) => {
                    setSelectedState(
                      event.target.value
                    )
                    setSelectedCity('')
                    setSelectedLGA('')
                    exitLocationSearch()
                  }}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition"
                >
                  <option value="">
                    All states
                  </option>

                  {NIGERIA_STATES.map(
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

              </div>

              {/* CITY */}

              <div>

                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  City
                </label>

                <select
                  value={selectedCity}
                  onChange={(event) => {
                    setSelectedCity(
                      event.target.value
                    )
                    exitLocationSearch()
                  }}
                  disabled={!selectedState}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="">
                    All cities
                  </option>

                  {cities.map(
                    (city, index) => (
                      <option
                        key={`${city.name}-${index}`}
                        value={city.name}
                      >
                        {city.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* LGA */}

              <div>

                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Local Government Area
                </label>

                <select
                  value={selectedLGA}
                  onChange={(event) => {
                    setSelectedLGA(
                      event.target.value
                    )
                    exitLocationSearch()
                  }}
                  disabled={!selectedState}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="">
                    All LGAs
                  </option>

                  {localGovernments.map(
                    (lga, index) => (
                      <option
                        key={`${lga}-${index}`}
                        value={lga}
                      >
                        {lga}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {locationError && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {locationError}
              </div>
            )}

          </div>

        </section>
      )}

      {/* =====================================================
          LOCATION SEARCH STATUS
      ====================================================== */}

      {locationSearch && (
        <section className="max-w-7xl mx-auto px-5 md:px-10 pt-6">

          <div className="relative overflow-hidden bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">

            <div className="absolute right-0 top-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>

                <div className="flex items-center gap-2 text-blue-400 font-semibold">

                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />

                  Searching near your location

                </div>

                <p className="text-gray-400 text-sm mt-2">

                  {locationSearchSkill
                    ? `Showing artisans matching "${locationSearchSkill}"`
                    : 'Showing artisans near your current location'}

                </p>

              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                <div className="flex flex-wrap gap-2">

                  {DISTANCE_OPTIONS.map(
                    (option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handleRadiusChange(
                            option.value
                          )
                        }
                        className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                          selectedRadius ===
                          option.value
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  )}

                </div>

                <button
                  type="button"
                  onClick={
                    clearLocationSearch
                  }
                  className="px-3.5 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 text-sm flex items-center justify-center gap-2 transition"
                >
                  <FaTimes />
                  Stop
                </button>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          RESULTS
      ====================================================== */}

      <section
        id="workers-results"
        className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-14"
      >

        {/* RESULT HEADER */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />

              <span className="text-green-400 text-xs font-bold tracking-wider">
                {locationSearch
                  ? 'NEARBY RESULTS'
                  : 'ARTISAN DIRECTORY'}
              </span>

            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold">

              {locationSearch
                ? 'Artisans Near You'
                : activeFilterCount > 0
                ? 'Matching Artisans'
                : 'Verified Workers'}

            </h2>

            <p className="text-gray-500 mt-1 text-sm md:text-base">

              {locationSearch
                ? locationSearchLoading
                  ? 'Searching for artisans...'
                  : `Professionals within ${selectedRadius} km of your location`
                : activeFilterCount > 0
                ? 'Results matching your current search'
                : 'Discover skilled professionals across Nigeria'}

            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800">

              <span className="text-orange-500 font-bold text-lg">
                {workersToDisplay.length}
              </span>

              <span className="text-gray-500 text-sm ml-1">
                {workersToDisplay.length === 1
                  ? 'artisan'
                  : 'artisans'}
              </span>

            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 text-sm transition"
              >
                <FaUndo />
                Clear
              </button>
            )}

          </div>

        </div>

        {/* =====================================================
            ACTIVE FILTERS
        ====================================================== */}

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-7">

            <span className="text-gray-600 text-sm">
              Filtering by:
            </span>

            {search.trim() && (
              <button
                type="button"
                onClick={() =>
                  setSearch('')
                }
                className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full text-xs md:text-sm hover:bg-orange-500/20 transition"
              >
                <FaSearch />
                {search}
                <FaTimes />
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
                className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full text-xs md:text-sm hover:bg-orange-500/20 transition"
              >
                {selectedState}
                <FaTimes />
              </button>
            )}

            {selectedCity && (
              <button
                type="button"
                onClick={() =>
                  setSelectedCity('')
                }
                className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full text-xs md:text-sm hover:bg-orange-500/20 transition"
              >
                {selectedCity}
                <FaTimes />
              </button>
            )}

            {selectedLGA && (
              <button
                type="button"
                onClick={() =>
                  setSelectedLGA('')
                }
                className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full text-xs md:text-sm hover:bg-orange-500/20 transition"
              >
                {selectedLGA}
                <FaTimes />
              </button>
            )}

            {locationSearch && (
              <button
                type="button"
                onClick={
                  clearLocationSearch
                }
                className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs md:text-sm hover:bg-blue-500/20 transition"
              >
                <FaMapMarkerAlt />
                Near me · {selectedRadius} km
                <FaTimes />
              </button>
            )}

          </div>
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {locationSearchLoading ? (

          <div className="py-20 text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">

              <span className="animate-spin text-orange-500 text-xl">
                <FaCompass />
              </span>

            </div>

            <h3 className="font-semibold text-lg">
              Finding artisans near you
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Searching within{' '}
              {selectedRadius} km...
            </p>

          </div>

        ) : noNearbyWorkers ? (

          /* =====================================================
              NO NEARBY RESULTS
          ====================================================== */

          <div className="text-center py-16 md:py-20 bg-gray-900 border border-gray-800 rounded-3xl">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl mb-5">
              <FaMapMarkerAlt />
            </div>

            <h3 className="text-xl md:text-2xl font-bold">
              No artisans found nearby
            </h3>

            <p className="text-gray-500 mt-3 max-w-lg mx-auto px-5">
              We couldn't find any artisans
              {locationSearchSkill
                ? ` matching "${locationSearchSkill}"`
                : ''}{' '}
              within {selectedRadius} km of
              your current location.
            </p>

            <div className="mt-7">

              <p className="text-gray-500 text-sm mb-3">
                Try a wider search
              </p>

              <div className="flex flex-wrap justify-center gap-2 px-5">

                {DISTANCE_OPTIONS
                  .filter(
                    (option) =>
                      Number(option.value) >
                      Number(selectedRadius)
                  )
                  .map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleRadiusChange(
                          option.value
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-sm font-semibold transition"
                    >
                      Search {option.label}
                    </button>
                  ))}

              </div>

            </div>

            <div className="mt-8 pt-7 border-t border-gray-800">

              <p className="text-gray-600 text-sm mb-4">
                Or search a specific location
              </p>

              <button
                type="button"
                onClick={
                  handleSearchByArea
                }
                className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm font-semibold transition"
              >
                Search by State, City or LGA
              </button>

            </div>

          </div>

        ) : paginatedWorkers.length > 0 ? (

          /* =====================================================
              WORKER GRID
          ====================================================== */

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

            {paginatedWorkers.map((worker) => (
  <WorkerCard
    key={worker._id}
    worker={worker}
  />
))}

          </div>

        ) : (

          /* =====================================================
              NORMAL NO RESULTS
          ====================================================== */

          <div className="text-center py-16 md:py-20 bg-gray-900 border border-gray-800 rounded-3xl">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-800 flex items-center justify-center text-gray-600 text-2xl mb-5">
              <FaSearch />
            </div>

            <h3 className="text-xl md:text-2xl font-bold">
              No artisans found
            </h3>

            <p className="text-gray-500 mt-3 max-w-md mx-auto px-5">
              We couldn't find any artisans
              matching your current search.
              Try another skill or location.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-6">

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={
                    clearAllFilters
                  }
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold transition"
                >
                  Show all artisans
                </button>
              )}

              <button
                type="button"
                onClick={
                  handleUseLocation
                }
                className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 font-semibold flex items-center gap-2 transition"
              >
                <FaMapMarkerAlt />
                Find near me
              </button>

            </div>

          </div>

        )}

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        {!locationSearchLoading &&
          workersToDisplay.length > 0 &&
          totalPages > 1 && (

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={() =>
                setPage(
                  (previous) =>
                    Math.max(
                      1,
                      previous - 1
                    )
                )
              }
              disabled={page === 1}
              className="h-10 px-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition"
            >
              <FaChevronLeft />
              <span className="hidden sm:inline">
                Previous
              </span>
            </button>

            {/* PAGE NUMBERS */}

            <div className="flex items-center gap-1.5">

              {pageNumbers.map(
                (pageNumber, index) =>
                  pageNumber === '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-9 h-10 flex items-center justify-center text-gray-600"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() =>
                        setPage(
                          pageNumber
                        )
                      }
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                        page === pageNumber
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
              )}

            </div>

            {/* NEXT */}

            <button
              type="button"
              onClick={() =>
                setPage(
                  (previous) =>
                    Math.min(
                      totalPages,
                      previous + 1
                    )
                )
              }
              disabled={
                page === totalPages
              }
              className="h-10 px-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition"
            >
              <span className="hidden sm:inline">
                Next
              </span>
              <FaChevronRight />
            </button>

          </div>
        )}

      </section>

    </main>
  )
}

export default WorkersPage