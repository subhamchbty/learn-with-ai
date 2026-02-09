"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
    activePage: string;
}

export const Breadcrumb = ({ activePage }: BreadcrumbProps) => {
    const navigation = [
        { name: "Dashboard", id: "dashboard" },
        {
            name: "Create with AI",
            id: "create-ai",
            items: [
                { name: "Study Plans", id: "create-study-plan" },
                { name: "Courses", id: "create-course" },
            ]
        },
        { name: "Study Plans", id: "study-plan" },
        { name: "Courses", id: "courses" },
    ];

    const getBreadcrumbs = () => {
        for (const item of navigation) {
            if (item.items) {
                const sub = item.items.find(s => s.id === activePage);
                if (sub) return [item.name, sub.name];
            }
            if (item.id === activePage) return [item.name];
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
