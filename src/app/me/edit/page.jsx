"use client";

import { useState, useEffect } from "react";
import { useGetMeQuery } from "@/store/services/authApi";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/store/services/userApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();

  const { data: user } = useGetMeQuery();

  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  const [changePassword, { isLoading: changing }] = useChangePasswordMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
  if (!user) return;
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setForm((prev) => {
    // ✅ prevent repeated updates
    if (
      prev.name === user.name &&
      prev.email === user.email &&
      prev.phone === user.phone
    ) {
      return prev;
    }

    return {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    };
  });
}, [user]);

  /* ---------- Update profile ---------- */

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return toast.error("Name is required");
    }

    const toastId = toast.loading("Updating profile...");

    try {
      await updateProfile(form).unwrap();

      toast.success("Profile updated successfully", {
        id: toastId,
      });

      router.back();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed", {
        id: toastId,
      });
    }
  };

  /* ---------- Change password ---------- */

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.oldPassword) return toast.error("Enter current password");

    if (passwordForm.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return toast.error("Passwords do not match");

    const toastId = toast.loading("Changing password...");

    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();

      toast.success("Password changed successfully", {
        id: toastId,
      });

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Password change failed", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>

      <div className="px-4 py-6 space-y-8 max-w-xl mx-auto">
        {/* ========= PERSONAL INFO ========= */}

        <form
          onSubmit={handleProfileSubmit}
          className="bg-slate-800 rounded-3xl p-6 shadow-lg space-y-5"
        >
          <h2 className="text-lg font-semibold">Personal Information</h2>

          <Input
            label="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Input
            label="Email Address"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          <button
            disabled={updating}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold transition shadow-lg disabled:opacity-60"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* ========= CHANGE PASSWORD ========= */}

        <form
          onSubmit={handlePasswordSubmit}
          className="bg-slate-800 rounded-3xl p-6 shadow-lg space-y-5"
        >
          <h2 className="text-lg font-semibold">Change Password</h2>

          <PasswordInput
            label="Current Password"
            value={passwordForm.oldPassword}
            onChange={(v) =>
              setPasswordForm({
                ...passwordForm,
                oldPassword: v,
              })
            }
          />

          <PasswordInput
            label="New Password"
            value={passwordForm.newPassword}
            onChange={(v) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: v,
              })
            }
          />

          <PasswordInput
            label="Confirm Password"
            value={passwordForm.confirmPassword}
            onChange={(v) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: v,
              })
            }
          />

          <button
            disabled={changing}
            className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-semibold transition shadow-lg disabled:opacity-60"
          >
            {changing ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===== REUSABLE INPUTS ===== */

function Input({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-slate-400">{label}</p>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-slate-700 border border-white/5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
      />
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-slate-400">{label}</p>

      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-slate-700 border border-white/5 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none"
      />
    </div>
  );
}
