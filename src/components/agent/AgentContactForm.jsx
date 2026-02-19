"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useCreateLeadMutation } from "@/store/services/LeadApi";
import toast from "react-hot-toast";

export default function AgentContactForm({ propertyId: propId }) {
  const params = useParams();
  const propertyId = propId || params?.id;

  const [createLead, { isLoading, error }] = useCreateLeadMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!propertyId) {
      toast.error("Property reference missing ❌");
      return;
    }

    const toastId = toast.loading("Sending enquiry...");

    try {
      await createLead({
        propertyId,
        ...form,
      }).unwrap();

      toast.dismiss(toastId);

      toast.success("Enquiry sent successfully 🎉", {
        icon: "🔥",
        style: {
          background: "linear-gradient(to right, #4ade80, #22c55e)",
          color: "white",
        },
      });

      setForm({ name: "", email: "", phone: "", message: "" });

    } catch (err) {
      toast.dismiss(toastId);

      if (err?.status === 401) {
        toast.error("Please login to contact the owner", {
          style: {
            background: "linear-gradient(to right, #f87171, #ef4444)",
            color: "white",
          },
        });
      } else {
        toast.error("Failed to send enquiry. Try again ⚠️", {
          style: {
            background: "linear-gradient(to right, #f59e0b, #f97316)",
            color: "white",
          },
        });
      }
    }
  };


  return (
    <form
      onSubmit={submitHandler}
      className="bg-white rounded-2xl shadow-sm p-5 space-y-4"
    >
      <h3 className="text-lg font-bold">Contact Property Owner</h3>

      <Input
        placeholder="Your Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <Input
        placeholder="Email Address"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <Input
        placeholder="Phone Number"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />

      <textarea
        required
        placeholder="Write your message..."
        className="w-full border rounded-xl p-3 text-sm min-h-[100px]"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-100 p-2 rounded text-center">
          Failed to send enquiry. Try again.
        </p>
      )}

      <button
        disabled={isLoading}
        className="w-full h-11 rounded bg-[#36e27b] text-black font-bold hover:opacity-90 disabled:opacity-60"
      >
        {isLoading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Input(props) {
  return (
    <input {...props} className="w-full h-11 border rounded-xl px-4 text-sm" />
  );
}
