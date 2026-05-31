'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { State, City } from 'country-state-city';
import { lgas } from 'nigerian-states-and-lgas';
import {
  FaStar,
  FaWhatsapp,
  FaCheckCircle,
  FaFilter,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const Page = () => {
  const [searchName, setSearchName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const artisans = [
    {
      id: 1,
      businessName: 'John Electrical Services',
      category: 'Electrician',
      image: '/images/electrician.jpeg',
      state: 'Lagos',
      city: 'Ikeja',
      rating: 4.9,
      reviews: 124,
      verified: true,
      phone: '2348012345678',
    },
    {
      id: 2,
      businessName: 'Swift Plumbing Solutions',
      category: 'Plumber',
      image: '/images/plumber.jpeg',
      state: 'Abuja Federal Capital Territory',
      city: 'Abuja',
      rating: 4.7,
      reviews: 98,
      verified: true,
      phone: '2348098765432',
    },
    {
      id: 3,
      businessName: 'Crystal Cleaning Agency',
      category: 'Cleaner',
      image: '/images/cleaner.jpeg',
      state: 'Lagos',
      city: 'Lekki',
      rating: 4.8,
      reviews: 210,
      verified: true,
      phone: '2348076543210',
    },
  ];

  const nigeriaStates = State.getStatesOfCountry('NG');

  const cities = selectedState
    ? City.getCitiesOfState(
        'NG',
        nigeriaStates.find((s) => s.name === selectedState)?.isoCode
      )
    : [];

  const localGovernments = selectedState
    ? lgas(selectedState)
    : [];

  const filtered = useMemo(() => {
    return artisans.filter((a) => {
      const matchName =
        a.businessName.toLowerCase().includes(searchName.toLowerCase()) ||
        a.category.toLowerCase().includes(searchName.toLowerCase());

      const matchState = selectedState ? a.state === selectedState : true;
      const matchCity = selectedCity ? a.city === selectedCity : true;
      const matchLGA = selectedLGA ? a.localGovernment === selectedLGA : true;

      return matchName && matchState && matchCity && matchLGA;
    });
  }, [searchName, selectedState, selectedCity, selectedLGA]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div className="px-6 md:px-20 py-10 border-b border-gray-800">
        <h1 className="text-3xl md:text-4xl font-bold">
          Find Artisans
        </h1>
        <p className="text-gray-400 mt-2">
          Browse and hire verified skilled professionals
        </p>
      </div>

      {/* FILTER BUTTON */}
      <div className="px-6 md:px-20 py-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg"
        >
          <FaFilter /> Filters
        </button>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 bg-gray-900 border border-gray-800 p-4 rounded-xl">

            <input
              placeholder="Search artisan or category"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            />

            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
                setSelectedLGA('');
              }}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
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
              disabled={!selectedState}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
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
              disabled={!selectedState}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            >
              <option value="">Select Local Government</option>
              {localGovernments.map((lga, i) => (
                <option key={i} value={lga}>
                  {lga}
                </option>
              ))}
            </select>

          </div>
        )}
      </div>

      {/* RESULTS */}
      <div className="px-6 md:px-20 pb-20">
        <p className="text-gray-400 mb-6">
          {filtered.length} artisans found
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition"
            >

              {/* IMAGE */}
              <div className="relative">
                <Image
                  src={a.image}
                  alt={a.businessName}
                  width={500}
                  height={300}
                  className="w-full h-52 object-cover"
                />

                {a.verified && (
                  <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FaCheckCircle /> Verified
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <h2 className="text-xl font-semibold">
                  {a.businessName}
                </h2>

                <p className="text-orange-500 text-sm mt-1">
                  {a.category}
                </p>

                {/* LOCATION */}
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                  <FaMapMarkerAlt />
                  {a.state}, {a.city}
                </div>

                {/* RATING */}
                <div className="flex items-center gap-2 mt-3 text-yellow-500 text-sm">
                  <FaStar />
                  {a.rating} ({a.reviews})
                </div>

                {/* ACTION */}
                <div className="mt-5 flex justify-between items-center">

                  <Link
                    href={`/artisans/${a.id}`}
                    className="text-orange-500 hover:text-orange-400 text-sm"
                  >
                    View Profile
                  </Link>

                  <a
                    href={`https://wa.me/${a.phone}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    WhatsApp
                  </a>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default Page;