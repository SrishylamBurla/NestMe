"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import { useState } from "react";

import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PropertyHero({
  images = [],
  property,
}) {

  const [activeIndex, setActiveIndex] =
    useState(1);

  const slides =
    images.length > 0
      ? images
      : [
          {
            url:
              "/propertyImg/placeholder-property.jpg",
          },
        ];

  return (

    <div
      className="
      relative
      w-full
      h-[72vh]
      sm:h-[80vh]
      md:h-screen
      overflow-hidden
      bg-black
      "
    >

      {/* ================= SWIPER ================= */}

      <Swiper
        modules={[
          Navigation,
          Pagination,
          Autoplay,
        ]}

        slidesPerView={1}

        centeredSlides={false}

        loop={slides.length > 1}

        speed={500}

        allowTouchMove={true}

        simulateTouch={true}

        touchRatio={1.5}

        threshold={5}

        resistance={true}

        resistanceRatio={0.85}

        grabCursor={true}

        followFinger={true}

        touchStartPreventDefault={false}

        passiveListeners={false}

        observer={true}

        observeParents={true}

        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}

        pagination={{
          clickable: true,
          dynamicBullets: true,
          el: ".hero-pagination",
        }}

        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}

        onSlideChange={(swiper) =>
          setActiveIndex(
            swiper.realIndex + 1
          )
        }

        className="
        w-full
        h-full
        z-0
        "
      >

        {slides.map((img, i) => (

          <SwiperSlide key={i}>

            <div
              className="
              relative
              w-full
              h-full
              touch-pan-y
              "
            >

              <Image
                src={img.url}
                alt={`property-${i}`}
                fill
                priority={i === 0}
                draggable={false}
                className="
                object-cover
                select-none
                pointer-events-none
                transition-transform
                duration-700
                ease-out
                "
              />

            </div>

          </SwiperSlide>
        ))}

      </Swiper>

      {/* ================= OVERLAY ================= */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black/80
        via-black/20
        to-transparent
        z-10
        pointer-events-none
        "
      />

      {/* ================= NAVIGATION ================= */}

      <button
        className="
        hero-prev
        hidden
        md:flex
        absolute
        left-6
        top-1/2
        -translate-y-1/2
        z-30
        w-12
        h-12
        items-center
        justify-center
        rounded-full
        backdrop-blur-xl
        bg-white/10
        border
        border-white/20
        text-white
        text-3xl
        hover:scale-110
        transition-all
        duration-300
        "
      >
        ‹
      </button>

      <button
        className="
        hero-next
        hidden
        md:flex
        absolute
        right-6
        top-1/2
        -translate-y-1/2
        z-30
        w-12
        h-12
        items-center
        justify-center
        rounded-full
        backdrop-blur-xl
        bg-white/10
        border
        border-white/20
        text-white
        text-3xl
        hover:scale-110
        transition-all
        duration-300
        "
      >
        ›
      </button>

      {/* ================= SLIDE COUNT ================= */}

      <div
        className="
        absolute
        top-24
        right-5
        z-30
        px-4
        py-2
        rounded-full
        bg-black/40
        backdrop-blur-xl
        text-white
        text-xs
        font-semibold
        pointer-events-none
        "
      >
        {activeIndex} / {slides.length}
      </div>

      {/* ================= MOBILE HINT ================= */}

      <div
        className="
        md:hidden
        absolute
        bottom-16
        left-1/2
        -translate-x-1/2
        z-30
        px-4
        py-2
        rounded-full
        bg-black/40
        backdrop-blur-xl
        text-white/90
        text-[11px]
        tracking-wide
        animate-pulse
        pointer-events-none
        "
      >
        Swipe photos →
      </div>

      {/* ================= PAGINATION ================= */}

      <div
        className="
        hero-pagination
        absolute
        bottom-5
        left-1/2
        -translate-x-1/2
        z-30
        flex
        gap-2
        "
      />

    </div>
  );
}