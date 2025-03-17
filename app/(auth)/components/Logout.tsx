'use client'
import { useState } from "react";
import { logout } from "../actions";

export default function Logout() {
    const [loading, setLoading] = useState<boolean>();

    const handleLogout = async () => {
        setLoading(true);

        await logout();

        setLoading(false);
    }

    return (
        <div>
            <button onClick={handleLogout}>
                {loading ? 'Logging out...' : 'Log out'}
            </button>
        </div>
    );
}