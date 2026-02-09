"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Dashboard, StudyPlansList, CoursesList } from "@/components/Pages";
import { CreateStudyPlan } from "@/components/CreateStudyPlan";
import { CreateCourse } from "@/components/CreateCourse";

export default function Home() {
    const [activePage, setActivePage] = useState("dashboard");

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
