import { BookOpen } from "lucide-react"
import { SidebarMainLinks } from "@/components/sidebar/SidebarMainLinks"
import SideBarAuth from "./SideBarAuth"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
} from "@/components/ui/sidebar"


// This is sample data.
const data = {
    navLinks: [
        {
            name: "All Topics",
            url: "/topics",
            icon: BookOpen,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarContent>
                <SidebarMainLinks items={data.navLinks} />
            </SidebarContent>
            <SidebarFooter>
                <SideBarAuth />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
