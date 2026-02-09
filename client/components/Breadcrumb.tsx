"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const Breadcrumb = () => {
    const pathname = usePathname();

    const navigation = [
        { name: "Dashboard", href: "/dashboard" },
        {
            name: "Create with AI",
            items: [
                { name: "Study Plans", href: "/create-study-plan" },
                { name: "Courses", href: "/create-course" },
            ]
        },
        { name: "Study Plans", href: "/study-plans" },
        { name: "Courses", href: "/courses" },
    ];

    const getBreadcrumbs = () => {
        for (const item of navigation) {
            if (item.items) {
                const sub = item.items.find(s => s.href === pathname);
                if (sub) return [item.name, sub.name];
            }
            if ('href' in item && item.href === pathname) return [item.name];
        }
        return ["Dashboard"];
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="flex h-14 items-center gap-4 border-b border-zinc-200 bg-white px-6">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="hover:text-zinc-900 cursor-pointer">Platform</span>
                {breadcrumbs.map((crumb) => (
                    <React.Fragment key={crumb}>
                        <span className="text-zinc-300">/</span>
                        <span className={cn(crumb === breadcrumbs[breadcrumbs.length - 1] ? "font-medium text-zinc-900" : "")}>{crumb}</span>
                    </React.Fragment>
                ))}
            </div>
        </header>
    );
};
