"use client";

export default function AuthLayout({ title, children, quote }) {

  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e293b] text-white">

      {/* Glow background */}
      <div className="absolute inset-0 -z-10 bg-indigo-500/20 blur-3xl" />

      <div className="w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            nestme<span className="text-indigo-400">.in</span>
          </h1>

          <p className="text-white/70 text-sm">
            Your trusted property partner
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">

          <h2 className="text-2xl font-bold text-center">
            {title}
          </h2>

          {quote && (
            <p className="text-center text-sm text-white/70 italic leading-relaxed">
              “{quote}”
            </p>
          )}

          {children}
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-white/40 mt-6">
          © {new Date().getFullYear()} NestMe. All rights reserved.
        </p>

      </div>
    </div>
  );
}