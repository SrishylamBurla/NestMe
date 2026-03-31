"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useState } from "react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PropertyHero({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(1);

  const slides =
    images.length > 0
      ? images
      : [{ url: "/placeholder-property.jpg" }];

  return (
    <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] xl:h-[80vh] overflow-hidden rounded-none md:rounded-b-3xl">

      {/* SWIPER */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
        onSlideChange={(swiper) =>
          setActiveIndex(swiper.realIndex + 1)
        }
        className="w-full h-full"
      >
        {slides.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <Image
                src={img.url}
                alt={`property-${i}`}
                fill
                priority={i === 0}
                className="object-cover transition-transform duration-[4000ms] md:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* LEFT ARROW */}
      <button className="hero-prev hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 transition">
        ‹
      </button>

      {/* RIGHT ARROW */}
      <button className="hero-next hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 transition">
        ›
      </button>

      {/* SLIDE COUNT */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
        {activeIndex} / {slides.length}
      </div>

      {/* PAGINATION DOTS */}
      <div className="hero-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2" />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

      {/* BOTTOM FADE */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-10" />
    </div>
  );
}