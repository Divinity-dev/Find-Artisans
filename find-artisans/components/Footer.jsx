import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">

      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-xl font-extrabold text-white">
            Find<span className="text-orange-500">Artisans</span>
          </h2>

          <p className="mt-3 text-sm text-gray-400">
            Connect with trusted artisans near you. Hire plumbers, electricians,
            carpenters and more in minutes.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>

          <div className="space-y-2 text-sm">
            <Link href="/find-workers" className="hover:text-orange-500 transition">
              Find Workers
            </Link>

            <Link href="/post-job" className="block hover:text-orange-500 transition">
              Post a Job
            </Link>

            <Link href="/jobs" className="block hover:text-orange-500 transition">
              Browse Jobs
            </Link>

            <Link href="/how-it-works" className="block hover:text-orange-500 transition">
              How It Works
            </Link>
          </div>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>

          <div className="space-y-2 text-sm">
            <Link href="/login" className="hover:text-orange-500 transition">
              Login
            </Link>

            <Link href="/register" className="block hover:text-orange-500 transition">
              Sign Up
            </Link>

            <Link href="/help" className="block hover:text-orange-500 transition">
              Help Center
            </Link>

            <Link href="/privacy" className="block hover:text-orange-500 transition">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>

          <div className="space-y-3 text-sm">

            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-orange-500" />
              Lagos, Nigeria
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-orange-500" />
              +2348069715964
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} className="text-orange-500" />
              {/* support@findartisans.com */}
              divine_asiriuwa@yahoo.com
            </div>

          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

          <p>© {new Date().getFullYear()} FindArtisans. All rights reserved.</p>

          <p className="text-orange-500 mt-2 md:mt-0">
            Built for trusted local hiring
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;