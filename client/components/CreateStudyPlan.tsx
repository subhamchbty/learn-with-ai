"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AICreationForm } from "./AICreationForm";
import { aiApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

// --- Study Plan Types ---
interface Topic {
    name: string;
    isCore: boolean;
}

export const CreateStudyPlan = () => {
    const { updateTokens } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState<'input' | 'selection'>('input');
    const [isLoading, setIsLoading] = useState(false);

    // Data State
    const [inputData, setInputData] = useState<{ prompt: string; level: string } | null>(null);
    const [generatedTopics, setGeneratedTopics] = useState<Topic[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    // Step 1: Generate Topics List
    const handleGenerateTopics = async ({ prompt, level }: { prompt: string; level: string }) => {
        setIsLoading(true);
        setInputData({ prompt, level });
        try {
            const data = await aiApi.generateTopics({ prompt, level });

            if (data.topics && Array.isArray(data.topics)) {
                setGeneratedTopics(data.topics);

                // Auto-select all core topics
                const coreTopicNames = data.topics
                    .filter((topic: Topic) => topic.isCore)
                    .map((topic: Topic) => topic.name);
                setSelectedTopics(coreTopicNames);

                setStep('selection');

                // Update token usage in sidebar
                if (data.tokensUsed) {
                    updateTokens(data.tokensUsed);
                }
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

            // Update token usage in sidebar
            if (data.tokensUsed) {
                updateTokens(data.tokensUsed);
            }

            // Redirect to the study plan view
            if (data.studyPlanId) {
                router.push(`/study-plans/${data.studyPlanId}`);
            }
        } catch (error) {
            console.error("Error generating plan:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTopic = (topicName: string, isCore: boolean) => {
        // Don't allow deselecting core topics
        if (isCore && selectedTopics.includes(topicName)) {
            return;
        }

        setSelectedTopics(prev =>
            prev.includes(topicName) ? prev.filter(t => t !== topicName) : [...prev, topicName]
        );
    };

    const handleReset = () => {
        setStep('input');
        setGeneratedTopics([]);
        setSelectedTopics([]);
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
        const coreTopicsCount = generatedTopics.filter(t => t.isCore).length;
        const optionalTopicsCount = generatedTopics.length - coreTopicsCount;

        return (
            <div className="mx-auto w-full max-w-3xl space-y-8 p-4 py-8">
                <div className="space-y-2 text-center">
                    <button onClick={handleReset} className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center justify-center gap-1 mx-auto mb-4">
                        <ArrowLeft className="w-4 h-4" /> Start Over
                    </button>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Customize Your Curriculum</h2>
                    <p className="text-zinc-500">
                        <span className="inline-flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            <strong>{coreTopicsCount} essential topics</strong>
                        </span>
                        {' '}are automatically included. Select from {optionalTopicsCount} optional topics to enhance your plan.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {generatedTopics.map((topic, i) => {
                        const isSelected = selectedTopics.includes(topic.name);
                        const isCore = topic.isCore;
                        return (
                            <button
                                key={i}
                                onClick={() => toggleTopic(topic.name, isCore)}
                                className={cn(
                                    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all border",
                                    isCore
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md cursor-default"
                                        : isSelected
                                            ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                                )}
                                title={isCore ? "Essential topic - always included" : undefined}
                            >
                                {isCore ? (
                                    <Lock className="mr-1.5 h-3.5 w-3.5" />
                                ) : isSelected ? (
                                    <Check className="mr-1.5 h-3.5 w-3.5" />
                                ) : null}
                                {topic.name}
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

    return null;
};
