'use client'
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import React, { Suspense, useEffect, useState } from "react";

function BreadcrumbsContent() {
    const pathName = usePathname();
    const pathSegments = pathName.split('/').filter(Boolean);
    const [titles, setTitles] = useState<Record<string, string>>({});
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);

        const h1Element = document.querySelector("h1");
        if (h1Element) {
            setTitles((prev) => ({
                ...prev,
                [pathSegments[pathSegments.length - 1]]: h1Element.textContent || "Unknown",
            }));
        }
        
    }, [pathName]);

    if (!hydrated) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                    const href = "/" + pathSegments.slice(0, index + 1).join("/");
                    const title = hydrated ? titles[segment] || segment : segment;

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem >
                                <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default function Breadcrumbs() {
    return (
        <Suspense fallback={null}>
            <BreadcrumbsContent />
        </Suspense>
    );
}