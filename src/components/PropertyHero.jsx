"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PropertyHero({ images = [] }) {
  const slides =
    images.length > 0
      ? images
      : [{ url: "/placeholder-property.jpg" }];

  return (
    <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[80vh]">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="w-full h-full"
      >
        {slides.map((img, i) => (
          <SwiperSlide key={i}>
            <div
              className="
                w-full h-full
                bg-cover bg-center
                transition-transform duration-[5000ms]
                scale-105 hover:scale-110
              "
              style={{
                backgroundImage: `url(${img.url})`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-4 right-4 z-20 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
  {`1 / ${slides.length}`}
</div>

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

      {/* Bottom Fade for content readability */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-10" />
    </div>
  );
}