'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Briefcase, Filter } from 'lucide-react';

const JobsPage = () => {
  const [filter, setFilter] = useState('all');

  // TEMP DATA (replace with API later)
  const jobs = [
    {
      id: 1,
      title: 'Electrician Needed in Lekki',
      location: 'Lekki, Lagos',
      budget: '₦50,000 - ₦80,000',
      type: 'one-time',
      posted: '2 hours ago',
    },
    {
      id: 2,
      title: 'Plumber for Bathroom Fix',
      location: 'Ikeja, Lagos',
      budget: '₦30,000 - ₦60,000',
      type: 'urgent',
      posted: '1 day ago',
    },
    {
      id: 3,
      title: 'House Cleaning Service Needed',
      location: 'Surulere, Lagos',
      budget: '₦20,000 - ₦40,000',
      type: 'recurring',
      posted: '3 days ago',
    },
  ];

  const filteredJobs =
    filter === 'all'
      ? jobs
      : jobs.filter((job) => job.type === filter);

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

      {/* FILTER BAR */}
      <div className="px-6 md:px-20 py-6 flex flex-wrap gap-3 items-center">
        <Filter className="text-orange-500" />

        {['all', 'one-time', 'urgent', 'recurring'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg border transition ${
              filter === type
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-gray-700 text-gray-300 hover:border-gray-500'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* JOB LIST */}
      <div className="px-6 md:px-20 pb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition"
          >

            {/* TITLE */}
            <h2 className="text-xl font-semibold mb-3">
              {job.title}
            </h2>

            {/* LOCATION */}
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>

            {/* BUDGET */}
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Briefcase size={16} />
              <span>{job.budget}</span>
            </div>

            {/* TIME */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <Clock size={16} />
              <span>Posted {job.posted}</span>
            </div>

            {/* TAG */}
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 mb-4">
              {job.type}
            </span>

            {/* ACTION */}
            <div className="flex justify-between items-center">
              <Link
                href={`/jobs/${job.id}`}
                className="text-orange-500 hover:text-orange-400 text-sm"
              >
                View Details
              </Link>

              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium">
                Apply
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* EMPTY STATE (optional future improvement) */}
      {filteredJobs.length === 0 && (
        <div className="text-center text-gray-500 pb-20">
          No jobs found for this filter.
        </div>
      )}

      {/* CTA SECTION */}
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

    </div>
  );
};

export default JobsPage;