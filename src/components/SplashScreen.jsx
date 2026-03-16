"use client";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-black text-white overflow-hidden">

      {/* Soft glow background */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />

      <div className="relative text-center space-y-6 px-6">

        {/* Logo / Brand */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight animate-fadeInUp">
          nestme<span className="text-indigo-400">.in</span>
        </h1>

        {/* Tagline */}
        <p className="text-sm md:text-lg text-white/80 animate-fadeInUp delay-200">
          Buy • Sell • Rent Verified Properties Across India
        </p>

        {/* Premium quote */}
        <p className="text-xs md:text-sm text-white/50 animate-fadeInUp delay-300">
          Your trusted platform for finding the perfect home
        </p>

        {/* Loading indicator */}
        <div className="flex justify-center pt-6 animate-fadeInUp delay-500">
          <div className="w-10 h-10 border-2 border-white/30 border-t-indigo-400 rounded-full animate-spin" />
        </div>

      </div>

      {/* Bottom branding */}
      <p className="absolute bottom-6 text-xs text-white/40">
        © NestMe Technologies
      </p>
    </div>
  );
}