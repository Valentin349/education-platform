"use client";
import React, { useState } from "react";
import AuthButton from "../components/AuthButton";
import { forgotPassword } from "../actions";

export default function ForgotPassword() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(event.currentTarget);
        const result = await forgotPassword(formData);

        if (result.status === 'success') {
            setSuccess(true);
        } else {
            setError(result.status);
        }

        setLoading(false);
    };

    if (success) {
        return (
            <div className="w-full flex mt-20 justify-center">
                <p className="text-xl w-full mb-6 text-center">
                    Verify your email we sent to reset your password.
                </p>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Email"
                        id="Email"
                        name="email"
                        className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
                    />
                </div>

                <div className="mt-4">
                    <AuthButton type="Forgot Password" loading={loading} />
                </div>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
};

