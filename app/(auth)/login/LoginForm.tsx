'use client'
import { useState } from "react";
import AuthButton from "../components/AuthButton";

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        // implment submit logic here

        setLoading(false);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="w-full flex flex-col gap-4">
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
                    <label>
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

                <div>
                    <AuthButton type="Login" loading={loading} />
                </div>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}