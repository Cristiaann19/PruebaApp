// src/components/common/Button.tsx
import React, {ReactNode} from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = {
    children: ReactNode;
    variant?: ButtonVariant;
    full?: boolean; // Si es true, ocupa el 100% del ancho disponible
    onClick?: () => void;
    style?: StyleProp<ViewStyle>;
};

export function Button({
                           children,
                           variant = "primary",
                           full = false,
                           onClick,
                           style,
                       }: ButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClick}
            style={[
                styles.btn,
                styles[`btn_${variant}`],
                full && styles.full,
                style,
            ]}
        >
            {/* Envolvemos los hijos en un Text con estilo acorde a la variante */}
            <Text style={[styles.text, styles[`text_${variant}`]]}>{children}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 14,
        gap: 8,
    },
    full: {
        width: "100%",
    },
    // Variantes de fondo
    btn_primary: {
        backgroundColor: "#6254F5",
    },
    btn_secondary: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    btn_ghost: {
        backgroundColor: "transparent",
    },
    btn_danger: {
        backgroundColor: "#FEE2E2",
    },
    // Variantes de texto
    text: {
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
    },
    text_primary: {
        color: "#FFFFFF",
    },
    text_secondary: {
        color: "#1E1E2D",
    },
    text_ghost: {
        color: "#64748B",
    },
    text_danger: {
        color: "#EF4444",
    },
});