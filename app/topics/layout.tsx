import AppSideBar from "@/components/AppSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function TopicsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <AppSideBar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </SidebarProvider>
    );
}
