'use client'
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function DynamicBreadcrumbs() {
    const pathname = usePathname()
    const [pageTitle, setPageTitle] = useState<string>('')
    const [pathSegments, setPathSegments] = useState<Array<{ name: string; path: string }>>([])

    useEffect(() => {
        const h1Element = document.querySelector('h1')
        const h1Text = h1Element?.textContent || ''
        setPageTitle(h1Text)

        // Create path segments for breadcrumb
        const segments = pathname
            .split('/')
            .filter(Boolean)
            .map((segment, index, array) => {
                // Create path up to this segment
                const path = '/' + array.slice(0, index + 1).join('/')

                // Format the segment name (convert kebab-case to Title Case)
                const formattedName = segment
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')

                return {
                    name: formattedName,
                    path
                }
            })

        setPathSegments(segments)
    }, [pathname])

    if (pathSegments.length > 0 && pageTitle) {
        pathSegments[pathSegments.length - 1].name = pageTitle
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">
                            <span>Home</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {pathSegments.map((segment, index) => (
                    <BreadcrumbItem key={segment.path}>
                        <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0 text-muted-foreground" aria-hidden="true" />

                        {index === pathSegments.length - 1 ? (
                            <BreadcrumbPage>{segment.name}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink asChild>
                                <Link href={segment.path}>{segment.name}</Link>
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}