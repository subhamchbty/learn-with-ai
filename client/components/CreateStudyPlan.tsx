"use client";

import React, { useState } from "react";
import { ArrowLeft, Check, ChevronRight, Loader2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { AICreationForm } from "./AICreationForm";
import { aiApi } from "@/lib/api";

// --- Study Plan Types ---
interface Lesson {
    title: string;
    description: string;
}

interface PlanTopic {
    title: string;
    lessons: Lesson[];
}

interface ScheduleItem {
    period: string;
    objective: string;
    topics: PlanTopic[];
}

interface StudyPlan {
    title: string;
    description: string;
    schedule: ScheduleItem[];
}

export const CreateStudyPlan = () => {
    const [step, setStep] = useState<'input' | 'selection' | 'result'>('input');
    const [isLoading, setIsLoading] = useState(false);

    // Data State
    const [inputData, setInputData] = useState<{ prompt: string; level: string } | null>(null);
    const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

    // Step 1: Generate Topics List
    const handleGenerateTopics = async ({ prompt, level }: { prompt: string; level: string }) => {
        setIsLoading(true);
        setInputData({ prompt, level });
        try {
            const data = await aiApi.generateTopics({ prompt, level });

            if (data.topics && Array.isArray(data.topics)) {
                setGeneratedTopics(data.topics);
                setStep('selection');
            }
        } catch (error) {
            console.error("Error generating topics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Generate Final Plan
    const handleGeneratePlan = async () => {
        if (!inputData) return;

        setIsLoading(true);
        try {
            const data = await aiApi.generatePlan({
                prompt: inputData.prompt,
                level: inputData.level,
                selectedTopics
            });

            setStudyPlan(data);
            setStep('result');
        } catch (error) {
            console.error("Error generating plan:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev =>
            prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
        );
    };

    const handleReset = () => {
        setStep('input');
        setGeneratedTopics([]);
        setSelectedTopics([]);
        setStudyPlan(null);
        setInputData(null);
    };

    // --- Render Steps ---

    if (step === 'input') {
        return (
            <div className="flex flex-col items-center justify-start p-4 py-12 w-full max-w-4xl mx-auto">
                <AICreationForm
                    title="Create Study Plan"
                    description="Generate a personalized study schedule tailored to your goals and pace."
                    placeholder="e.g. I want to learn Advanced Python for Data Science in 4 weeks"
                    buttonText="Next: Select Topics"
                    onSubmit={handleGenerateTopics}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    if (step === 'selection') {
        return (
            <div className="mx-auto w-full max-w-3xl space-y-8 p-4 py-8">
                <div className="space-y-2 text-center">
                    <button onClick={handleReset} className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center justify-center gap-1 mx-auto mb-4">
                        <ArrowLeft className="w-4 h-4" /> Start Over
                    </button>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Customize Your Curriculum</h2>
                    <p className="text-zinc-500">Select specific topics to emphasize. Essential concepts for <strong>{inputData?.level}</strong> level will be included automatically.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {generatedTopics.map((topic, i) => {
                        const isSelected = selectedTopics.includes(topic);
                        return (
                            <button
                                key={i}
                                onClick={() => toggleTopic(topic)}
                                className={cn(
                                    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all border",
                                    isSelected
                                        ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                                )}
                            >
                                {isSelected && <Check className="mr-1.5 h-3.5 w-3.5" />}
                                {topic}
                            </button>
                        )
                    })}
                </div>

                <div className="flex justify-center pt-6">
                    <button
                        onClick={handleGeneratePlan}
                        disabled={isLoading}
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Plan...
                            </>
                        ) : (
                            <>
                                Generate Final Plan
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'result' && studyPlan) {
        return (
            <div className="mx-auto w-full max-w-4xl space-y-8 p-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-zinc-200 pb-6">
                    <div className="space-y-1">
                        <button onClick={handleReset} className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-2">
                            <ArrowLeft className="w-4 h-4" /> Create New
                        </button>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{studyPlan.title}</h1>
                        <p className="text-zinc-500 max-w-2xl">{studyPlan.description}</p>
                    </div>
                </div>

                {/* Plan Timeline */}
                <div className="space-y-8">
                    {studyPlan.schedule.map((item, idx) => (
                        <div key={idx} className="relative pl-8 md:pl-0">
                            {/* Mobile Timeline Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-200 md:hidden"></div>

                            <div className="md:grid md:grid-cols-[200px_1fr] md:gap-8">
                                {/* Period Column */}
                                <div className="mb-4 md:mb-0 relative">
                                    {/* Desktop Timeline Dot */}
                                    <div className="hidden md:block absolute right-[-17px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-zinc-200"></div>

                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-900 md:hidden z-10 ring-4 ring-white">
                                            {idx + 1}
                                        </span>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">{item.period}</h3>
                                    </div>
                                    <p className="text-xs text-zinc-500 md:pr-8">{item.objective}</p>
                                </div>

                                {/* Content Column */}
                                <div className="space-y-6">
                                    {item.topics.map((topic, tIdx) => (
                                        <div key={tIdx} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Layers className="h-4 w-4 text-zinc-500" />
                                                <h4 className="font-semibold text-zinc-900">{topic.title}</h4>
                                            </div>

                                            <div className="space-y-3">
                                                {topic.lessons.map((lesson, lIdx) => (
                                                    <div key={lIdx} className="group flex items-start gap-3 rounded-lg p-2 hover:bg-zinc-50 transition-colors">
                                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-300 group-hover:bg-zinc-900 transition-colors shrink-0"></div>
                                                        <div>
                                                            <div className="text-sm font-medium text-zinc-900">{lesson.title}</div>
                                                            <div className="text-xs text-zinc-500 mt-0.5">{lesson.description}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};
