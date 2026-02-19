"use client";

import { useRegisterMutation } from "@/store/services/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      router.push("/");
    } catch (err) {
      console.error("REGISTER FAILED", err);
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={submitHandler} className="space-y-4">
        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

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
            {error?.data?.message || "Registration failed"}
          </p>
        )}

        <Button disabled={isLoading}>
          {isLoading ? "Creating..." : "Register"}
        </Button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="font-semibold text-black cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </AuthLayout>
  );
}
