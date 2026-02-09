"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Globe,
    ChevronDown,
    ChevronsUpDown,
    Command,
    Sparkles,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import TokenUsage from "./TokenUsage";

export const Sidebar = () => {
    const [language, setLanguage] = useState("English");
    const [openGroups, setOpenGroups] = useState<string[]>(["create-ai"]);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Navigation structure
    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        {
            name: "Create with AI",
            id: "create-ai",
            icon: Sparkles,
            items: [
                { name: "Study Plans", href: "/create-study-plan", icon: BookOpen },
                { name: "Courses", href: "/create-course", icon: GraduationCap },
            ]
        },
        { name: "Study Plans", href: "/study-plans", icon: BookOpen },
        { name: "Courses", href: "/courses", icon: GraduationCap },
    ];

    const toggleGroup = (id: string) => {
        setOpenGroups(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getUserInitials = (name?: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <aside className="hidden w-[240px] flex-col border-r border-zinc-200 bg-white md:flex">
            {/* Sidebar Header */}
            <div className="h-14 flex items-center border-b border-zinc-200 px-4">
                <div className="flex items-center gap-2 font-semibold">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-white">
                        <Command className="size-4" />
                    </div>
                    <span>Acme Inc</span>
                </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-auto py-4">
                {/* Language Selection */}
                <div className="px-3 mb-6">
                    <label className="mb-2 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Language
                    </label>
                    <button
                        className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-zinc-50 focus-visible:ring-1 focus-visible:ring-zinc-950"
                    >
                        <div className="flex items-center gap-2 truncate">
                            <Globe className="size-4 text-zinc-500" />
                            <span className="font-medium text-zinc-900">{language}</span>
                        </div>
                        <ChevronDown className="size-4 opacity-50" />
                    </button>
                </div>

                {/* Navigation Group */}
                <nav className="grid gap-1 px-2">
                    <label className="mb-2 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Platform
                    </label>
                    {navigation.map((item) => (
                        item.items ? (
                            <div key={item.id} className="grid gap-1">
                                <button
                                    onClick={() => toggleGroup(item.id)}
                                    className={cn(
                                        "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all text-zinc-500"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon className="size-4" />
                                        {item.name}
                                    </div>
                                    <ChevronRight className={cn("size-4 transition-transform duration-200", openGroups.includes(item.id) && "rotate-90")} />
                                </button>
                                {openGroups.includes(item.id) && (
                                    <div className="grid gap-1 pl-4 relative">
                                        {item.items.map((sub) => (
                                            <Link
                                                key={sub.href}
                                                href={sub.href}
                                                className={cn(
                                                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                                    pathname === sub.href
                                                        ? "bg-zinc-100 text-zinc-900"
                                                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                                )}
                                            >
                                                <sub.icon className={cn("size-4", pathname === sub.href ? "text-zinc-900" : "text-zinc-500")} />
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all",
                                    pathname === item.href ? "bg-zinc-100 text-zinc-900" : "text-zinc-500"
                                )}
                            >
                                <item.icon className={cn("size-4 text-zinc-500 group-hover:text-zinc-900", pathname === item.href && "text-zinc-900")} />
                                {item.name}
                            </Link>
                        )
                    ))}
                </nav>
            </div>

            {/* Token Usage Display */}
            <div className="px-3 pb-3">
                <TokenUsage />
            </div>

            {/* Sidebar Footer (User) */}
            <div className="border-t border-zinc-200 p-2">
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-zinc-100 transition-colors group"
                    >
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                            <span className="font-semibold text-xs text-zinc-600">
                                {user ? getUserInitials(user.name) : 'U'}
                            </span>
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold text-zinc-900">
                                {user?.name || 'Guest'}
                            </span>
                            <span className="truncate text-xs text-zinc-500">
                                {user?.email || ''}
                            </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 text-zinc-500 group-hover:text-zinc-900" />
                    </button>
                    {showUserMenu && (
                        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                            >
                                <LogOut className="size-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};