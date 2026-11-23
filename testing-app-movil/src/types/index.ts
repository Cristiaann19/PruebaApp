export type Screen =
    | "splash"
    | "onboarding-1"
    | "onboarding-2"
    | "onboarding-3"
    | "login"
    | "home"
    | "create"
    | "edit"
    | "calendar"
    | "stats"
    | "settings";

export type Priority = "Baja" | "Media" | "Alta";

export type Category = "General" | "Estudio" | "Trabajo" | "Personal";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    priority: Priority;
    category: Category;
    completed: boolean;
    repeat: boolean;
}

