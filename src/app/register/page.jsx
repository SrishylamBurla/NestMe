"use client";

import { useRegisterMutation } from "@/store/services/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";

// 🔥 Firebase
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // =========================
  // 📧 EMAIL REGISTER
  // =========================
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      sendToApp(data.id);
      router.push("/");
    } catch (err) {
      console.error("REGISTER FAILED", err);
    }
  };

  // =========================
  // 🔵 GOOGLE REGISTER
  // =========================
  const googleRegister = async () => {
    try {
      setLoadingGoogle(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          image: user.photoURL,
        }),
      });

      const data = await res.json();

      sendToApp(data.id);
      router.push("/");
    } catch (err) {
      console.error("Google register error:", err);
      alert("Google signup failed");
    } finally {
      setLoadingGoogle(false);
    }
  };

  // =========================
  // 📲 MOBILE SYNC
  // =========================
  const sendToApp = (userId) => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "USER_DATA",
          userId,
        })
      );
    }
  };

  return (
    <AuthLayout
      title="Create Your Nest"
      quote="Find the place where your story begins."
    >
      <form onSubmit={submitHandler} className="space-y-4">
        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Input
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {error && (
          <p className="text-sm text-red-400 text-center">
            {error?.data?.message || "Registration failed"}
          </p>
        )}

        <Button disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* 🔵 GOOGLE SIGNUP */}
      <div className="mt-6">
        <Button onClick={googleRegister} disabled={loadingGoogle}>
          {loadingGoogle
            ? "Signing up..."
            : "Continue with Google"}
        </Button>
      </div>

      {/* LOGIN */}
      <p className="text-sm text-center text-white/60 mt-4">
        Already have an account?{" "}
        <span
          className="font-semibold text-indigo-400 cursor-pointer hover:underline"
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>
    </AuthLayout>
  );
}