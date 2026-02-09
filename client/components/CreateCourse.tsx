"use client";

import { AICreationForm } from "./AICreationForm";

export const CreateCourse = () => (
    <div className="flex flex-1 flex-col items-center justify-center p-4 py-12">
        <AICreationForm
            title="Create Course"
            description="Build a comprehensive course structure with modules and lessons."
            placeholder="e.g. Introduction to Pottery and Ceramics"
            buttonText="Generate Course"
            onSubmit={(data) => console.log("Creating Course:", data)}
        />
    </div>
);
