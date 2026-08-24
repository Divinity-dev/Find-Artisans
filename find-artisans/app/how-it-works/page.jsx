'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaStar,
  FaWhatsapp,
  FaCheckCircle,
  FaSearch,
  FaShieldAlt,
  FaBolt,
  FaUserCheck,
  FaMapMarkerAlt,
  FaArrowRight,
  FaTools,
  FaUserTie,
  FaPhoneAlt,
  FaClipboardCheck,
  FaHandshake,
  FaClock,
} from 'react-icons/fa';

const steps = [
  {
    number: '01',
    icon: <FaSearch />,
    title: 'Search',
    description:
      'Search for the exact skill you need or find skilled artisans in your area using your state, city or LGA.',
    features: [
      'Search by skill or name',
      'Search by State, City or LGA',
      'Find artisans near you',
    ],
  },
  {
    number: '02',
    icon: <FaUserCheck />,
    title: 'Compare',
    description:
      'Take your time to review artisan profiles, experience, skills, ratings and verification status before making a decision.',
    features: [
      'View artisan profiles',
      'Check experience and skills',
      'See ratings and reviews',
    ],
  },
  {
    number: '03',
    icon: <FaWhatsapp />,
    title: 'Contact & Hire',
    description:
      'Once you find the right professional, contact them directly and discuss your job, price and requirements.',
    features: [
      'Contact artisans directly',
      'Discuss your job',
      'Hire with confidence',
    ],
  },
];

const benefits = [
  {
    icon: <FaCheckCircle />,
    title: 'Verified Professionals',
    description:
      'Find artisans whose profiles can be verified, helping you make more informed hiring decisions.',
  },
  {
    icon: <FaMapMarkerAlt />,
    title: 'Find Artisans Near You',
    description:
      'Search by location or use your current location to discover professionals around you.',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Built for Trust',
    description:
      'Profiles, verification and reviews give you useful information before you contact an artisan.',
  },
  {
    icon: <FaBolt />,
    title: 'Fast & Simple',
    description:
      'No complicated process. Search, compare and contact the professional you need.',
  },
];

const page = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden px-5 md:px-10">

        {/* Background glow */}

        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full" />

          <div className="absolute top-40 left-0 w-72 h-72 bg-orange-500/5 blur-[100px] rounded-full" />

          <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/5 blur-[100px] rounded-full" />

        </div>

        <div className="relative max-w-6xl mx-auto pt-28 pb-20 text-center">

          {/* Badge */}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-semibold mb-7">

            <FaCheckCircle />

            Simple. Fast. Reliable.

          </div>

          {/* Heading */}

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">

            How Find
            <span className="text-orange-500">
              Artisans
            </span>{' '}
            Works

          </h1>

          <p className="text-gray-400 text-base md:text-xl max-w-3xl mx-auto mt-6 leading-8">

            Finding the right professional for your job
            shouldn't be difficult. Search, compare and
            connect with skilled artisans across Nigeria
            in just a few simple steps.

          </p>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="px-5 md:px-10 pb-24">

        <div className="max-w-7xl mx-auto">

          {/* Section heading */}

          <div className="text-center mb-14">

            <div className="inline-flex items-center gap-2 text-orange-500 text-sm font-semibold mb-3">

              <FaTools />

              FIND YOUR PROFESSIONAL

            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold">

              Three simple steps

            </h2>

            <p className="text-gray-400 max-w-2xl mx-auto mt-4">

              We've made the process straightforward so you
              can spend less time searching and more time
              getting your work done.

            </p>

          </div>


          {/* Steps */}

          <div className="grid md:grid-cols-3 gap-6 relative">

            {/* Desktop connecting line */}

            <div className="hidden md:block absolute top-[78px] left-[16%] right-[16%] h-px bg-gradient-to-r from-orange-500/20 via-orange-500/60 to-orange-500/20" />


            {steps.map((step, index) => (

              <div
                key={step.number}
                className="relative group"
              >

                <div className="relative h-full bg-gray-900/80 backdrop-blur-xl border border-gray-800 hover:border-orange-500/40 rounded-3xl p-7 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/5">

                  {/* Number */}

                  <div className="flex items-center justify-between mb-7">

                    <span className="text-5xl font-black text-gray-800 group-hover:text-orange-500/20 transition">

                      {step.number}

                    </span>

                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">

                      {step.icon}

                    </div>

                  </div>


                  {/* Title */}

                  <h3 className="text-2xl font-bold">

                    {step.title}

                  </h3>


                  {/* Description */}

                  <p className="text-gray-400 mt-3 leading-7">

                    {step.description}

                  </p>


                  {/* Features */}

                  <div className="mt-7 space-y-3">

                    {step.features.map((feature) => (

                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm text-gray-300"
                      >

                        <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">

                          <FaCheckCircle className="text-xs" />

                        </span>

                        {feature}

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          VISUAL PROCESS
      ====================================================== */}

      <section className="px-5 md:px-10 py-24 bg-gray-900/40 border-y border-gray-800/60">

        <div className="max-w-6xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* LEFT */}

            <div>

              <div className="inline-flex items-center gap-2 text-orange-500 text-sm font-semibold mb-4">

                <FaUserTie />

                MAKE BETTER DECISIONS

              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">

                The right artisan is
                <span className="text-orange-500">
                  {' '}closer than you think.
                </span>

              </h2>

              <p className="text-gray-400 mt-6 leading-8 text-lg">

                Whether you need an electrician, plumber,
                mechanic, cleaner, carpenter, painter or
                another skilled professional, FindArtisans
                helps you discover people who can get the
                job done.

              </p>

              <div className="mt-8 space-y-5">

                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center flex-shrink-0">

                    <FaSearch />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Search your way
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      Search by skill, name or location.
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">

                    <FaMapMarkerAlt />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Find someone nearby
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      Use your location to discover nearby
                      professionals.
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0">

                    <FaWhatsapp />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Connect directly
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      Contact artisans directly through
                      WhatsApp.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* RIGHT */}

            <div className="relative">

              <div className="absolute -inset-5 bg-orange-500/5 blur-3xl rounded-full" />

              <div className="relative bg-gray-950 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">

                {/* Fake profile preview */}

                <div className="flex items-center gap-4 pb-6 border-b border-gray-800">

                  <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-orange-500 text-2xl">

                    <FaUserTie />

                  </div>

                  <div className="flex-1">

                    <div className="flex items-center gap-2">

                      <h3 className="font-bold text-lg">
                        Verified Artisan
                      </h3>

                      <FaCheckCircle className="text-green-500 text-sm" />

                    </div>

                    <p className="text-orange-500 text-sm mt-1">
                      Skilled Professional
                    </p>

                  </div>

                </div>


                <div className="py-6 space-y-4">

                  <div className="flex items-center justify-between">

                    <span className="text-gray-400">
                      Location
                    </span>

                    <span className="flex items-center gap-2 text-sm">

                      <FaMapMarkerAlt className="text-orange-500" />

                      Near you

                    </span>

                  </div>


                  <div className="flex items-center justify-between">

                    <span className="text-gray-400">
                      Verification
                    </span>

                    <span className="flex items-center gap-2 text-green-500 text-sm">

                      <FaCheckCircle />

                      Verified

                    </span>

                  </div>


                  <div className="flex items-center justify-between">

                    <span className="text-gray-400">
                      Experience
                    </span>

                    <span className="text-sm">
                      Professional
                    </span>

                  </div>


                  <div className="flex items-center justify-between">

                    <span className="text-gray-400">
                      Rating
                    </span>

                    <span className="flex items-center gap-1 text-sm">

                      <FaStar className="text-yellow-500" />

                      <FaStar className="text-yellow-500" />

                      <FaStar className="text-yellow-500" />

                      <FaStar className="text-yellow-500" />

                      <FaStar className="text-yellow-500" />

                    </span>

                  </div>

                </div>


                <div className="grid grid-cols-2 gap-3">

                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">

                    <FaPhoneAlt className="mx-auto text-orange-500 mb-2" />

                    <span className="text-xs text-gray-400">
                      Contact
                    </span>

                  </div>

                  <div className="bg-green-600/10 border border-green-500/20 rounded-xl p-3 text-center">

                    <FaWhatsapp className="mx-auto text-green-500 mb-2" />

                    <span className="text-xs text-gray-400">
                      WhatsApp
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY FINDARTISANS
      ====================================================== */}

      <section className="py-24 px-5 md:px-10">

        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">

            <div className="inline-flex items-center gap-2 text-orange-500 text-sm font-semibold mb-3">

              <FaShieldAlt />

              WHY FINDARTISANS

            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold">

              More than just a directory

            </h2>

            <p className="text-gray-400 mt-4">

              We're building a better way for people to
              discover and connect with skilled professionals
              across Nigeria.

            </p>

          </div>


          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {benefits.map((benefit) => (

              <div
                key={benefit.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/30 transition"
              >

                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xl mb-5">

                  {benefit.icon}

                </div>

                <h3 className="font-bold text-lg">
                  {benefit.title}
                </h3>

                <p className="text-gray-400 text-sm leading-6 mt-2">
                  {benefit.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="px-5 md:px-10 pb-24">

        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-gray-900 to-gray-900 p-8 md:p-14 text-center">

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 blur-3xl rounded-full" />

          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full" />

          <div className="relative">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center text-2xl mb-6">

              <FaTools />

            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold">

              Ready to find your artisan?

            </h2>

            <p className="text-gray-400 max-w-2xl mx-auto mt-4 leading-7">

              Search thousands of skilled professionals
              across Nigeria and find the right person for
              your next job.

            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

              <Link
                href="/workers"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-xl transition"
              >

                Find an Artisan

                <FaArrowRight />

              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold px-7 py-3.5 rounded-xl transition"
              >

                Back to Home

              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default page;