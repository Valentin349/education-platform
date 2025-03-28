import { SidebarMenuButton } from "../ui/sidebar";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { NavUser } from "./nav-user";

export default async function SideBarAuth() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();


    if (data.user) {
        const user = {
            name: data.user.user_metadata.username,
            email: data.user.user_metadata.email,
            avatar: "/avatars/shadcn.jpg",
        }

        return (
            <NavUser user={user}/>
        )
    }

    return (
        <SidebarMenuButton asChild>
            <Link href={'/login'}>
                <LogIn className="mr-2 h-6 w-6" />
                <span>Sign in</span>
            </Link>
        </SidebarMenuButton>
    );
}