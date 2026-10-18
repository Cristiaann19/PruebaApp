import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {useTheme} from "../../context/ThemeContext";
import {Icon} from "./Icon";

type LogoProps = {
    compact?: boolean; // Si es true, hace el logo más pequeño (para encabezados)
    light?: boolean;   // Si es true, pinta el texto de blanco (para fondos oscuros/morados)
};

export function Logo({compact = false, light = false}: LogoProps) {
    const {colors} = useTheme();
    return (
        <View style={styles.brand}>
            <View
                style={[
                    styles.brandMark,
                    compact ? styles.markCompact : styles.markNormal,
                    light && styles.markLight,
                ]}
            >
                <Icon
                    name="check"
                    size={compact ? 19 : 31}
                    color={light ? "#6254F5" : "#FFFFFF"}
                />
            </View>
            <Text
                style={[
                    styles.brandText,
                    compact ? styles.textCompact : styles.textNormal,
                    light && styles.textLight,
                    !light && {color: colors.text},
                ]}
            >
                Taskly
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    brand: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    brandMark: {
        backgroundColor: "#6254F5",
        alignItems: "center",
        justifyContent: "center",
    },
    markNormal: {
        width: 56,
        height: 56,
        borderRadius: 18,
    },
    markCompact: {
        width: 34,
        height: 34,
        borderRadius: 10,
    },
    markLight: {
        backgroundColor: "#FFFFFF",
    },
    brandText: {
        fontWeight: "800",
        color: "#1E1E2D",
    },
    textNormal: {
        fontSize: 32,
    },
    textCompact: {
        fontSize: 20,
    },
    textLight: {
        color: "#FFFFFF",
    },
});