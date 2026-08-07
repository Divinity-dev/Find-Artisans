'use client'

import {useEffect,  useState, useMemo } from 'react'
// import API from '../axios'
import Image from 'next/image'
import Link from 'next/link'

import { State, City } from 'country-state-city'
import { lgas } from 'nigerian-states-and-lgas'

import {
  FaWhatsapp,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaFilter,
} from 'react-icons/fa'

const WorkersPage = ({ workers = []}) => {
//   const [workers, setWorkers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

  const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
const workersPerPage = 12;


  // FILTERS
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedLGA, setSelectedLGA] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // ======================
  // FETCH WORKERS
  // ======================
//   const fetchWorkers = async () => {
//     try {
//       setLoading(true)

//       const res = await API.get(`/users/workers/all`)

//       setWorkers(res.data.workers || [])
//       setTotalPages(res.data.totalPages || 1)

//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to load workers')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchWorkers()
//   }, [page])

useEffect(() => {
  setPage(1);
}, [search, selectedState, selectedCity, selectedLGA]);

useEffect(() => {
  window.scrollTo(0, 0);
}, [page]);


  // ======================
  // LOCATION DATA
  // ======================
  const nigeriaStates = State.getStatesOfCountry('NG')

  const cities = selectedState
    ? City.getCitiesOfState(
        'NG',
        nigeriaStates.find(s => s.name === selectedState)?.isoCode
      )
    : []

  const localGovernments = selectedState ? lgas(selectedState) : []

  // ======================
  // FILTER LOGIC
  // ======================
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      const matchSearch =
        w.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        w.skill?.toLowerCase().includes(search.toLowerCase()) ||
        (w.skills || []).join(' ').toLowerCase().includes(search.toLowerCase())

      const matchState = selectedState
        ? w.location?.state === selectedState
        : true

      const matchCity = selectedCity
        ? w.location?.city === selectedCity
        : true

      const matchLGA = selectedLGA
        ? w.location?.localGovernment === selectedLGA
        : true

      return matchSearch && matchState && matchCity && matchLGA
    })
  }, [workers, search, selectedState, selectedCity, selectedLGA])

  const totalPages = Math.ceil(
  filteredWorkers.length / workersPerPage
);

const paginatedWorkers = filteredWorkers.slice(
  (page - 1) * workersPerPage,
  page * workersPerPage
);

  // ======================
  // LOADING / ERROR
  // ======================
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
//         Loading workers...
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-950 text-red-500">
//         {error}
//       </div>
//     )
//   }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 md:px-20 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Verified Workers
      </h1>

      {/* FILTER BUTTON */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-lg mb-4"
      >
        <FaFilter /> Filters
      </button>

      {/* FILTERS */}
      {showFilters && (
        <div className="grid md:grid-cols-4 gap-4 mb-8 bg-gray-900 p-4 rounded-xl">

          <input
            placeholder="Search name or skill"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 bg-gray-800 rounded"
          />

          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value)
              setSelectedCity('')
              setSelectedLGA('')
            }}
            className="p-3 bg-gray-800 rounded"
          >
            <option value="">State</option>
            {nigeriaStates.map(s => (
              <option key={s.isoCode} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="p-3 bg-gray-800 rounded"
          >
            <option value="">City</option>
            {cities.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedLGA}
            onChange={(e) => setSelectedLGA(e.target.value)}
            className="p-3 bg-gray-800 rounded"
          >
            <option value="">LGA</option>
            {localGovernments.map((lga, i) => (
              <option key={i} value={lga}>
                {lga}
              </option>
            ))}
          </select>

        </div>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {paginatedWorkers.map((w) => (
          <div
            key={w._id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
          >

            {/* IMAGE */}
            <div className="relative">
              <Image
                src={w.profilePhoto || '/images/default.png'}
                alt={w.fullName}
                width={500}
                height={300}
                className="w-full h-52 object-cover"
              />

              {w.verification?.isVerified && (
                <span className="absolute top-3 right-3 bg-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FaCheckCircle /> Verified
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-5">

              <h2 className="text-xl font-semibold">
                {w.fullName}
              </h2>

              <p className="text-orange-500 text-sm">
                {w.skill}
              </p>

              <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                <FaMapMarkerAlt />
                {w.location?.city}, {w.location?.state}
              </div>

              <p className="text-sm text-gray-400 mt-2">
                Experience: {w.yearsOfExperience || 0} years
              </p>

              <p className="text-sm text-gray-400">
                Skills: {(w.skills || []).join(', ')}
              </p>

              {/* ACTIONS */}
              <div className="mt-5 flex justify-between items-center">

                <Link
                  href={`/workers/${w._id}`}
                  className="text-orange-500 text-sm"
                >
                  View Profile
                </Link>

                <a
                  href={`https://wa.me/${w.phone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <FaWhatsapp /> Chat
                </a>

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* PAGINATION */}    

  <div className="flex items-center justify-center gap-4 mt-10">

  <button
    onClick={() => setPage((p) => p - 1)}
    disabled={page === 1}
    className={`px-5 py-2 rounded-lg font-medium transition ${
      page === 1
        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600"
    }`}
  >
    ← Previous
  </button>

  <span className="px-5 py-2 rounded-lg bg-gray-900 border border-gray-700">
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage((p) => p + 1)}
    disabled={page === totalPages}
    className={`px-5 py-2 rounded-lg font-medium transition ${
      page === totalPages
        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600"
    }`}
  >
    Next →
  </button>

</div>

    </div>
  )
}

export default WorkersPage