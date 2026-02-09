'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Layers, Sparkles, Check, Plus, Lock } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useAuth } from "@/lib/auth-context";
import { studyPlansApi, aiApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Topic {
    name: string;
    isCore: boolean;
}

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
    id: string;
    title: string;
    description: string;
    prompt: string;
    level: string;
    selectedTopics: string[];
    schedule: ScheduleItem[];
    createdAt: string;
    updatedAt: string;
}

export default function StudyPlanViewClient() {
    const { user, loading: authLoading, updateTokens } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [refineMode, setRefineMode] = useState(false);
    const [generatedTopics, setGeneratedTopics] = useState<Topic[]>([]);
    const [selectedNewTopics, setSelectedNewTopics] = useState<string[]>([]);
    const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
    const [isRefining, setIsRefining] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchStudyPlan = async () => {
            if (!id) return;

            try {
                const data = await studyPlansApi.getOne(id);
                setStudyPlan(data);
            } catch (error) {
                console.error('Error fetching study plan:', error);
                router.push('/study-plans');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudyPlan();
        }
    }, [id, router]);

    const handleGenerateTopics = async () => {
        if (!studyPlan) return;

        setIsGeneratingTopics(true);
        try {
            const data = await aiApi.generateTopics({
                prompt: studyPlan.prompt,
                level: studyPlan.level,
                excludeTopics: studyPlan.selectedTopics || [],
            });

            if (data.topics && Array.isArray(data.topics)) {
                // Filter out topics that are already in the study plan
                const existingTopics = studyPlan.selectedTopics || [];
                const newTopics = data.topics.filter(
                    (topic: Topic) => !existingTopics.some(
                        (existing) => existing.toLowerCase() === topic.name.toLowerCase()
                    )
                );
                setGeneratedTopics(newTopics);

                // Auto-select core topics from the new topics
                const coreTopicNames = newTopics
                    .filter((topic: Topic) => topic.isCore)
                    .map((topic: Topic) => topic.name);
                setSelectedNewTopics(coreTopicNames);

                if (data.tokensUsed) {
                    updateTokens(data.tokensUsed);
                }
            }
        } catch (error) {
            console.error("Error generating topics:", error);
        } finally {
            setIsGeneratingTopics(false);
        }
    };

    const handleRefinePlan = async () => {
        if (!studyPlan || selectedNewTopics.length === 0) return;

        setIsRefining(true);
        try {
            const data = await aiApi.refinePlan({
                studyPlanId: studyPlan.id,
                additionalTopics: selectedNewTopics,
            });

            // Update the study plan with refined data
            setStudyPlan({
                ...studyPlan,
                title: data.title,
                description: data.description,
                schedule: data.schedule,
                selectedTopics: [...(studyPlan.selectedTopics || []), ...selectedNewTopics],
            });

            // Update token usage
            if (data.tokensUsed) {
                updateTokens(data.tokensUsed);
            }

            // Exit refine mode
            setRefineMode(false);
            setGeneratedTopics([]);
            setSelectedNewTopics([]);
        } catch (error) {
            console.error("Error refining plan:", error);
        } finally {
            setIsRefining(false);
        }
    };

    const toggleTopic = (topicName: string, isCore: boolean) => {
        // Don't allow deselecting core topics
        if (isCore && selectedNewTopics.includes(topicName)) {
            return;
        }

        setSelectedNewTopics(prev =>
            prev.includes(topicName) ? prev.filter(t => t !== topicName) : [...prev, topicName]
        );
    };

    const handleStartRefine = () => {
        setRefineMode(true);
        handleGenerateTopics();
    };

    const handleCancelRefine = () => {
        setRefineMode(false);
        setGeneratedTopics([]);
        setSelectedNewTopics([]);
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-4 text-sm text-zinc-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || !studyPlan) {
        return null;
    }

    return (
        <div className="flex h-screen w-full bg-white text-zinc-950 overflow-hidden">
            <Sidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
                <Breadcrumb />
                <div className="flex-1 overflow-auto p-6 bg-zinc-50/50">
                    {refineMode ? (
                        <div className="mx-auto w-full max-w-3xl space-y-8 p-4 py-8">
                            <div className="space-y-2 text-center">
                                <button
                                    onClick={handleCancelRefine}
                                    className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center justify-center gap-1 mx-auto mb-4"
                                    disabled={isRefining}
                                >
                                    <ArrowLeft className="w-4 h-4" /> Cancel
                                </button>
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                    Refine Your Study Plan
                                </h2>
                                <p className="text-zinc-500">
                                    {generatedTopics.filter(t => t.isCore).length > 0 && (
                                        <span className="inline-flex items-center gap-1 mr-1">
                                            <Lock className="w-3.5 h-3.5" />
                                            <strong>{generatedTopics.filter(t => t.isCore).length} essential topics</strong>
                                        </span>
                                    )}
                                    Select additional topics to enhance your study plan
                                </p>
                            </div>

                            {/* Currently Selected Topics */}
                            {studyPlan.selectedTopics && studyPlan.selectedTopics.length > 0 && (
                                <div className="space-y-3 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
                                    <h3 className="text-sm font-semibold text-zinc-700">
                                        Currently Included Topics ({studyPlan.selectedTopics.length})
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {studyPlan.selectedTopics.map((topic, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-zinc-200 text-zinc-700 border border-zinc-300"
                                            >
                                                <Check className="mr-1 h-3 w-3" />
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-zinc-500 italic">
                                        These topics are excluded from suggestions below
                                    </p>
                                </div>
                            )}

                            {isGeneratingTopics ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                                </div>
                            ) : (
                                <>
                                    {generatedTopics.length > 0 ? (
                                        <>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {generatedTopics.map((topic, i) => {
                                                    const isSelected = selectedNewTopics.includes(topic.name);
                                                    const isCore = topic.isCore;
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => toggleTopic(topic.name, isCore)}
                                                            disabled={isRefining}
                                                            className={cn(
                                                                "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all border",
                                                                isCore
                                                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md cursor-default"
                                                                    : isSelected
                                                                        ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                                                                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50",
                                                                isRefining && "opacity-50 cursor-not-allowed"
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
                                                    );
                                                })}
                                            </div>

                                            <div className="flex justify-center pt-6">
                                                <button
                                                    onClick={handleRefinePlan}
                                                    disabled={isRefining || selectedNewTopics.length === 0}
                                                    className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50"
                                                >
                                                    {isRefining ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Refining Plan...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="mr-2 h-4 w-4" />
                                                            Refine Study Plan
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-zinc-500">No new topics available</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="mx-auto w-full max-w-4xl space-y-8 p-4 py-8">
                            {/* Header */}
                            <div className="flex items-start justify-between border-b border-zinc-200 pb-6">
                                <div className="space-y-1 flex-1">
                                    <button
                                        onClick={() => router.push('/study-plans')}
                                        className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back to Plans
                                    </button>
                                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                                        {studyPlan.title}
                                    </h1>
                                    <p className="text-zinc-500 max-w-2xl">{studyPlan.description}</p>
                                    <div className="flex items-center gap-2 pt-2">
                                        <span className="px-2 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-medium">
                                            {studyPlan.level}
                                        </span>
                                        {studyPlan.selectedTopics && studyPlan.selectedTopics.length > 0 && (
                                            <span className="text-xs text-zinc-400">
                                                • {studyPlan.selectedTopics.length} topics
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleStartRefine}
                                    className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border border-zinc-200 bg-transparent px-3 text-xs font-normal text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 hover:border-zinc-300 ml-4"
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    Refine Plan
                                </button>
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
                                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                                                        {item.period}
                                                    </h3>
                                                </div>
                                                <p className="text-xs text-zinc-500 md:pr-8">{item.objective}</p>
                                            </div>

                                            {/* Content Column */}
                                            <div className="space-y-6">
                                                {item.topics.map((topic, tIdx) => (
                                                    <div
                                                        key={tIdx}
                                                        className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
                                                    >
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Layers className="h-4 w-4 text-zinc-500" />
                                                            <h4 className="font-semibold text-zinc-900">
                                                                {topic.title}
                                                            </h4>
                                                        </div>

                                                        <div className="space-y-3">
                                                            {topic.lessons.map((lesson, lIdx) => (
                                                                <div
                                                                    key={lIdx}
                                                                    className="group flex items-start gap-3 rounded-lg p-2 hover:bg-zinc-50 transition-colors"
                                                                >
                                                                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-300 group-hover:bg-zinc-900 transition-colors shrink-0"></div>
                                                                    <div>
                                                                        <div className="text-sm font-medium text-zinc-900">
                                                                            {lesson.title}
                                                                        </div>
                                                                        <div className="text-xs text-zinc-500 mt-0.5">
                                                                            {lesson.description}
                                                                        </div>
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
                    )}
                </div>
            </main>
        </div>
    );
}
