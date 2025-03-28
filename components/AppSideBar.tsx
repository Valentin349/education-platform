import { Sidebar, SidebarContent, SidebarFooter, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import SidebarLogoutButton from "./SideBarLogoutButton";

export default function AppSideBar() {
    return (
        <Sidebar>
            <SidebarContent />
            <SidebarFooter>
                <SidebarMenuItem>
                    <SidebarLogoutButton/>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    );
}