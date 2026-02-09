"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AICreationFormProps {
    placeholder?: string;
    buttonText?: string;
    onSubmit?: (data: { prompt: string; level: string }) => void;
    title?: string;
    description?: string;
    isLoading?: boolean;
}

export const AICreationForm = ({
    placeholder = "Describe what you want to learn...",
    buttonText = "Generate",
    onSubmit,
    title,
    description,
    isLoading = false
}: AICreationFormProps) => {
    const [prompt, setPrompt] = useState("");
    const [level, setLevel] = useState("Beginner");

    const levels = ["Beginner", "Intermediate", "Expert"];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit && !isLoading) onSubmit({ prompt, level });
    };

    return (
        <div className="mx-auto w-full max-w-2xl space-y-8">
            {(title || description) && (
                <div className="space-y-2 text-center">
                    {title && <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h2>}
                    {description && <p className="text-zinc-500">{description}</p>}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">

                {/* Input Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900">
                        Topic or Goal
                    </label>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="flex h-12 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={placeholder}
                    />
                </div>

                {/* Level Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium leading-none text-zinc-900">
                        Experience Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {levels.map((l) => (
                            <button
                                key={l}
                                type="button"
                                onClick={() => setLevel(l)}
                                disabled={isLoading}
                                className={cn(
                                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                                    level === l
                                        ? "border-zinc-900 bg-zinc-50 text-zinc-900"
                                        : "border-transparent bg-zinc-100 text-zinc-600 hover:border-zinc-200"
                                )}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Options...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {buttonText}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
