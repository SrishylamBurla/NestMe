
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

import {
  useGetPropertyByIdQuery,
  useGetSimilarPropertiesQuery,
  useGetReviewsQuery,
  useAddReviewMutation
} from "@/store/services/PropertiesApi";

import { useToggleSavePropertyMutation } from "@/store/services/savedApi";

import PropertyHero from "@/components/PropertyHero";
import PropertyOverview from "@/components/PropertyOverview";
import PropertyAmenities from "@/components/PropertyAmenities";
import PropertyLocation from "@/components/PropertyLocation";
import PropertyAgent from "@/components/PropertyAgent";
import SimilarProperties from "@/components/SimilarProperties";
import { ChevronLeft, Share } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";


export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [toggleSaved] = useToggleSavePropertyMutation();
  // const [isSaved, setIsSaved] = useState(false);

  const [reviewModal, setReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [addReview] = useAddReviewMutation();
  const { data: property, isLoading, isError } = useGetPropertyByIdQuery(id);

  const { data: similar } = useGetSimilarPropertiesQuery(
    property ? { city: property.city, excludeId: property._id } : skipToken,
  );

  const { data: PropertyReviews } = useGetReviewsQuery(
    property ? property._id : skipToken,
  );

  const reviews = PropertyReviews?.reviews || [];

  const { user } = useAuth();


  const alreadyReviewed = reviews.some(
    review =>
      review.user._id === user?._id
  );

  const submitReview = async () => {
    try {
      await addReview({
        id: property._id,
        body: {
          rating,
          comment
        }
      }).unwrap();
      toast.success("Review Added");
      setComment("");
      setRating(5);
      setReviewModal(false);
    }
    catch {
      toast.error("Failed to submit review");
    }
  }
  const isSaved = property?.isSaved;
  const handleFavorite = async () => {
    try {
      await toggleSaved(property._id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/properties/${property._id}`;

    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: "Check out this property",
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard");
    }
  };


  const averageRating = reviews.length
    ? (
      reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      ) / reviews.length
    ).toFixed(1)
    : 0;


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading property…
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Property not found
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f6f8fc] overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}

      <section className="relative">

        {/* HERO */}
        <PropertyHero
          property={property}
          images={property.images}
        />

        {/* DARK TOP OVERLAY */}
        <div
          className="
        absolute
        inset-0
        bg-gradient-to-b
        from-black/30
        via-transparent
        to-transparent
        z-20
        pointer-events-none
        "
        />

        {/* ================= TOP NAV ================= */}

        <div
          className="
        fixed
        top-2
        left-0
        w-full
        z-[100]
        "
        >
          <div
            className="
          flex
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-10
          mobile-safe-top
          "
          >
            {/* LEFT */}
            <button
              onClick={() => router.back()}
              className="
            w-11 h-11
            rounded-full
            bg-white/80
            backdrop-blur-2xl
            shadow-[0_10px_30px_rgba(0,0,0,0.15)]
            border border-white/40
            flex items-center justify-center
            hover:scale-105
            active:scale-95
            transition-all
            duration-300
            "
            >
              <ChevronLeft className="w-5 h-5 text-slate-900" />
            </button>

            {/* RIGHT */}
            <div className="flex items-center gap-3">



              {/* FAVORITE */}
              <button
                onClick={handleFavorite}
                className="
              w-11 h-11
              rounded-full
              bg-white/80
              backdrop-blur-2xl
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
              border border-white/40
              flex items-center justify-center
              hover:scale-105
              active:scale-95
              transition-all
              duration-300
              "
              >
                <span
                  className={`
                material-symbols-outlined
                transition-all
                duration-300
                ${isSaved
                      ? "text-red-500 scale-110"
                      : "text-slate-900"
                    }
                `}
                  style={{
                    fontVariationSettings:
                      isSaved
                        ? "'FILL' 1"
                        : "'FILL' 0",
                  }}
                >
                  favorite
                </span>
              </button>
              {/* SHARE */}
              <button
                onClick={handleShare}
                className="
              w-11 h-11
              rounded-full
              bg-white/80
              backdrop-blur-2xl
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
              border border-white/40
              flex items-center justify-center
              hover:scale-105
              active:scale-95
              transition-all
              duration-300
              "
              >
                <Share className="w-5 h-5 text-slate-900" />
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <main
        className="
      relative
      z-40
      -mt-20
      sm:-mt-24
      lg:-mt-28
      "
      >
        <div
          className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        xl:px-10
        "
        >
          {/* ================= GRID ================= */}

          <div
            className="
          grid
          grid-cols-1
          xl:grid-cols-[1fr_360px]
          gap-6
          lg:gap-8
          "
          >
            {/* ================= LEFT CONTENT ================= */}

            <div className="space-y-6 lg:space-y-8">

              {/* OVERVIEW */}
              <section
                className="
              rounded-[32px]
              overflow-hidden
              "
              >
                <PropertyOverview
                  property={property}
                />
              </section>

              {/* AMENITIES */}
              <section
                className="
              bg-white
              rounded-[32px]
              border border-slate-200
              shadow-sm
              p-5
              sm:p-6
              lg:p-8
              "
              >
                <PropertyAmenities
                  amenities={
                    property.amenities
                  }
                />
              </section>


              {/* LOCATION */}
              <section
                className="
              bg-white
              rounded-[32px]
              border border-slate-200
              shadow-sm
              overflow-hidden
              "
              >
                <PropertyLocation
                  location={
                    property.location
                  }
                />
              </section>


              {/* ABOUT PROPERTY */}
              <section
                className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 lg:p-8"
              >
                <h2 className="text-2xl font-bold mb-5">
                  About this property
                </h2>
                <p className="text-slate-600 leading-8">
                  {property.description}
                </p>
              </section>

              <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 lg:p-8">

                {/* Header */}

                <div className="flex items-center justify-between mb-8">

                  <div>

                    <h2 className="text-2xl font-bold">
                      Reviews & Ratings
                    </h2>

                    <p className="text-slate-500 mt-1">
                      See what buyers and tenants think
                    </p>

                  </div>

                  <button
                    disabled={alreadyReviewed}
                    onClick={() => setReviewModal(true)}
                    className={`
        px-5 py-3 rounded-xl font-medium transition
        ${alreadyReviewed
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-slate-900 text-white hover:bg-black"}
    `} >

                    {alreadyReviewed
                      ? "Already Reviewed"
                      : "Write Review"}

                  </button>


                </div>




                {/* Rating Summary */}


                <div className="grid md:grid-cols-2 gap-8 mb-10">


                  <div>

                    <h1 className="text-6xl font-bold">

                      {averageRating || 0}

                    </h1>


                    <div className="flex mt-2">

                      {[1, 2, 3, 4, 5].map(i => (

                        <span
                          key={i}
                          className="text-yellow-400 text-xl"
                        >

                          ★

                        </span>

                      ))}

                    </div>



                    <p className="text-slate-500 mt-2">

                      {reviews.length}{" "}

                      reviews

                    </p>



                  </div>




                  <div>

                    {[5, 4, 3, 2, 1].map(star => (


                      <div
                        key={star}
                        className="flex items-center gap-3 mb-2"
                      >

                        <span>

                          {star}

                          ★

                        </span>


                        <div className="flex-1 bg-slate-100 rounded-full h-2">

                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: '60%'
                            }}
                          />

                        </div>


                      </div>

                    ))}

                  </div>


                </div>




                {/* Reviews */}



                <div className="space-y-5">


                  {

                    reviews.map((review) => (



                      <div

                        key={review._id}

                        className="
border
border-slate-200
rounded-3xl
p-5
"

                      >



                        <div className="flex justify-between">


                          <div className="flex gap-4">


                            <div
                              className="
w-12
h-12
rounded-full
bg-indigo-100
text-indigo-700
font-semibold
flex
items-center
justify-center
"
                            >

                              {review.user?.name?.charAt(0)}

                            </div>



                            <div>


                              <h3 className="font-semibold">

                                {review.user?.name}

                              </h3>


                              <p className="text-sm text-slate-500">

                                {

                                  new Date(

                                    review.createdAt

                                  ).toLocaleDateString()

                                }

                              </p>


                            </div>


                          </div>





                          <div className="flex">


                            {

                              [1, 2, 3, 4, 5].map(i => (


                                <span

                                  key={i}

                                  className={

                                    i <= review.rating

                                      ?

                                      "text-yellow-400"

                                      :

                                      "text-slate-300"

                                  }

                                >

                                  ★

                                </span>

                              ))

                            }


                          </div>


                        </div>




                        <p className="mt-4 text-slate-600 leading-7">

                          {review.comment}

                        </p>



                      </div>



                    ))


                  }



                </div>



              </section>

              {
                reviewModal && (

                  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">


                    <div className="bg-white rounded-3xl p-7 w-full max-w-lg">


                      <h2 className="text-2xl font-bold">

                        Write a Review

                      </h2>



                      <p className="text-slate-500 mt-2">

                        Share your experience


                      </p>




                      <div className="flex gap-2 my-6">


                        {

                          [1, 2, 3, 4, 5].map(i => (


                            <button

                              key={i}

                              onClick={() => setRating(i)}

                              className={

                                rating >= i

                                  ?

                                  "text-yellow-400"

                                  :

                                  "text-slate-300"

                              }

                            >

                              ★

                            </button>

                          ))

                        }


                      </div>




                      <textarea


                        rows={5}


                        value={comment}


                        onChange={(e) =>

                          setComment(

                            e.target.value

                          )

                        }


                        placeholder="Describe your experience..."


                        className="
w-full
border
rounded-2xl
p-4
resize-none
outline-none
"


                      />





                      <div className="flex gap-3 mt-6">


                        <button

                          onClick={() => setReviewModal(false)}

                          className="
flex-1
py-3
rounded-xl
border
"
                        >

                          Cancel


                        </button>



                        <button

                          onClick={submitReview}

                          className="
flex-1
py-3
rounded-xl
bg-slate-900
text-white
"
                        >

                          Submit


                        </button>



                      </div>


                    </div>


                  </div>

                )
              }
              {/* SIMILAR */}
              {similar?.properties
                ?.length > 0 && (
                  <section
                    className="
                bg-white
                rounded-[32px]
                border border-slate-200
                shadow-sm
                p-5
                sm:p-6
                "
                  >
                    <SimilarProperties
                      properties={
                        similar.properties
                      }
                    />
                  </section>
                )}
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}

            <aside
              className="
            xl:sticky
            xl:top-24
            h-fit
            "
            >
              <div
                className="
              bg-white
              rounded-[32px]
              border border-slate-200
              shadow-sm
              p-5
              sm:p-6
              "
              >
                <PropertyAgent
                  property={property}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ================= BOTTOM SPACING ================= */}

      <div className="h-20" />
    </div>
  );
}

function ReviewCard({

  name,

  rating,

  comment

}) {

  return (

    <div
      className="
border
border-slate-200
rounded-2xl
p-5
"
    >

      <div className="flex justify-between">


        <h4 className="font-semibold">

          {name}

        </h4>


        <div className="flex gap-1">

          {

            [...Array(5)].map((_, i) => (

              <span

                key={i}

                className={

                  i < rating

                    ?

                    "text-yellow-400"

                    :

                    "text-slate-300"

                }

              >

                ★

              </span>

            ))

          }


        </div>

      </div>



      <p className="mt-3 text-slate-600">

        {comment}

      </p>


    </div>

  )


}