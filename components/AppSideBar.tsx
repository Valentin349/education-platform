import { LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { logout } from "@/app/(auth)/actions";

export default function AppSideBar() {
    return (
        <Sidebar>
            <SidebarContent />
            <SidebarFooter>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <button
                            onClick={logout}
                        >
                            <LogOut className="mr-2 h-6 w-6" />
                            <span>Sign out</span>
                        </button>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    );
}