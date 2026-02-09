export interface TopicsResponse {
  topics: string[];
}

export interface Lesson {
  title: string;
  description: string;
}

export interface PlanTopic {
  title: string;
  lessons: Lesson[];
}

export interface ScheduleItem {
  period: string;
  objective: string;
  topics: PlanTopic[];
}

export interface StudyPlan {
  title: string;
  description: string;
  schedule: ScheduleItem[];
}
