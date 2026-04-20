"use client";

import { useLoginMutation } from "@/store/services/authApi";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { authApi } from "@/store/services/authApi";

import { auth } from "@/lib/firebase";
 import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { initAuth } from "@/lib/firebase";



export default function LoginPage() {
  useEffect(() => {
  initAuth();
}, []);
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [phone, setPhone] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [mode, setMode] = useState("email");
  const [code, setCode] = useState("");
  

  // ================= EMAIL LOGIN =================
  const submitHandler = async (e) => {
  e.preventDefault();

  try {
    const data = await login({
      email: form.email.trim(),
      password: form.password,
    }).unwrap();

    dispatch(authApi.util.resetApiState()); // 🔥 refresh user
    router.push("/");
  } catch (err) {
    console.error(err);
  }
};

  // ================= SEND OTP =================
  const sendOtp = async () => {
    try {
      if (!phone) return alert("Enter phone");

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        window.recaptchaVerifier
      );

      setConfirm(confirmation);
    } catch (err) {
      console.error("OTP ERROR:", err);
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
  try {
    const result = await confirm.confirm(code);

    const phone = result.user.phoneNumber.replace(/\D/g, "").slice(-10);

    const savedEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("google_email")
        : null;

    const res = await fetch("/api/auth/phone-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        phone,
        email: savedEmail || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    localStorage.removeItem("google_email");

    dispatch(authApi.util.resetApiState()); // 🔥 IMPORTANT
    router.push("/");
  } catch (err) {
    console.error(err);
  }
};

  // ================= GOOGLE LOGIN =================
const googleLogin = async () => {
  try {
    // const isApp =
    //   typeof window !== "undefined" &&
    //   window.ReactNativeWebView;

    // 📱 MOBILE → redirect to backend
    // if (isApp) {
    //   window.location.href = "https://nestme.in/api/auth/google";
    //   return;
    // }

    // 🌐 WEB → Firebase login
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 🔥 REDIRECT instead of fetch
    window.location.href = `/api/auth/google-login?email=${user.email}&name=${user.displayName}&image=${user.photoURL}`;

  } catch (err) {
    console.error(err);
  }
};
  // ================= RECAPTCHA =================
  useEffect(() => {
    if (mode !== "phone") return;

    setTimeout(() => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha",
        { size: "invisible" }
      );
    }, 500);
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
          className={`flex-1 py-2 rounded ${mode === "email"
            ? "bg-indigo-600 text-white"
            : "bg-gray-700"
            }`}
        >
          Email
        </button>
        <button
          onClick={() => setMode("phone")}
          className={`flex-1 py-2 rounded ${mode === "phone"
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
            value={code}
            onChange={(e) => setCode(e.target.value)}
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