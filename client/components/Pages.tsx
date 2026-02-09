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

export const StudyPlansList = () => (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[50vh] flex-1 rounded-xl bg-zinc-100/50 flex items-center justify-center">
            <p className="text-zinc-500">Your Saved Study Plans</p>
        </div>
    </div>
);

export const CoursesList = () => (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[50vh] flex-1 rounded-xl bg-zinc-100/50 flex items-center justify-center">
            <p className="text-zinc-500">Your Courses</p>
        </div>
    </div>
);
