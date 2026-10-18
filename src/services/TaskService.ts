// src/services/taskService.ts
import { Task } from "../types";

/**
 * PARÁMETRO AJUSTABLE PARA EXPO GO EN CELULAR FÍSICO:
 * Reemplaza "192.168.1.45" por la IP que aparece debajo de tu código QR de Expo.
 * Mantén el puerto :8080 que es donde corre tu Spring Boot.
 */
const SERVER_IP = "192.168.100.11";
const API_URL = `http://${SERVER_IP}:8080/api/tasks`;

/**
 * 1. Obtiene todas las tareas desde MySQL (GET /api/tasks).
 */
export async function fetchTasks(): Promise<Task[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("No se pudo conectar con el servidor Spring Boot");
    }
    return await response.json();
}

/**
 * 2. Crea una nueva tarea en MySQL (POST /api/tasks).
 */
export async function postTask(newTask: Omit<Task, "id">): Promise<Task> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    });

    if (!response.ok) {
        throw new Error("Error al guardar la tarea en MySQL");
    }

    return await response.json();
}

/**
 * 3. Invierte el estado completado/pendiente en MySQL (PATCH /api/tasks/{id}/toggle).
 */
export async function toggleTaskInServer(id: number): Promise<Task> {
    const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
    });

    if (!response.ok) {
        throw new Error("Error al actualizar el estado de la tarea");
    }

    return await response.json();
}

/**
 * 4. Elimina una tarea de MySQL (DELETE /api/tasks/{id}).
 */
export async function deleteTaskFromServer(id: number): Promise<boolean> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    return response.ok;
}