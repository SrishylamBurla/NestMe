"use client";

import { useLoginMutation } from "@/store/services/authApi";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { authApi } from "@/store/services/authApi";
import { signInWithRedirect } from "firebase/auth";
import { initAuth } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

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
    await initAuth();

    const provider = new GoogleAuthProvider();

    const isMobile = window.ReactNativeWebView;

    if (isMobile) {
      await signInWithRedirect(auth, provider); // ✅ mobile
    } else {
      const result = await signInWithPopup(auth, provider); // ✅ web

      const user = result.user;

      window.location.href = `/api/auth/google-login?email=${user.email}&name=${user.displayName}&image=${user.photoURL}`;
    }

  } catch (err) {
    if (err.code === "auth/popup-closed-by-user") return;

    console.error(err);
  }
};
  // ================= RECAPTCHA =================
  useEffect(() => {
  if (mode !== "phone") return;

  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha",
    { size: "invisible" }
  );
}, [mode]);

  return (
    <AuthLayout>
      {/* <div className="flex items-center justify-center"> */}

        <div className="w-full max-w-md backdrop-blur-2xl rounded-3xl p-6 space-y-6">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">
              Welcome to NestMe
            </h1>
            <p className="text-sm text-white/70">
              Find your next home effortlessly
            </p>
          </div>

          {error && ( <p className="text-sm text-red-400 text-center"> {error?.data?.message || "Invalid credentials"} </p> )}

          {/* GOOGLE LOGIN */}
          <button
            onClick={googleLogin}
            className="w-full h-12 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
          >
            <img src="/icons/google.png" className="w-5 h-5" />
            Continue with Google
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/60 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* TOGGLE */}
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setMode("phone")}
              className={`flex-1 py-2 rounded-lg text-sm ${mode === "phone"
                ? "bg-white text-black font-semibold"
                : "text-white/70"
                }`}
            >
              Phone
            </button>

            <button
              onClick={() => setMode("email")}
              className={`flex-1 py-2 rounded-lg text-sm ${mode === "email"
                ? "bg-white text-black font-semibold"
                : "text-white/70"
                }`}
            >
              Email
            </button>
          </div>

          {/* PHONE */}
          {mode === "phone" && (
            <div className="space-y-3">
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button
                onClick={sendOtp}
                className="w-full h-11 rounded-xl bg-white text-black font-semibold"
              >
                Send OTP
              </button>

              <div id="recaptcha" className="hidden"></div>

              <Input
                label="Enter OTP"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <button
                onClick={verifyOtp}
                className="w-full h-11 rounded-xl bg-black text-white font-semibold"
              >
                Verify & Continue
              </button>
            </div>
          )}

          {/* EMAIL */}
          {mode === "email" && (
            <form onSubmit={submitHandler} className="space-y-3">
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

              <button
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-black text-white font-semibold"
              >
                {isLoading ? "Please wait..." : "login"}
              </button>

              <p
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-right text-white/60 cursor-pointer"
              >
                Forgot Password?
              </p>
              <p className="text-sm text-center text-white/60 mt-4">
                Don’t have an account?{" "}
                <span
                  className="text-indigo-400 cursor-pointer"
                  onClick={() => router.push("/register")}
                >
                  Register
                </span>
              </p>
            </form>
          )}



          {/* FOOTER */}
          <p className="text-center text-xs text-white/60 pt-2">
            New here? Just continue — we’ll create your account automatically.
          </p>

        </div>
      {/* </div> */}
    </AuthLayout>
  );
}