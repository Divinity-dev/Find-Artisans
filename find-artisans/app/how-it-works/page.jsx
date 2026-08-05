import React from 'react'
import {
  FaStar,
  FaWhatsapp,
  FaCheckCircle,
  FaSearch,
  FaShieldAlt,
  FaBolt,
  FaUserCheck,
  FaPlayCircle,
} from 'react-icons/fa';

const page = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
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
  className="w-full h-100 rounded-xl shadow-lg object-cover"
>
  <source src="/findartisans_final_with_audio.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
        </div>
      </section>
    </div>
  )
}

export default page