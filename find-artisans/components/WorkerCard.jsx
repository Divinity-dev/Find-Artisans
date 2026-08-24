'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  FaWhatsapp,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUserTie,
  FaArrowRight,
} from 'react-icons/fa'

const WorkerCard = ({ worker }) => {
  const getWhatsAppNumber = (phone) => {
    if (!phone) return null

    const cleaned = phone.replace(/\D/g, '')

    if (!cleaned) return null

    return cleaned.replace(/^0/, '234')
  }

  const whatsappNumber = getWhatsAppNumber(worker.phone)

  return (
    <article className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 hover:-translate-y-1 transition-all duration-300">

      {/* IMAGE */}

      <div className="relative overflow-hidden">

        <Image
          src={
            worker.profilePhoto ||
            '/images/default.png'
          }
          alt={
            worker.fullName ||
            'Artisan'
          }
          width={600}
          height={400}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* VERIFIED */}

        {worker.verification?.isVerified && (
          <span className="absolute top-3 right-3 bg-green-600/95 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <FaCheckCircle />
            Verified
          </span>
        )}

      </div>

      {/* CONTENT */}

      <div className="p-5">

        {/* NAME + SKILL */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h3 className="text-xl font-bold truncate">
              {worker.fullName ||
                'Unnamed Artisan'}
            </h3>

            <p className="text-orange-500 text-sm font-semibold mt-1">
              {worker.skill ||
                'Skilled Artisan'}
            </p>

          </div>

          <div className="w-9 h-9 shrink-0 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <FaUserTie />
          </div>

        </div>

        {/* LOCATION */}

        <div className="flex items-start gap-2 text-gray-400 text-sm mt-4">

          <FaMapMarkerAlt className="text-gray-600 mt-0.5 shrink-0" />

          <span>
            {worker.location?.city ||
              'Location unavailable'}

            {worker.location?.state
              ? `, ${worker.location.state}`
              : ''}
          </span>

        </div>

        {/* EXPERIENCE */}

        <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">

          <FaUserTie className="text-gray-700" />

          <span>
            {worker.yearsOfExperience || 0}{' '}
            {worker.yearsOfExperience === 1
              ? 'year'
              : 'years'}{' '}
            experience
          </span>

        </div>

        {/* SKILLS */}

        {Array.isArray(worker.skills) &&
          worker.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">

              {worker.skills
                .slice(0, 3)
                .map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs"
                  >
                    {skill}
                  </span>
                ))}

              {worker.skills.length > 3 && (
                <span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-500 text-xs">
                  +{worker.skills.length - 3}
                </span>
              )}

            </div>
          )}

        {/* ACTIONS */}

        <div className="mt-5 pt-4 border-t border-gray-800 flex items-center gap-2">

          <Link
            href={`/workers/${worker._id}`}
            className="flex-1 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
          >
            View Profile

            <FaArrowRight className="text-xs" />
          </Link>

          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat with ${
                worker.fullName || 'artisan'
              } on WhatsApp`}
              className="w-10 h-10 shrink-0 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition"
            >
              <FaWhatsapp className="text-lg" />
            </a>
          ) : null}

        </div>

      </div>

    </article>
  )
}

export default WorkerCard