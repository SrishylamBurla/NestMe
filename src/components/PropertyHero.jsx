

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
          url: "/propertyImg/placeholder-property.jpg",
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
      "
    >
      {/* ================= SWIPER ================= */}
      {/* <Swiper
        modules={[
          Navigation,
          Pagination,
          Autoplay,
        ]}

        // 🔥 MOBILE SWIPE IMPROVEMENTS
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        spaceBetween={0}
        touchRatio={1.2}
        threshold={5}

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
          delay: 4500,
          disableOnInteraction: false,
        }}

        loop

        onSlideChange={(swiper) =>
          setActiveIndex(
            swiper.realIndex + 1
          )
        }

        className="w-full h-full"
      > */}

      <Swiper
        modules={[
          Navigation,
          Pagination,
          Autoplay,
        ]}

        // ================= MOBILE FEEL =================

        slidesPerView={1}

        centeredSlides

        loop

        speed={650}

        resistance={true}

        resistanceRatio={0.65}

        touchRatio={1.5}

        threshold={2}

        longSwipes={true}

        longSwipesRatio={0.2}

        followFinger={true}

        allowTouchMove={true}

        simulateTouch={true}

        touchStartPreventDefault={false}

        grabCursor={true}

        // ================= AUTOPLAY =================

        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}

        // ================= PAGINATION =================

        pagination={{
          clickable: true,
          dynamicBullets: true,
          el: ".hero-pagination",
        }}

        // ================= NAVIGATION =================

        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}

        // ================= ACTIVE SLIDE =================

        onSlideChange={(swiper) =>
          setActiveIndex(
            swiper.realIndex + 1
          )
        }

        className="
  w-full
  h-full
  touch-pan-y
  "
      >
        {slides.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">

              <Image
                src={img.url}
                alt={`property-${i}`}
                fill
                priority={i === 0}
                className="
object-cover
transition-transform
duration-[5000ms]
ease-linear
swiper-slide-active:scale-105
"
              />

            </div>
          </SwiperSlide>
        ))}
      </Swiper>


      {/* ================= NAVIGATION ================= */}

      <button
        className="
        hero-prev
        hidden md:flex
        absolute
        left-6
        top-1/2
        -translate-y-1/2
        z-30
        w-10 h-10
        items-center justify-center
        rounded-full
        backdrop-blur-2xl
        bg-white/10
        border border-white/20
        text-white
        text-3xl
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
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
        hidden md:flex
        absolute
        right-6
        top-1/2
        -translate-y-1/2
        z-30
        w-10 h-10
        items-center justify-center
        rounded-full
        backdrop-blur-2xl
        bg-white/10
        border border-white/20
        text-white
        text-3xl
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        hover:scale-110
        transition-all
        duration-300
        "
      >
        ›
      </button>

      {/* ================= OVERLAY ================= */}

      <div
        className="
        absolute inset-0
        bg-gradient-to-t
        from-black/90
        via-black/30
        to-black/10
        z-10
        "
      />

      {/* ================= SLIDE COUNT ================= */}

      <div
        className="
        absolute
        top-24
        right-5
        z-30
        px-3 py-1
        rounded-full
        bg-white/10
        backdrop-blur-2xl
        border border-white/10
        text-white
        text-xs
        shadow-lg
        "
      >
        {activeIndex} / {slides.length}
      </div>


      {/* ================= MOBILE SWIPE HINT ================= */}

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
  bg-black/30
  backdrop-blur-xl
  text-white/80
  text-[11px]
  tracking-wide
  animate-pulse
  "
      >
        Swipe for more photos
      </div>
      {/* ================= PAGINATION ================= */}

      <div
        className="
        hero-pagination
        absolute
        bottom-4
        left-1/2
        -translate-x-1/2
        z-30
        flex gap-2
        "
      />

      {/* ================= CURVED BOTTOM ================= */}


    </div>
  );
}