"use client";

import Image from "next/image";
import Loader from "./Loader";


export default function PremiumSplash() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#020617] text-white">

      {/* ===== Premium Gradient Background ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-black to-cyan-950 opacity-95" />

      {/* ===== Subtle Noise Overlay (optional premium feel) ===== */}
      {/* <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" /> */}

      {/* ===== Floating Glow Orbs ===== */}
      <div className="absolute w-[700px] h-[700px] bg-indigo-500/20 rounded-full blur-[160px] animate-orb1" />
      <div className="absolute w-[550px] h-[550px] bg-cyan-400/20 rounded-full blur-[140px] animate-orb2" />

      {/* ===== Center Content ===== */}
      <div className="relative text-center px-6 space-y-2">

        {/* ===== Nest + Home Logo ===== */}
        <div className="flex justify-center animate-logoReveal">
          <Image
            src="/splashlogo.png"
            alt="NestMe Logo"
            // width={192}
            // height={192}
            className="w-40 md:w-48 drop-shadow-[0_0_40px_rgba(99,102,241,0.5)]"
          />
        </div>

        {/* ===== Brand Name ===== */}
        <h1 className="text-5xl md:text-5xl font-bold tracking-tight animate-logoReveal">
          nestme<span className="text-indigo-400">.in</span>
        </h1>


        {/* ===== Glass Tagline Card ===== */}
        <p className="text-xl font-bold text-white/80 leading-relaxed">
            Find your dream home
          </p>
        {/* <div className="mx-auto mt-10 max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl px-4 py-2 shadow-2xl animate-fadeUp delay-200">
          <p className="text-3xl font-bold text-white/80 leading-relaxed">
            Find your dream home
          </p>
          
        </div> */}
        <div className="scale-60">
        <Loader />
        </div>

        {/* ===== Quote ===== */}
        {/* <p className="text-xs md:text-sm text-white/50 animate-fadeUp delay-300">
          Where your next home begins
        </p> */}

        {/* ===== Premium Loader ===== */}

        
        {/* <div className="flex justify-center pt-6 animate-fadeUp delay-500">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-t-purple-400 border-2 animate-spin"></div>
          </div>
        </div> */}

      </div>

      {/* ===== Footer ===== */}
      <p className="absolute bottom-6 text-xs text-white/30 tracking-wide">
        © 2026 NestMe Technologies
      </p>

      {/* ===== Animations ===== */}
      <style jsx>{`
        @keyframes orb1 {
          0% { transform: translate(-25%, -15%); }
          50% { transform: translate(20%, 15%); }
          100% { transform: translate(-25%, -15%); }
        }
        @keyframes orb2 {
          0% { transform: translate(20%, 20%); }
          50% { transform: translate(-20%, -15%); }
          100% { transform: translate(20%, 20%); }
        }
        @keyframes logoReveal {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-orb1 { animation: orb1 14s ease-in-out infinite; }
        .animate-orb2 { animation: orb2 16s ease-in-out infinite; }
        .animate-logoReveal { animation: logoReveal 0.9s ease forwards; }
        .animate-fadeUp { animation: fadeUp 1s ease forwards; }
      `}</style>

    </div>
  );
}