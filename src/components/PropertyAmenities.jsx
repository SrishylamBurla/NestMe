"use client";

import Image from "next/image";

/* 🔥 MAP AMENITY → IMAGE */
const AMENITY_ICONS = {
  wifi: "/amenities/wifi-signal.png",
  parking: "/amenities/parking-car.png",
  gym: "/amenities/dumbbell.png",
  pool: "/amenities/swimming.png",
  lift: "/amenities/elevator.png",
  power_backup: "/amenities/inverter.png",
  security: "/amenities/security-camera.png",
  garden: "/amenities/flowers.png",
  ac: "/amenities/air-conditioner.png",
  furnished: "/amenities/living-room.png",
};

export default function PropertyAmenities({ amenities = [] }) {
  if (!amenities.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5 text-slate-900">
        Amenities
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {amenities.map((a) => {
          const icon = AMENITY_ICONS[a];

          return (
            <div
              key={a}
              className="
                rounded-2xl
                bg-white/80
                backdrop-blur
                border border-slate-200
                p-4
                flex flex-col items-center justify-center
                gap-2
                hover:shadow-lg hover:-translate-y-1
                transition-all duration-300
                group
              "
            >
              {/* IMAGE ICON */}
              <div className="w-10 h-10 flex items-center justify-center">
                <Image
                  src={icon || "/amenities/parking-car.png"}
                  alt={a}
                  width={32}
                  height={32}
                  className="object-contain group-hover:scale-110 transition"
                />
              </div>

              {/* LABEL */}
              <span className="text-xs text-slate-600 text-center capitalize">
                {a.replace("_", " ")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}