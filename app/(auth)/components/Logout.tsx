'use client'
import { useState } from "react";

export default function Logout() {
    const [loading, setLoading] = useState<boolean>();

    const handleLogout = async () => {
        setLoading(true);

        // implment handle logout

        setLoading(false);
    }

    return (
        <div>
            <button onClick={handleLogout}>
                {loading ? 'Signing out...' : 'Sign out'}
            </button>
        </div>
    );
}