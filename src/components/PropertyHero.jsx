// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import { useState } from "react";
// import Image from "next/image";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// export default function PropertyHero({ images = [], property }) {
//   const [activeIndex, setActiveIndex] = useState(1);

//   const slides =
//     images.length > 0
//       ? images
//       : [{ url: "/propertyImg/placeholder-property.jpg" }];

//   return (
//     <div className="relative w-full h-[85vh] md:h-screen overflow-hidden">

//       {/* SWIPER */}
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay]}
//         navigation={{
//           nextEl: ".hero-next",
//           prevEl: ".hero-prev",
//         }}
//         pagination={{
//           clickable: true,
//           el: ".hero-pagination",
//         }}
//         autoplay={{
//           delay: 4000,
//           disableOnInteraction: false,
//         }}
//         loop
//         onSlideChange={(swiper) =>
//           setActiveIndex(swiper.realIndex + 1)
//         }
//         className="w-full h-full"
//       >
//         {slides.map((img, i) => (
//           <SwiperSlide key={i}>
//             <div className="relative w-full h-full">
//               <Image
//                 src={img.url}
//                 alt={`property-${i}`}
//                 fill
//                 priority={i === 0}
//                 className="object-cover scale-110 animate-[slowZoom_14s_linear_infinite]"
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* LEFT ARROW */}
//       <button className="hero-prev hidden text-3xl md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 transition">
//         ‹
//       </button>

//       {/* RIGHT ARROW */}
//       <button className="hero-next hidden md:flex text-3xl absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 transition">
//         ›
//       </button>

//       {/* SLIDE COUNT */}
//       <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
//         {activeIndex} / {slides.length}
//       </div>

//       {/* PAGINATION DOTS */}
//       <div className="hero-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2" />

//       {/* GRADIENT OVERLAY */}
//       <div className="
// absolute inset-0
// bg-gradient-to-t
// from-black/90
// via-black/30
// to-black/10
// z-10
// "/>

//       {/* BOTTOM FADE */}
//       <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-10" />

//       <div className="
// absolute
// bottom-8
// left-1/2
// -translate-x-1/2
// z-30
// w-[92%]
// max-w-6xl
// ">
//   <div className="
//   bg-white/10
//   backdrop-blur-2xl
//   border border-white/20
//   rounded-[32px]
//   p-6
//   shadow-[0_20px_80px_rgba(0,0,0,0.45)]
//   text-white
//   ">

//     <div className="flex justify-between flex-wrap gap-6">

//       <div>
//         <p className="text-xs uppercase tracking-[4px] text-white/70">
//           Premium Property
//         </p>

//         <h1 className="text-3xl md:text-5xl font-black mt-2">
//           {property?.title}
//         </h1>

//         <p className="mt-3 text-white/80">
//           📍 {property?.city}, {property?.state}
//         </p>
//       </div>

//       <div className="text-right">
//         <p className="text-white/60 text-xs">
//           Starting Price
//         </p>

//         <h2 className="text-4xl md:text-6xl font-black mt-2">
//           ₹ {property?.priceLabel}
//         </h2>
//       </div>

//     </div>

//   </div>
// </div>
//     </div>
//   );
// }

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
      <Swiper
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
                scale-110
                animate-[slowZoom_14s_linear_infinite]
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