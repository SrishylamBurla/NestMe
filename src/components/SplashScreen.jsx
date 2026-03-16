"use client";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black via-indigo-900 to-black text-white">

      <div className="text-center space-y-4 animate-fadeIn">

        {/* Logo / Brand */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          nestme.in
        </h1>

        {/* Tagline */}
        <p className="text-sm md:text-lg text-white/80 max-w-md mx-auto">
          Looking to buy or sell property?
          <br />
          This is the smartest platform to start.
        </p>

        {/* Subtle loading indicator */}
        <div className="pt-4">
          <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-white animate-loadingBar" />
          </div>
        </div>

      </div>
    </div>
  );
}