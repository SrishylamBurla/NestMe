import React from "react";

export default function AboutNestMe() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          About NestMe
        </h1>

        {/* Paragraphs */}
        <p className="text-gray-700 leading-relaxed">
          NestMe was born from a simple idea — making property discovery easier,
          smarter, and more accessible for everyone.
        </p>

        <p className="text-gray-700 leading-relaxed">
          The platform was built to solve common challenges people face while
          searching for properties — scattered listings, lack of trust, and poor
          user experience. As the vision evolved, iRealEstate transformed into{" "}
          <span className="font-semibold text-gray-900">NestMe</span>, a more
          refined, user-focused, and scalable real estate ecosystem.
        </p>

        <p className="text-gray-700 leading-relaxed">
          NestMe is designed to connect{" "}
          <span className="font-semibold">
            buyers, renters, and property agents
          </span>{" "}
          seamlessly in one place. Whether you are searching for your dream home,
          listing a property, or managing leads as an agent, NestMe provides a
          smooth and intuitive experience.
        </p>

        {/* Features List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            What We Focus On
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Simplicity in property discovery</li>
            <li>Transparency in listings</li>
            <li>Efficient communication between users and agents</li>
            <li>Smart notifications and updates</li>
          </ul>
        </div>

        {/* Mission */}
        <p className="text-gray-700 leading-relaxed">
          Our mission is to{" "}
          <span className="font-semibold text-gray-900">
            simplify real estate interactions using technology
          </span>
          , making property transactions faster, reliable, and user-friendly.
        </p>

        {/* Closing */}
        <p className="text-gray-700 leading-relaxed">
          NestMe is not just an app — it’s a growing platform aimed at
          transforming how people find and manage properties in the digital era.
        </p>

      </div>
    </section>
  );
}