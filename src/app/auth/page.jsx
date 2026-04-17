"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AuthPage() {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [step, setStep] = useState("input"); // input | password | otp
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState(null);

  // =========================
  // 🔍 DETECT INPUT TYPE
  // =========================
  const isPhone = /^[0-9]{10}$/.test(value);

  // =========================
  // 👉 CONTINUE
  // =========================
  const handleContinue = async () => {
    if (isPhone) {
      // OTP FLOW
      const verifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + value,
        verifier
      );

      setConfirm(confirmation);
      setStep("otp");
    } else {
      // EMAIL FLOW
      const res = await fetch("/api/auth/check-user", {
        method: "POST",
        body: JSON.stringify({ email: value }),
      });

      const data = await res.json();

      if (data.exists) {
        setStep("password");
      } else {
        router.push(`/register?email=${value}`);
      }
    }
  };

  // =========================
  // 🔢 VERIFY OTP
  // =========================
  const verifyOtp = async () => {
    const result = await confirm.confirm(otp);
    const user = result.user;

    const res = await fetch("/api/auth/phone-login", {
      method: "POST",
      body: JSON.stringify({ phone: user.phoneNumber }),
    });

    const data = await res.json();

    sendToApp(data.id);
    router.push("/");
  };

  // =========================
  // 🔵 GOOGLE
  // =========================
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const res = await fetch("/api/auth/google-login", {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
        name: user.displayName,
        image: user.photoURL,
      }),
    });

    const data = await res.json();

    sendToApp(data.id);
    router.push("/");
  };

  // =========================
  // 📲 MOBILE SYNC
  // =========================
  const sendToApp = (userId) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "USER_DATA", userId })
      );
    }
  };

  return (
    <AuthLayout
      title="Welcome to NestMe"
      quote="Find your dream home effortlessly."
    >
      {/* INPUT */}
      {step === "input" && (
        <>
          <Input
            label="Email or Phone"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Button onClick={handleContinue}>
            Continue
          </Button>
        </>
      )}

      {/* PASSWORD */}
      {step === "password" && (
        <>
          <Input label="Password" type="password" />
          <Button>Login</Button>
        </>
      )}

      {/* OTP */}
      {step === "otp" && (
        <>
          <Input
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button onClick={verifyOtp}>
            Verify OTP
          </Button>

          <div id="recaptcha"></div>
        </>
      )}

      {/* GOOGLE */}
      <div className="mt-6">
        <Button onClick={googleLogin}>
          Continue with Google
        </Button>
      </div>
    </AuthLayout>
  );
}