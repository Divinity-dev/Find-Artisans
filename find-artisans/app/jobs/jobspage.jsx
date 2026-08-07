'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '../axios'; 

import {
  MapPin,
  Clock,
  Briefcase,
  Filter,
} from 'lucide-react';
import { toast } from 'react-toastify'

const JobsPage = ({ jobs }) => {
//   const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
  const [deleteJobId, setDeleteJobId] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);
const [applyingJobId, setApplyingJobId] = useState(null)
  const [page, setPage] = useState(1)
const [jobList, setJobList] = useState(jobs);

  const jobsPerPage = 12;
   useEffect(() => {
    setJobList(jobs);
  }, [jobs]);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredJobs = jobList.filter((job) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = [
      job.category,
      job.title,
      job.skill,
      job.description,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const totalPages = Math.max(
  1,
  Math.ceil(filteredJobs.length / jobsPerPage)
);

const paginatedjobs = filteredJobs.slice(
  (page - 1) * jobsPerPage,
  page * jobsPerPage
);

  const handleDelete = async () => {
  if (!deleteJobId) return;

  try {
    setIsDeleting(true);

    await API.delete(`/jobs/${deleteJobId}`);

    setJobList(prev =>prev.filter(job => job._id !== deleteJobId));
toast.success('Job deleted successfully');
    setDeleteJobId(null);
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete job');
  } finally {
    setIsDeleting(false);
  }
};

const user =
  typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;

const isAdmin = user?.role === 'admin';
const currentUserId = user?._id;

const applyToJob = async (jobId) => {
  try {
    setApplyingJobId(jobId);

    await API.post(`/jobs/${jobId}/apply`);

    setJobList((prev) =>
      prev.map((job) =>
        job._id === jobId
          ? {
              ...job,
              applicants: [
                ...(job.applicants || []),
                { worker: currentUserId },
              ],
            }
          : job
      )
    );

    toast.success('Application submitted successfully');
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
      'Failed to apply for job'
    );
  } finally {
    setApplyingJobId(null);
  }
};

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div className="px-6 md:px-20 py-10 border-b border-gray-800">
        <h1 className="text-3xl md:text-4xl font-bold">
          Browse Jobs
        </h1>

        <p className="text-gray-400 mt-2">
          Find real job opportunities from customers near you.
        </p>
      </div>

      {/* SEARCH */}
      <div className="px-6 md:px-20 py-6 flex flex-wrap gap-3 items-center">
        <Filter className="text-orange-500" />

        <div className="relative w-full md:max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search skill e.g. electrician"
            className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-orange-500"
          />
        </div>

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-white transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* JOBS */}
      <div className="px-6 md:px-20 pb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {
          paginatedjobs?.map((job) => {
             const hasApplied = job.applicants?.some(
    applicant =>
      applicant.worker?.toString() === currentUserId
  );

            return (
            <div
              key={job._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition"
            >
              <h2 className="text-xl font-semibold mb-3">
                {job.title}
              </h2>

              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <MapPin size={16} />
                <span>
                  {job.location?.city},
                  {' '}
                  {job.location?.state}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Briefcase size={16} />
                <span>
                  ₦{job.budget?.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <Clock size={16} />
                <span>
                  {new Date(
                    job.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>

              <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 mb-4">
                {job.category}
              </span>

              <div className="flex justify-between items-center">
                <Link
                  href={`/jobs/${job._id}`}
                  className="text-orange-500 hover:text-orange-400 text-sm"
                >
                  View Details
                </Link>
  <div className="flex gap-3 items-center">
    {isAdmin && (
      <button
        onClick={() => setDeleteJobId(job._id)}
        className="text-red-500 hover:text-red-400 text-sm"
      >
        Delete
      </button>
    )}

   <button
  disabled={
    applyingJobId === job._id ||
    hasApplied
  }
  onClick={() => applyToJob(job._id)}
  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
    hasApplied
      ? 'bg-green-600 cursor-not-allowed'
      : applyingJobId === job._id
      ? 'bg-orange-400 cursor-not-allowed'
      : 'bg-orange-500 hover:bg-orange-600'
  }`}
>
  {hasApplied
    ? 'Applied'
    : applyingJobId === job._id
    ? 'Applying...'
    : 'Apply'}
</button>
  </div>
              </div>
            </div>
          )})
        }
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center text-gray-500 pb-20">
          No jobs found.
        </div>
      )}

         {/* PAGINATION */}    

  <div className="flex items-center justify-center gap-4 m-10">

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

      {/* CTA */}
      <div className="bg-gray-900 border-t border-gray-800 py-12 text-center">
        <h2 className="text-2xl font-bold">
          Need a worker instead?
        </h2>

        <p className="text-gray-400 mt-2">
          Post a job and get skilled artisans to apply.
        </p>

        <Link
          href="/post-job"
          className="inline-block mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold"
        >
          Post a Job
        </Link>
      </div>

      {deleteJobId && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[90%] max-w-md">
      
      <h2 className="text-xl font-bold text-red-500 mb-3">
        Delete Job?
      </h2>

      <p className="text-gray-300 mb-6">
        This action is irreversible. The job will be permanently removed.
      </p>

      <div className="flex justify-end gap-3">
        
        <button
          onClick={() => setDeleteJobId(null)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default JobsPage;