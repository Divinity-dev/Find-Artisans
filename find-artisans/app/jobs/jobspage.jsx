'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import API from '../axios'

import {
  MapPin,
  Clock,
  Briefcase,
  Filter,
} from 'lucide-react'

import { toast } from 'react-toastify'

const JobsPage = () => {
  // ======================================
  // JOB DATA
  // ======================================

  const [jobList, setJobList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // ======================================
  // PAGINATION
  // ======================================

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)

  const jobsPerPage = 12

  // ======================================
  // LOADING
  // ======================================

  const [loading, setLoading] = useState(true)

  // ======================================
  // DELETE
  // ======================================

  const [deleteJobId, setDeleteJobId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // ======================================
  // APPLY
  // ======================================

  const [applyingJobId, setApplyingJobId] = useState(null)

  // ======================================
  // CURRENT USER
  // ======================================

  const [currentUserId, setCurrentUserId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // ======================================
  // GET CURRENT USER
  // ======================================

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const storedUser =
        JSON.parse(
          localStorage.getItem('user') || 'null'
        )

      setCurrentUserId(storedUser?._id || null)
      setIsAdmin(storedUser?.role === 'admin')
    } catch (error) {
      console.error(
        'Failed to read user from localStorage:',
        error
      )
    }
  }, [])

  // ======================================
  // FETCH JOBS
  // Backend handles:
  // - filtering
  // - pagination
  // ======================================

  useEffect(() => {
    let isMounted = true

    const fetchJobs = async () => {
      try {
        setLoading(true)

        const response = await API.get('/jobs', {
          params: {
            search: searchTerm.trim() || undefined,
            page,
            limit: jobsPerPage,
          },
        })

        if (!isMounted) return

        const data = response.data

        setJobList(data.jobs || [])
        setTotalJobs(data.total || 0)
        setTotalPages(data.totalPages || 1)
      } catch (error) {
        console.error(
          'Failed to fetch jobs:',
          error
        )

        if (isMounted) {
          setJobList([])
          setTotalJobs(0)
          setTotalPages(1)

          toast.error(
            error?.response?.data?.message ||
            'Failed to load jobs'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // ======================================
    // DEBOUNCE SEARCH
    // ======================================

    const timer = setTimeout(() => {
      fetchJobs()
    }, 400)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchTerm, page])

  // ======================================
  // SEARCH
  // ======================================

  const handleSearchChange = (event) => {
    const value = event.target.value

    setSearchTerm(value)

    // A new search always starts from page 1
    setPage(1)
  }

  // ======================================
  // CLEAR SEARCH
  // ======================================

  const clearSearch = () => {
    setSearchTerm('')
    setPage(1)
  }

  // ======================================
  // PAGE CHANGE
  // ======================================

  const goToPage = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === page
    ) {
      return
    }

    setPage(newPage)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // ======================================
  // DELETE JOB
  // ======================================

  const handleDelete = async () => {
    if (!deleteJobId) return

    try {
      setIsDeleting(true)

      await API.delete(
        `/jobs/${deleteJobId}`
      )

      toast.success(
        'Job deleted successfully'
      )

      setDeleteJobId(null)

      // ======================================
      // REFRESH CURRENT PAGE
      // ======================================

      // If the deleted job was the only job
      // on the current page, move back one page.
      if (
        jobList.length === 1 &&
        page > 1
      ) {
        setPage((currentPage) =>
          currentPage - 1
        )
      } else {
        // Trigger a fresh backend request
        // by temporarily changing nothing else.
        // We call the endpoint directly here.
        const response = await API.get(
          '/jobs',
          {
            params: {
              search:
                searchTerm.trim() ||
                undefined,
              page,
              limit: jobsPerPage,
            },
          }
        )

        setJobList(
          response.data.jobs || []
        )

        setTotalJobs(
          response.data.total || 0
        )

        setTotalPages(
          response.data.totalPages || 1
        )
      }
    } catch (error) {
      console.error(error)

      toast.error(
        error?.response?.data?.message ||
        'Failed to delete job'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  // ======================================
  // APPLY TO JOB
  // ======================================

  const applyToJob = async (jobId) => {
    try {
      setApplyingJobId(jobId)

      await API.post(
        `/jobs/${jobId}/apply`
      )

      // ======================================
      // UPDATE CURRENT PAGE LOCALLY
      // ======================================

      setJobList((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? {
                ...job,
                applicants: [
                  ...(job.applicants || []),
                  {
                    worker: currentUserId,
                  },
                ],
              }
            : job
        )
      )

      toast.success(
        'Application submitted successfully'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        error?.response?.data?.message ||
        'Failed to apply for job'
      )
    } finally {
      setApplyingJobId(null)
    }
  }

  // ======================================
  // CHECK WHETHER CURRENT USER APPLIED
  // ======================================

  const hasAppliedToJob = (job) => {
    if (!currentUserId) {
      return false
    }

    return job.applicants?.some(
      (applicant) =>
        applicant.worker?.toString() ===
        currentUserId.toString()
    )
  }

  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="px-6 md:px-20 py-10 border-b border-gray-800">

        <h1 className="text-3xl md:text-4xl font-bold">
          Browse Jobs
        </h1>

        <p className="text-gray-400 mt-2">
          Find real job opportunities from
          customers near you.
        </p>

      </div>

      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="px-6 md:px-20 py-6 flex flex-wrap gap-3 items-center">

        <Filter className="text-orange-500" />

        <div className="relative w-full md:max-w-xl">

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search skill e.g. electrician"
            className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-orange-500"
          />

        </div>

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-white transition"
          >
            Clear
          </button>
        )}

      </div>

      {/* ======================================
          RESULT COUNT
      ====================================== */}

      {!loading && (
        <div className="px-6 md:px-20 pb-6 text-sm text-gray-500">

          {totalJobs > 0
            ? `${totalJobs} ${
                totalJobs === 1
                  ? 'job'
                  : 'jobs'
              } found`
            : 'No jobs found'}

        </div>
      )}

      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="px-6 md:px-20 pb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse"
            >

              <div className="h-6 bg-gray-800 rounded w-3/4 mb-5" />

              <div className="h-4 bg-gray-800 rounded w-1/2 mb-3" />

              <div className="h-4 bg-gray-800 rounded w-1/3 mb-3" />

              <div className="h-4 bg-gray-800 rounded w-1/4 mb-6" />

              <div className="h-6 bg-gray-800 rounded w-24 mb-6" />

              <div className="h-9 bg-gray-800 rounded w-full" />

            </div>
          ))}

        </div>
      )}

      {/* ======================================
          JOBS
      ====================================== */}

      {!loading && jobList.length > 0 && (
        <div className="px-6 md:px-20 pb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {jobList.map((job) => {

            const hasApplied =
              hasAppliedToJob(job)

            return (
              <div
                key={job._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition"
              >

                {/* TITLE */}

                <h2 className="text-xl font-semibold mb-3">
                  {job.title}
                </h2>

                {/* LOCATION */}

                <div className="flex items-center gap-2 text-gray-400 mb-2">

                  <MapPin size={16} />

                  <span>
                    {job.location?.city ||
                      'Location not specified'}
                    {job.location?.state &&
                      `, ${job.location.state}`}
                  </span>

                </div>

                {/* BUDGET */}

                <div className="flex items-center gap-2 text-gray-400 mb-2">

                  <Briefcase size={16} />

                  <span>
                    {job.budget
                      ? `₦${job.budget.toLocaleString()}`
                      : 'Budget not specified'}
                  </span>

                </div>

                {/* DATE */}

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">

                  <Clock size={16} />

                  <span>
                    {new Date(
                      job.createdAt
                    ).toLocaleDateString()}
                  </span>

                </div>

                {/* CATEGORY */}

                <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 mb-4">
                  {job.category}
                </span>

                {/* ACTIONS */}

                <div className="flex justify-between items-center">

                  <Link
                    href={`/jobs/${job._id}`}
                    className="text-orange-500 hover:text-orange-400 text-sm"
                  >
                    View Details
                  </Link>

                  <div className="flex gap-3 items-center">

                    {/* DELETE */}

                    {isAdmin && (
                      <button
                        onClick={() =>
                          setDeleteJobId(
                            job._id
                          )
                        }
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    )}

                    {/* APPLY */}

                    <button
                      disabled={
                        applyingJobId ===
                          job._id ||
                        hasApplied
                      }
                      onClick={() =>
                        applyToJob(
                          job._id
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        hasApplied
                          ? 'bg-green-600 cursor-not-allowed'
                          : applyingJobId ===
                            job._id
                          ? 'bg-orange-400 cursor-not-allowed'
                          : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                    >
                      {hasApplied
                        ? 'Applied'
                        : applyingJobId ===
                          job._id
                        ? 'Applying...'
                        : 'Apply'}
                    </button>

                  </div>

                </div>

              </div>
            )
          })}

        </div>
      )}

      {/* ======================================
          NO JOBS
      ====================================== */}

      {!loading && jobList.length === 0 && (
        <div className="text-center text-gray-500 pb-20">

          <p className="text-lg">
            No jobs found.
          </p>

          {searchTerm && (
            <p className="mt-2 text-sm">
              Try searching for another skill,
              category, or job description.
            </p>
          )}

        </div>
      )}

      {/* ======================================
          PAGINATION
      ====================================== */}

      {!loading && totalJobs > 0 && (
        <div className="flex items-center justify-center gap-4 m-10">

          <button
            onClick={() =>
              goToPage(page - 1)
            }
            disabled={page === 1}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              page === 1
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            ← Previous
          </button>

          <span className="px-5 py-2 rounded-lg bg-gray-900 border border-gray-700">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() =>
              goToPage(page + 1)
            }
            disabled={
              page === totalPages
            }
            className={`px-5 py-2 rounded-lg font-medium transition ${
              page === totalPages
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            Next →
          </button>

        </div>
      )}

      {/* ======================================
          CTA
      ====================================== */}

      <div className="bg-gray-900 border-t border-gray-800 py-12 text-center">

        <h2 className="text-2xl font-bold">
          Need a worker instead?
        </h2>

        <p className="text-gray-400 mt-2">
          Post a job and get skilled artisans
          to apply.
        </p>

        <Link
          href="/post-job"
          className="inline-block mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold"
        >
          Post a Job
        </Link>

      </div>

      {/* ======================================
          DELETE MODAL
      ====================================== */}

      {deleteJobId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[90%] max-w-md">

            <h2 className="text-xl font-bold text-red-500 mb-3">
              Delete Job?
            </h2>

            <p className="text-gray-300 mb-6">
              This action is irreversible.
              The job will be permanently
              removed.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setDeleteJobId(null)
                }
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                {isDeleting
                  ? 'Deleting...'
                  : 'Delete'}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default JobsPage

