// src/context/ThemeContext.tsx
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Definimos los dos temas posibles
export type ThemeMode = "Claro" | "Oscuro";

// Paleta de colores que cambiará automáticamente en toda la app
export type ThemeColors = {
    background: string;
    card: string;
    paper: string;
    text: string;
    subtext: string;
    border: string;
    primary: string;
    primarySoft: string;
};

// Colores para el modo Claro
const lightColors: ThemeColors = {
    background: "#F8F9FE",
    paper: "#ffffff",
    card: "#FFFFFF",
    text: "#1E1E2D",
    subtext: "#64748B",
    border: "#F1F5F9",
    primary: "#6254F5",
    primarySoft: "#EEF2FF",
};

// Colores para el modo Oscuro
const darkColors: ThemeColors = {
    background: "#0F172A",
    paper:"#3981de",
    card: "#1E293B",
    text: "#F8FAFC",
    subtext: "#94A3B8",
    border: "#334155",
    primary: "#6254F5",
    primarySoft: "#312E81",
};

type ThemeContextType = {
    theme: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "taskly-theme";

/**
 * Proveedor global de tema. Envuelve la aplicación en App.tsx para que
 * todas las pantallas sepan si el modo oscuro está activo.
 */
export function ThemeProvider({children}: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeMode>("Claro");

    // Al abrir la app, revisa si el usuario había dejado puesto el modo oscuro
    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
            if (saved === "Oscuro" || saved === "Claro") {
                setTheme(saved);
            }
        });
    }, []);

    // Alterna entre Claro y Oscuro y lo guarda en la memoria del teléfono
    const toggleTheme = () => {
        setTheme((prev) => {
            const next = prev === "Claro" ? "Oscuro" : "Claro";
            AsyncStorage.setItem(THEME_STORAGE_KEY, next);
            return next;
        });
    };

    const isDark = theme === "Oscuro";
    const colors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{theme, isDark, colors, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook personalizado para usar los colores del tema en cualquier pantalla.
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme debe usarse dentro de un ThemeProvider");
    }
    return context;
}