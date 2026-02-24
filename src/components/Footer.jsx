"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 inset-shadow-md border-white/40">

      {/* ================= MAIN FOOTER ================= */}
      <div className="w-full px-6 pt-6 pb-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* BRAND */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              NestME
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Discover verified properties across India.
              Buy, Rent or Lease with confidence.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-4 pt-2">
              {["facebook", "instagram", "twitter", "linkedin"].map((icon) => (
                <div
                  key={icon}
                  className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-indigo-500 text-sm">
                    public
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Quick Links</h3>

            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/properties?listingType=sale">Buy Property</Link></li>
              <li><Link href="/properties?listingType=rent">Rent Property</Link></li>
              <li><Link href="/add-property">Post Property</Link></li>
              <li><Link href="/search">Search Homes</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Company</h3>

            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Contact</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">
              Stay Updated
            </h3>

            <p className="text-sm text-slate-600">
              Get latest listings and offers directly in your inbox.
            </p>

            <div className="flex items-center bg-white rounded-full shadow-sm overflow-hidden">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-4 py-2 text-sm focus:outline-none"
              />
              <button className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-sm font-semibold">
                Subscribe
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ================= BOTTOM STRIP ================= */}
      <div className="border-t border-white/50 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} NestMe. All rights reserved.
        </div>
      </div>

    </footer>
  );
}
