"use client";

import { useLoginMutation } from "@/store/services/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const [form, setForm] = useState({ email: "", password: "" });

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      router.push("/");
    } catch (err) {
      // handled by error UI
      console.error("LOGIN FAILED", err);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
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
          <p className="text-sm text-red-600">
            {error?.data?.message || "Invalid email or password"}
          </p>
        )}

        <Button disabled={isLoading}>
          {isLoading ? "Signing in..." : "Login"}
        </Button>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <span
            className="font-semibold text-black cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </AuthLayout>
  );
}
