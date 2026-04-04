import React from "react";

export default function AboutNestMe() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About NestMe
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Redefining how people discover, connect, and manage real estate in the digital era.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-gray-700 leading-relaxed">

        <p>
          NestMe was born from a simple idea — making property discovery easier,
          smarter, and more accessible for everyone.
        </p>

        <p>
          The platform was built to solve common challenges people face while
          searching for properties — scattered listings, lack of trust, and poor
          user experience. As the vision evolved, iRealEstate transformed into{" "}
          <span className="font-semibold text-gray-900">NestMe</span>, a more
          refined, user-focused, and scalable real estate ecosystem.
        </p>

        <p>
          NestMe is designed to connect{" "}
          <span className="font-semibold text-gray-900">
            buyers, renters, and property agents
          </span>{" "}
          seamlessly in one place. Whether you are searching for your dream home,
          listing a property, or managing leads as an agent, NestMe delivers a
          smooth and intuitive experience.
        </p>

      </div>

      {/* Focus Section */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">

        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            What We Focus On
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Simplicity in property discovery</li>
            <li>• Transparency in listings</li>
            <li>• Efficient communication</li>
            <li>• Smart notifications & updates</li>
          </ul>
        </div>

        <div className="bg-gray-900 text-white rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">
            Our Mission
          </h2>
          <p className="text-gray-300">
            To simplify real estate interactions using technology — making
            property transactions faster, reliable, and user-friendly.
          </p>
        </div>

      </div>

      {/* Closing */}
      <div className="mt-12 text-gray-700 leading-relaxed bg-purple-300 p-2 rounded-xs inline-block">
        <p>
          NestMe is not just an app — it’s a growing platform aimed at
          transforming how people find and manage properties with confidence and
          ease.
        </p>
      </div>

    </section>
  );
}