'use client'
import { useState } from "react";
import AuthButton from "../components/AuthButton";
import { login } from "../actions";
import { redirect } from "next/navigation";

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await login(formData);

        if (result.status === 'success') {
            redirect('/');
        } else {
            setError(result.status);
        }

        setLoading(false);
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
                        className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        name="password"
                        className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
                    />
                </div>

                <div className="mt-4">
                    <AuthButton type="Login" loading={loading} />
                </div>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
}