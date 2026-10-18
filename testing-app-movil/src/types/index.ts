export type Screen =
    | "splash"
    | "onboarding-1"
    | "onboarding-2"
    | "onboarding-3"
    | "login"
    | "home"
    | "create"
    | "calendar"
    | "stats"
    | "settings";

export type Priority = "Baja" | "Media" | "Alta";

export type Category = "General" | "Estudio" | "Trabajo" | "Personal";

export interface Task {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    priority: Priority;
    category: string;
    completed: boolean;
    repeat: boolean;
}

