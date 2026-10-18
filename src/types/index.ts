// src/types/index.ts

// Pantallas
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

/*
*
 * Niveles de prioridad para cada tarea.
*/
export type Priority = "Baja" | "Media" | "Alta";

/**
 * Categorías disponibles para clasificar las tareas.
 */
export type Category = "General" | "Estudio" | "Trabajo" | "Personal";

/**
 * Estructura principal de un objeto Tarea (Task).
 */
export type Task = {
    id: number;
    title: string;
    description?: string;
    date: string;
    time: string;
    priority: Priority;
    category: Category;
    completed: boolean;
    repeat?: boolean;
};