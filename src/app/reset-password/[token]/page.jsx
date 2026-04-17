"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("Password updated successfully");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMsg(data.message);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {msg && (
          <p className="text-sm text-center text-green-500">{msg}</p>
        )}

        <Button>Update Password</Button>
      </form>
    </AuthLayout>
  );
}