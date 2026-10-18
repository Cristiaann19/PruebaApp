import React, {ReactNode} from "react";
import Svg, {Path, Circle, Rect, G} from "react-native-svg";

// Propiedades que acepta nuestro componente Icon
type IconProps = {
    name: string;
    size?: number;
    color?: string;
};

/**
 * Función auxiliar que devuelve el dibujo vectorial (trazos) según el nombre del ícono.
 * Se le pasa el "color" para aquellos íconos que usan relleno sólido (como "more").
 */
const getIconPaths = (name: string, color: string): ReactNode => {
    switch (name) {
        case "check":
            return <Path d="m5 12 4 4L19 6"/>;
        case "home":
            return (
                <G>
                    <Path d="m3 11 9-8 9 8"/>
                    <Path d="M5 10v10h14V10M9 20v-6h6v6"/>
                </G>
            );
        case "calendar":
            return (
                <G>
                    <Rect x="3" y="5" width="18" height="16" rx="3"/>
                    <Path d="M16 3v4M8 3v4M3 10h18"/>
                </G>
            );
        case "plus":
            return <Path d="M12 5v14M5 12h14"/>;
        case "chart":
            return <Path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>;
        case "settings":
            return (
                <G>
                    <Circle cx="12" cy="12" r="3"/>
                    <Path
                        d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/>
                </G>
            );
        case "bell":
            return (
                <G>
                    <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
                    <Path d="M10 21h4"/>
                </G>
            );
        case "mail":
            return (
                <G>
                    <Rect x="3" y="5" width="18" height="14" rx="3"/>
                    <Path d="m4 7 8 6 8-6"/>
                </G>
            );
        case "lock":
            return (
                <G>
                    <Rect x="4" y="10" width="16" height="11" rx="3"/>
                    <Path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                </G>
            );
        case "eye":
            return (
                <G>
                    <Path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/>
                    <Circle cx="12" cy="12" r="2.5"/>
                </G>
            );
        case "back":
            return <Path d="m15 18-6-6 6-6"/>;
        case "more":
            return (
                <G>
                    <Circle cx="12" cy="5" r="1.5" fill={color} stroke="none"/>
                    <Circle cx="12" cy="12" r="1.5" fill={color} stroke="none"/>
                    <Circle cx="12" cy="19" r="1.5" fill={color} stroke="none"/>
                </G>
            );
        case "chevron":
            return <Path d="m9 18 6-6-6-6"/>;
        case "clock":
            return (
                <G>
                    <Circle cx="12" cy="12" r="9"/>
                    <Path d="M12 7v5l3 2"/>
                </G>
            );
        case "flag":
            return <Path d="M5 21V4m0 0h11l-2 4 2 4H5"/>;
        case "globe":
            return (
                <G>
                    <Circle cx="12" cy="12" r="9"/>
                    <Path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>
                </G>
            );
        case "help":
            return (
                <G>
                    <Circle cx="12" cy="12" r="9"/>
                    <Path d="M9.7 9a2.4 2.4 0 1 1 3.5 2.1c-.8.4-1.2.9-1.2 1.9M12 17h.01"/>
                </G>
            );
        case "info":
            return (
                <G>
                    <Circle cx="12" cy="12" r="9"/>
                    <Path d="M12 11v6M12 7h.01"/>
                </G>
            );
        case "logout":
            return (
                <Path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/>
            );
        case "user":
            return (
                <G>
                    <Circle cx="12" cy="8" r="4"/>
                    <Path d="M4 21a8 8 0 0 1 16 0"/>
                </G>
            );
        case "edit":
            return (
                <G>
                    <Path d="M12 20h9"/>
                    <Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>
                </G>
            );
        default:
            return null;
    }
};

/**
 * Componente Icon reutilizable.
 * @param name Nombre del ícono (ej. "home", "check", "calendar").
 * @param size Tamaño en píxeles (por defecto 22).
 * @param color Color de las líneas en formato hexadecimal (por defecto "#1E1E2D").
 */
export function Icon({name, size = 22, color = "#1E1E2D"}: IconProps) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {getIconPaths(name, color)}
        </Svg>
    );
}