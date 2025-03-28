import { SidebarMenuButton } from "./ui/sidebar";
import { LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/server";

export default async function SidebarLogoutButton() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
        return (
            <SidebarMenuButton asChild>
                <button
                    onClick={logout}
                >
                    <LogOut className="mr-2 h-6 w-6" />
                    <span>Sign out</span>
                </button>
            </SidebarMenuButton>
        );
    }
    return null;
}