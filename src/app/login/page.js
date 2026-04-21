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

  const [isMobileApp, setIsMobileApp] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      setIsMobileApp(true);

      // 🔥 AUTO TRIGGER GOOGLE LOGIN IN MOBILE
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "GOOGLE_LOGIN" })
      );
    }
  }, []);

  // const isMobileApp =
  //   typeof window !== "undefined" && window.ReactNativeWebView;
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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);



  const inputsRef = useRef([]);
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

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
      setOtpSent(true); // 🔥 mark as sent
    } catch (err) {
      console.error("OTP ERROR:", err);
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    try {
      const finalCode = otp.join("");
      const result = await confirm.confirm(finalCode);

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
  useEffect(() => {
    if (otp.every((d) => d !== "")) {
      verifyOtp();
    }
  }, [otp]);
useEffect(() => {
  if (otpSent) {
    setTimeout(() => setOtpSent(false), 30000); // enable after 30s
  }
}, [otpSent]);
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

        {error && (<p className="text-sm text-red-400 text-center"> {error?.data?.message || "Invalid credentials"} </p>)}

        {/* GOOGLE LOGIN */}
        {!isMobileApp && (
          <>
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
          </>
        )}

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
              disabled={otpSent}
              className={`w-full h-11 rounded-xl font-semibold transition ${otpSent
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-white text-black hover:scale-[1.02]"
                }`}
            >
              {otpSent ? "OTP Sent ✓" : "Send OTP / Resend"}
            </button>

            <div id="recaptcha" className="hidden"></div>

            <div className="flex justify-center gap-3 mt-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="
        w-12 h-12
        text-center text-lg font-semibold
        rounded-xl
        bg-white/10
        border border-white/20
        text-white
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        transition
      "
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full h-11 rounded-xl bg-black text-white font-semibold"
            >
              Verify & Continue
            </button>

            <div>
              <p className="text-center text-xs text-white/60 pt-2">
                New here? Just continue
              </p><p className="text-center text-xs text-white/60 pt-2">
                We’ll create your account automatically.
              </p>
            </div>
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


      </div>
      {/* </div> */}
    </AuthLayout>
  );
}