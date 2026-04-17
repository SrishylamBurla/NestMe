"use client";

import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
        });

        const text = await res.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = { message: "Server error" };
        }

        setMsg(data.message);
    };

    return (
        <AuthLayout title="Forgot Password">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {msg && (
                    <p className="text-sm text-green-500 text-center">{msg}</p>
                )}

                <Button>Send Reset Link</Button>
            </form>
        </AuthLayout>
    );
}