'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import API from '@/app/axios';

import { State, City } from 'country-state-city';
import { lgas } from 'nigerian-states-and-lgas';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

import {
  FaStar,
  FaWhatsapp,
  FaCheckCircle,
  FaSearch,
  FaQuoteLeft,
  FaShieldAlt,
  FaBolt,
  FaUserCheck,
  FaPlayCircle,
} from 'react-icons/fa';

const Page = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [searchName, setSearchName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // ======================
  // FETCH WORKERS
  // ======================
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const res = await API.get('/users/workers/all');
        setWorkers(res.data.workers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const nigeriaStates = State.getStatesOfCountry('NG');

  const cities = selectedState
    ? City.getCitiesOfState(
        'NG',
        nigeriaStates.find((s) => s.name === selectedState)?.isoCode
      )
    : [];

  const localGovernments = selectedState ? lgas(selectedState) : [];

  // ======================
  // FILTERING (FRONTEND)
  // ======================
  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      const matchSearch =
        w.fullName?.toLowerCase().includes(searchName.toLowerCase()) ||
        w.skill?.toLowerCase().includes(searchName.toLowerCase()) ||
        (w.skills || []).join(' ').toLowerCase().includes(searchName.toLowerCase());

      const matchState = selectedState ? w.location?.state === selectedState : true;
      const matchCity = selectedCity ? w.location?.city === selectedCity : true;
      const matchLGA = selectedLGA
        ? w.location?.localGovernment === selectedLGA
        : true;

      return matchSearch && matchState && matchCity && matchLGA;
    });
  }, [workers, searchName, selectedState, selectedCity, selectedLGA]);

  const testimonials = [
  {
    id: 1,
    type: "Customer",
    name: "Chinedu O.",
    location: "Lagos",
    image: "/images/worker3.jpeg",
    message:
      "I found a verified plumber within 15 minutes. The service was excellent and affordable.",
    rating: 5,
  },
  {
    id: 2,
    type: "Worker",
    name: "Aisha M.",
    location: "Abuja",
    image: "/images/worker1.jpeg",
    message:
      "Since joining FindArtisans, I've gained more customers than ever before.",
    rating: 5,
  },
  {
    id: 3,
    type: "Customer",
    name: "David E.",
    location: "Port Harcourt",
    image: "/images/worker2.jpeg",
    message:
      "The ratings and verification gave me confidence. My electrician did a fantastic job.",
    rating: 5,
  },
  {
    id: 4,
    type: "Worker",
    name: "Blessing K.",
    location: "Benin",
    image: "/images/electrician.jpeg",
    message:
      "FindArtisans has helped me grow my business and reach more clients.",
    rating: 5,
  },
];

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  }, 5000);

  return () => clearInterval(interval);
}, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ================= HERO ================= */}
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

        <div className="relative z-10 text-center max-w-5xl w-full pt-24">

          <p className="text-orange-500 font-semibold tracking-widest uppercase mb-4">
            Trusted Artisan Marketplace
          </p>

          <h1 className="text-white text-4xl md:text-7xl font-extrabold leading-tight mb-6">
            Find Skilled <span className="text-orange-500">Workers</span> Near You
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Connect with verified electricians, plumbers, mechanics, cleaners, and trusted professionals across Nigeria.
          </p>

          {/* SEARCH */}
          <div className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <div className="flex items-center bg-white rounded-xl px-3">
                <FaSearch className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search worker or skill"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full p-3 outline-none text-black"
                />
              </div>

              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                  setSelectedLGA('');
                }}
                className="w-full p-3 rounded-xl bg-white text-black"
              >
                <option value="">Select State</option>
                {nigeriaStates.map((s) => (
                  <option key={s.isoCode} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-3 rounded-xl bg-white text-black"
              >
                <option value="">Select City</option>
                {cities.map((c, i) => (
                  <option key={i} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedLGA}
                onChange={(e) => setSelectedLGA(e.target.value)}
                className="w-full p-3 rounded-xl bg-white text-black"
              >
                <option value=""> Local Government Area</option>
                {localGovernments.map((lga, i) => (
                  <option key={i} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>

            </div>
          </div>

        </div>
      </main>

      {/* ================= WORKERS ================= */}
      <section className="py-10 px-5 md:px-10 max-w-7xl mx-auto border-t border-gray-800">
        <h2 className="text-3xl font-bold mb-2">Available Workers</h2>
        <p className="text-gray-400 mb-8">
          Workers update in real-time as you filter
        </p>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkers.map((w) => (
              <div
                key={w._id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
              >
                <Image
                  src={w.profilePhoto || '/images/default.png'}
                  alt={w.fullName}
                  width={500}
                  height={300}
                  className="w-full h-60 object-cover"
                />

                <div className="p-5">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold">{w.fullName}</h3>

                    {w.verification?.isVerified && (
                      <span className="text-green-500 flex items-center gap-1 text-xs">
                        <FaCheckCircle /> Verified
                      </span>
                    )}
                  </div>

                  <p className="text-orange-500 text-sm">{w.skill}</p>

                  <p className="text-gray-400 text-sm mt-2">
                    {w.location?.city}, {w.location?.state}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {w.yearsOfExperience || 0} yrs experience
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
  <Link
    href={`/workers/${w._id}`}
    className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium"
  >
    View Details
  </Link>

  <a
    href={`https://wa.me/${w.phone?.replace(/\D/g, '')}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
  >
    <FaWhatsapp /> Chat
  </a>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 px-5 md:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-gray-400 mt-2">
            Get skilled workers in 3 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaSearch />,
              title: 'Search',
              desc: 'Find verified workers near you instantly',
            },
            {
              icon: <FaUserCheck />,
              title: 'Compare',
              desc: 'Check profiles, ratings and experience',
            },
            {
              icon: <FaBolt />,
              title: 'Hire',
              desc: 'Contact and hire workers directly',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 p-6 rounded-2xl"
            >
              <div className="text-orange-500 text-2xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-400 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* VIDEO SECTION */}
        <div className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
         
          <video
  autoPlay
  muted
  loop
  playsInline
   controls
   className="w-full md:h-100 rounded-xl shadow-lg object-cover"
>
  <source src="/findartisans_final_with_audio.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
        </div>
      </section>
      {/* ================= TESTIMONIALS ================= */}

<section className="py-20 px-5 md:px-10 bg-gray-950">

  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold">
      What Our Users Say
    </h2>

    <p className="text-gray-400 mt-3">
      Trusted by customers and artisans across Nigeria.
    </p>
  </div>

  <div className="max-w-4xl mx-auto">

    <AnimatePresence mode="wait">

      <motion.div
        key={testimonials[currentTestimonial].id}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-900 border border-gray-800 rounded-3xl p-10"
      >

        <FaQuoteLeft className="text-4xl text-orange-500 mb-6" />

        <p className="text-xl text-gray-300 leading-9 italic">
          "{testimonials[currentTestimonial].message}"
        </p>

        <div className="flex mt-6">
          {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
            <FaStar
              key={i}
              className="text-yellow-400 mr-1"
            />
          ))}
        </div>

        <div className="flex items-center mt-8">

          <Image
            src={testimonials[currentTestimonial].image}
            alt={testimonials[currentTestimonial].name}
            width={70}
            height={70}
            className="rounded-full object-cover h-20 w-20"
          />

          <div className="ml-5">

            <h3 className="font-bold text-lg">
              {testimonials[currentTestimonial].name}
            </h3>

            <p className="text-gray-400">
              {testimonials[currentTestimonial].type}
              {" • "}
              {testimonials[currentTestimonial].location}
            </p>

          </div>

        </div>

      </motion.div>

    </AnimatePresence>

  </div>

</section>

      {/* ================= CATEGORY ================= */}
      {/* <section className="py-16 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Popular Categories</h2>
          <p className="text-gray-400">
            Explore skilled professionals across categories
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {['Electricians', 'Plumbers', 'Mechanics', 'Builders', 'Cleaners', 'Painters'].map(
            (item, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 px-6 py-4 rounded-2xl text-gray-300 hover:text-white"
              >
                {item}
              </div>
            )
          )}
        </div>
      </section> */}

    </div>
  );
};

export default Page;