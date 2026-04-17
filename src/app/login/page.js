"use client";

import { useLoginMutation } from "@/store/services/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect, useRef } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";

import { auth } from "@/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const recaptchaRef = useRef(null);
  const [login, { isLoading, error }] = useLoginMutation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [mode, setMode] = useState("email");

  // ================= EMAIL LOGIN =================
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = await login({
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      sendToApp(data.id);
      router.push("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
    }
  };

  // ================= SEND OTP =================
 const sendOtp = async () => {
  console.log("OTP CLICKED");

  try {
    if (!phone) return alert("Enter phone");

    const appVerifier = window.recaptchaVerifier;

    if (!appVerifier) {
      return alert("Recaptcha not ready");
    }

    const confirmation = await signInWithPhoneNumber(
      auth,
      "+91" + phone,
      appVerifier
    );

    setConfirm(confirmation);
    console.log("OTP SENT");
  } catch (err) {
    console.error("OTP ERROR:", err);
    alert(err.message);
  }
};
  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    try {
      if (!confirm) return alert("Send OTP first");
      if (!otp) return alert("Enter OTP");

      const result = await confirm.confirm(otp);
      const user = result.user;

      const res = await fetch("/api/auth/phone-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 important
        body: JSON.stringify({ phone: user.phoneNumber }),
      });

      if (!res.ok) throw new Error("Phone login failed");

      const data = await res.json();

      sendToApp(data.id);
      router.push("/");
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err);
      alert(err.message);
    }
  };

  // ================= GOOGLE LOGIN =================
  const googleLogin = async () => {
    console.log("GOOGLE CLICKED");

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 important
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          image: user.photoURL,
        }),
      });

      if (!res.ok) throw new Error("Google backend failed");

      const data = await res.json();

      sendToApp(data.id);
      router.push("/");
    } catch (err) {
      console.error("GOOGLE ERROR:", err);
      alert(err.message);
    }
  };

  // ================= MOBILE SYNC =================
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

useEffect(() => {
  if (mode !== "phone") return;
  if (typeof window === "undefined") return;

  if (!window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha",
        {
          size: "invisible",
        },
        auth
      );

      window.recaptchaVerifier.render();
      console.log("✅ Recaptcha initialized");
    } catch (err) {
      console.error("Recaptcha init error:", err);
    }
  }
}, [mode]);

  return (
    <AuthLayout
      title="Welcome Back"
      quote="Your next home is just a search away."
    >
      {/* TOGGLE */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("email")}
          className={`flex-1 py-2 rounded ${
            mode === "email"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700"
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setMode("phone")}
          className={`flex-1 py-2 rounded ${
            mode === "phone"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700"
          }`}
        >
          Phone
        </button>
      </div>

      {/* EMAIL */}
      {mode === "email" && (
        <form onSubmit={submitHandler} className="space-y-4">
          <Input
            label="Email"
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
              {error?.data?.message || "Invalid credentials"}
            </p>
          )}

          <p
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-right text-indigo-400 cursor-pointer"
          >
            Forgot Password?
          </p>

          <Button disabled={isLoading}>
            {isLoading ? "Signing In..." : "Login"}
          </Button>
        </form>
      )}

      {/* PHONE */}
      {mode === "phone" && (
        <div className="space-y-4">
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={sendOtp}
            className="w-full h-11 bg-black text-white rounded-lg font-bold"
          >
            Send OTP
          </button>

          <div id="recaptcha"></div>

          <Input
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOtp}
            className="w-full h-11 bg-black text-white rounded-lg font-bold"
          >
            Verify OTP
          </button>
        </div>
      )}

      {/* GOOGLE */}
      <div className="mt-6">
        <button
          onClick={googleLogin}
          className="w-full h-11 bg-black text-white rounded-lg font-bold"
        >
          Continue with Google
        </button>
      </div>

      {/* REGISTER */}
      <p className="text-sm text-center text-white/60 mt-4">
        Don’t have an account?{" "}
        <span
          className="text-indigo-400 cursor-pointer"
          onClick={() => router.push("/register")}
        >
          Register
        </span>
      </p>
    </AuthLayout>
  );
}