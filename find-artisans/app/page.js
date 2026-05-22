'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { State, City } from 'country-state-city';
import {
  FaStar,
  FaWhatsapp,
  FaCheckCircle,
  FaSearch,
} from 'react-icons/fa';


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
      localGovernment: 'Ikeja Central',
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
      localGovernment: 'Abuja Municipal',
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
      localGovernment: 'Lekki Central',
      rating: 4.8,
      reviews: 210,
      verified: true,
      experience: '6 Years',
      phone: '2348076543210',
    },
  ];

  const [searchName, setSearchName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');

  const nigeriaStates = State.getStatesOfCountry('NG');

  const cities = selectedState
    ? City.getCitiesOfState(
        'NG',
        nigeriaStates.find((state) => state.name === selectedState)?.isoCode
      )
    : [];

  const localGovernments = selectedCity
    ? [
        `${selectedCity} Central`,
        `${selectedCity} North`,
        `${selectedCity} West`,
      ]
    : [];

  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      const matchesName =
        artisan.businessName
          .toLowerCase()
          .includes(searchName.toLowerCase()) ||
        artisan.category.toLowerCase().includes(searchName.toLowerCase());

      const matchesState = selectedState
        ? artisan.state === selectedState
        : true;

      const matchesCity = selectedCity
        ? artisan.city === selectedCity
        : true;

      const matchesLGA = selectedLGA
        ? artisan.localGovernment === selectedLGA
        : true;

      return matchesName && matchesState && matchesCity && matchesLGA;
    });
  }, [searchName, selectedState, selectedCity, selectedLGA]);

  

  return (
    <div className="min-h-screen bg-gray-950 text-white">

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

        <div className="relative z-10 text-center max-w-5xl w-full pt-24">

          <p className="text-orange-500 font-semibold tracking-widest uppercase mb-4">
            Trusted Artisan Marketplace
          </p>

          <h1 className="text-white text-4xl md:text-7xl font-extrabold leading-tight mb-6">
            Find Skilled <span className="text-orange-500">Artisans</span> Near You
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Connect with verified electricians, plumbers, mechanics, cleaners, and trusted professionals across Nigeria.
          </p>

          {/* SEARCH */}
          <div className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/10 shadow-2xl">

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
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                  setSelectedLGA('');
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
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedLGA('');
                }}
                className="w-full p-4 rounded-xl bg-white text-black outline-none"
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedLGA}
                onChange={(e) => setSelectedLGA(e.target.value)}
                className="w-full p-4 rounded-xl bg-white text-black outline-none"
              >
                <option value="">Select Local Government</option>
                {localGovernments.map((lga, index) => (
                  <option key={index} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>

            </div>
          </div>

        </div>
      </main>

      {/* CATEGORY SECTION (RESTORED) */}
      <section className="py-16 px-5 md:px-10 max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Popular Categories
          </h2>
          <p className="text-gray-400">
            Explore skilled professionals across categories
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
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition px-6 py-4 rounded-2xl font-semibold text-gray-300 hover:text-white cursor-pointer"
            >
              {item}
            </div>
          ))}

        </div>
      </section>

      {/* ARTISANS SECTION (RESTORED) */}
      <section className="py-10 px-5 md:px-10 max-w-7xl mx-auto border-t border-gray-800">

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Featured Artisans
          </h2>
          <p className="text-gray-400">
            Hire trusted professionals near you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredArtisans.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition"
            >

              <Image
                src={artisan.image}
                alt={artisan.businessName}
                width={500}
                height={300}
                className="w-full h-60 object-cover"
              />

              <div className="p-5">

                <h3 className="text-xl font-semibold text-white">
                  {artisan.businessName}
                </h3>

                <p className="text-orange-500 text-sm mt-1">
                  {artisan.category}
                </p>

                <p className="text-gray-400 text-sm mt-3">
                  {artisan.description}
                </p>

                <div className="flex items-center gap-2 mt-4 text-yellow-500 text-sm">
                  <FaStar />
                  {artisan.rating} ({artisan.reviews})
                </div>

                <div className="mt-5 flex gap-3">

                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold">
                    View Profile
                  </button>

                  <a
                    href={`https://wa.me/${artisan.phone}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center"
                  >
                    <FaWhatsapp />
                  </a>

                </div>

              </div>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default Page;