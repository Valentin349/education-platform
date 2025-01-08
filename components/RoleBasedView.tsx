import { getCurrentUser } from "@/lib/mockUsers";

type RoleBasedViewProps = {
    allowedRoles: string[];
    children: React.ReactNode;
}

export default function RoleBasedView({ allowedRoles, children }: RoleBasedViewProps) {
    const user = getCurrentUser();

    if (!allowedRoles.includes(user.role)) {
        return <div>Access Denied</div>;
    }

    return <>{children}</>;
}