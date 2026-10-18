
import { Task } from "../types";

const SERVER_IP = "192.168.100.11";
const API_URL = `http://${SERVER_IP}:8080/api/tasks`;

// 1. Obtener todas las tareas
export async function fetchTasks(): Promise<Task[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(
            `No se pudieron obtener las tareas. HTTP ${response.status}`
        );
    }

    return await response.json();
}

// 2. Crear una tarea
export async function postTask(
    newTask: Omit<Task, "id">
): Promise<Task> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Error al guardar la tarea: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}

// 3. Cambiar entre completada y pendiente
export async function toggleTaskInServer(
    id: number
): Promise<Task> {
    // Evita enviar IDs inválidos al backend
    if (id == null || !Number.isInteger(id) || id <= 0) {
        throw new Error(`ID de tarea inválido: ${id}`);
    }

    const url = `${API_URL}/${id}/toggle`;

    console.log("Actualizando tarea:", { id, url });

    const response = await fetch(url, {
        method: "PATCH",
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Error al actualizar la tarea. HTTP ${response.status}: ${errorText}`
        );
    }

    return await response.json();
}

// 4. Eliminar una tarea
export async function deleteTaskFromServer(
    id: number
): Promise<boolean> {
    if (id == null || !Number.isInteger(id) || id <= 0) {
        throw new Error(`ID de tarea inválido: ${id}`);
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Error al eliminar la tarea. HTTP ${response.status}: ${errorText}`
        );
    }

    return true;
}
