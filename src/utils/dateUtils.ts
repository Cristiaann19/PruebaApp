export const pad = (n: number): string => String(n).padStart(2, "0");

export const isoDate = (date: Date): string =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Fecha actual del dispositivo
export const today = new Date();

// Fecha de mañana calculada automáticamente a partir de hoy
export const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
);