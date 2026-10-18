import { Task } from "../types";
import { isoDate, today, tomorrow } from "../utils/dateUtils";


export const initialTasks: Task[] = [
    {
        id: 1,
        title: "Estudiar para el examen de Sistemas",
        date: isoDate(today),
        time: "18:00",
        priority: "Alta",
        category: "Estudio",
        completed: false,
    },
    {
        id: 2,
        title: "Enviar avance del proyecto",
        date: isoDate(today),
        time: "11:30",
        priority: "Alta",
        category: "Trabajo",
        completed: true,
    },
    {
        id: 3,
        title: "Ir al gimnasio",
        date: isoDate(tomorrow),
        time: "07:00",
        priority: "Media",
        category: "Personal",
        completed: false,
    },
    {
        id: 4,
        title: "Comprar víveres",
        date: isoDate(tomorrow),
        time: "19:00",
        priority: "Baja",
        category: "General",
        completed: false,
    },
    {
        id: 5,
        title: "Planificar la semana",
        date: isoDate(today),
        time: "09:00",
        priority: "Baja",
        category: "Personal",
        completed: true,
    },
];