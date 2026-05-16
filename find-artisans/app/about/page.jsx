'use client';

import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  Briefcase,
  CheckCircle,
  Star,
  Globe,
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-gray-950 text-white min-h-screen">

      {/* HERO SECTION */}
      <section className="px-6 md:px-20 py-20 text-center bg-gradient-to-b from-gray-900 to-gray-950">
        <h1 className="text-4xl md:text-6xl font-extrabold">
          About <span className="text-orange-500">Find Artisans</span>
        </h1>

        <p className="mt-6 text-gray-300 max-w-3xl mx-auto text-lg">
          Find Artisans is a trusted marketplace that connects skilled workers with people
          who need their services — safely, quickly, and reliably.
        </p>

        <div className="mt-8">
          <Link
            href="/workers"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 transition rounded-lg font-semibold"
          >
            Find Skilled Workers
          </Link>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="px-6 md:px-20 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
          <p className="text-gray-300 leading-relaxed">
            <strong>Find Artisans</strong> is built to solve one problem:
            making it easy to find trusted, verified, and skilled workers without stress or uncertainty.
            From electricians to plumbers, carpenters, cleaners, and more — we bring professionals
            and customers together in one reliable platform.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-orange-500" />
            <h3 className="text-xl font-semibold">Our Mission</h3>
          </div>
          <p className="text-gray-300">
            To create a transparent, safe, and efficient way for people to hire skilled workers,
            while empowering artisans to grow their income and reputation.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-20 py-16 bg-gray-900/40">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why People Trust Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <ShieldCheck className="text-orange-500 mb-3" />
            <h3 className="font-semibold text-xl mb-2">Verified Workers</h3>
            <p className="text-gray-300">
              Every artisan undergoes identity and skill verification before being listed.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <Star className="text-orange-500 mb-3" />
            <h3 className="font-semibold text-xl mb-2">Ratings & Reviews</h3>
            <p className="text-gray-300">
              Customers can rate workers after each job, helping maintain quality and trust.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <Briefcase className="text-orange-500 mb-3" />
            <h3 className="font-semibold text-xl mb-2">Real Job Opportunities</h3>
            <p className="text-gray-300">
              Workers can find consistent job requests and grow their professional reputation.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">

          <div>
            <Users className="mx-auto text-orange-500 mb-3" size={32} />
            <h3 className="font-semibold text-xl mb-2">1. Create Account</h3>
            <p className="text-gray-300">
              Sign up as a customer or worker in just a few minutes.
            </p>
          </div>

          <div>
            <Briefcase className="mx-auto text-orange-500 mb-3" size={32} />
            <h3 className="font-semibold text-xl mb-2">2. Post or Apply</h3>
            <p className="text-gray-300">
              Customers post jobs, workers apply or get discovered.
            </p>
          </div>

          <div>
            <CheckCircle className="mx-auto text-orange-500 mb-3" size={32} />
            <h3 className="font-semibold text-xl mb-2">3. Get Work Done</h3>
            <p className="text-gray-300">
              Jobs are completed with trust, ratings, and secure communication.
            </p>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 md:px-20 py-20 text-center bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to get started?
        </h2>

        <p className="text-gray-300 mt-4">
          Join thousands of users already using Find Artisans.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold"
          >
            Get Started
          </Link>

          <Link
            href="/workers"
            className="px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-lg"
          >
            Explore Workers
          </Link>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} Find Artisans. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutPage;