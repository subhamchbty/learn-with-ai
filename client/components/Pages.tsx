"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Calendar, BookOpen, ChevronRight, Sparkles } from "lucide-react";
import { studyPlansApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export const Dashboard = () => (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-zinc-100/50" />
            <div className="aspect-video rounded-xl bg-zinc-100/50" />
            <div className="aspect-video rounded-xl bg-zinc-100/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-zinc-100/50 md:min-h-min" />
    </div>
);

interface StudyPlan {
    id: string;
    title: string;
    description: string;
    prompt: string;
    level: string;
    selectedTopics: string[];
    schedule: any;
    createdAt: string;
    updatedAt: string;
}

interface PaginatedResponse {
    data: StudyPlan[];
    total: number;
    page: number;
    totalPages: number;
}

export const StudyPlansList = () => {
    const router = useRouter();
    const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalPlans, setTotalPlans] = useState(0);

    const fetchStudyPlans = useCallback(async (pageNumber: number) => {
        if (pageNumber === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response: PaginatedResponse = await studyPlansApi.getAll(pageNumber, 9);

            if (pageNumber === 1) {
                setStudyPlans(response.data);
            } else {
                setStudyPlans(prev => [...prev, ...response.data]);
            }

            setTotalPlans(response.total);
            setHasMore(response.page < response.totalPages);
        } catch (error) {
            console.error('Error fetching study plans:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchStudyPlans(1);
    }, [fetchStudyPlans]);

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchStudyPlans(nextPage);
        }
    }, [page, loadingMore, hasMore, fetchStudyPlans]);

    const { observerTarget } = useInfiniteScroll({
        loading: loadingMore,
        hasMore,
        onLoadMore: loadMore,
        threshold: 300,
    });

    const handleViewPlan = (id: string) => {
        router.push(`/study-plans/${id}`);
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500">Loading your study plans...</p>
                </div>
            </div>
        );
    }

    if (studyPlans.length === 0) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="min-h-[50vh] flex-1 rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center border border-zinc-200">
                    <div className="text-center max-w-md px-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm border border-zinc-200 mb-6">
                            <Sparkles className="h-8 w-8 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-900 mb-2">No Study Plans Yet</h3>
                        <p className="text-zinc-500 text-sm mb-6">
                            Create your first AI-powered study plan tailored to your learning goals and pace.
                        </p>
                        <button
                            onClick={() => router.push('/create-study-plan')}
                            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-medium text-zinc-50 shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Create Your First Plan
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                        Your Study Plans
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        {totalPlans} {totalPlans === 1 ? 'plan' : 'plans'} total
                    </p>
                </div>
                <button
                    onClick={() => router.push('/create-study-plan')}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-zinc-50 shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create New
                </button>
            </div>

            {/* Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                {studyPlans.map((plan, index) => (
                    <Card
                        key={plan.id}
                        className="group cursor-pointer border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-zinc-300 hover:-translate-y-1"
                        onClick={() => handleViewPlan(plan.id)}
                        style={{
                            animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                        }}
                    >
                        <div className="flex flex-col gap-4 h-full">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-semibold text-zinc-900 line-clamp-2 flex-1 group-hover:text-zinc-700 leading-snug">
                                    {plan.title}
                                </h3>
                                <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-zinc-600 transition-colors shrink-0 mt-0.5" />
                            </div>

                            <p className="text-sm text-zinc-600 line-clamp-3 flex-1">
                                {plan.description}
                            </p>

                            <div className="flex flex-col gap-2 pt-3 border-t border-zinc-100">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium">
                                        {plan.level}
                                    </span>
                                    {plan.selectedTopics && plan.selectedTopics.length > 0 && (
                                        <span className="text-xs text-zinc-400">
                                            {plan.selectedTopics.length} topics
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>Created {new Date(plan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Loading More Indicator */}
            {loadingMore && (
                <div className="flex justify-center py-8">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading more plans...</span>
                    </div>
                </div>
            )}

            {/* Intersection Observer Target */}
            {hasMore && <div ref={observerTarget} className="h-4" />}

            {/* End Message */}
            {!hasMore && studyPlans.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-sm text-zinc-400">
                        You've reached the end of your study plans
                    </p>
                </div>
            )}
        </div>
    );
};

export const CoursesList = () => (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[50vh] flex-1 rounded-xl bg-zinc-100/50 flex items-center justify-center">
            <p className="text-zinc-500">Your Courses</p>
        </div>
    </div>
);
