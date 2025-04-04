"use client";
import React, { useState } from "react";
import AuthButton from "../components/AuthButton";
import { signup } from "../actions";

export default function SignUpForm() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);


        const formData = new FormData(event.currentTarget);
        const result = await signup(formData);


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
                <p className="text-xl w-full mb-6">
                    Verify your email we sent to finish signup.
                </p>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200">
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        name="username"
                        className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
                    />
                </div>
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
                <div>
                    <label className="block text-sm font-medium text-gray-200">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="password"
                        className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
                    />
                </div>
                <div className="mt-4">
                    <AuthButton type="SignUp" loading={loading} />
                </div>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
};