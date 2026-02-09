'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Dashboard, StudyPlansList, CoursesList } from "@/components/Pages";
import { CreateStudyPlan } from "@/components/CreateStudyPlan";
import { CreateCourse } from "@/components/CreateCourse";
import { useAuth } from "@/lib/auth-context";

export default function HomeClient() {
    const [activePage, setActivePage] = useState("dashboard");
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-4 text-sm text-zinc-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen w-full bg-white text-zinc-950 overflow-hidden">
            {/* Sidebar */}
            <Sidebar activePage={activePage} setActivePage={setActivePage} />

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden">
                {/* Header Breadcrumb */}
                <Breadcrumb activePage={activePage} />

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6 bg-zinc-50/50">
                    {activePage === "dashboard" && <Dashboard />}
                    {activePage === "create-study-plan" && <CreateStudyPlan />}
                    {activePage === "create-course" && <CreateCourse />}
                    {activePage === "study-plan" && <StudyPlansList />}
                    {activePage === "courses" && <CoursesList />}
                </div>
            </main>
        </div>
    );
}
