// src/components/layout/BottomNav.tsx
import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Screen} from "../../types";
import {useTheme} from "../../context/ThemeContext";
import {Icon} from "../common/Icon";

// Propiedades que recibe la barra de navegación
type BottomNavProps = {
    active: Screen; // Pantalla actualmente activa para resaltarla en color morado
    navigate: (screen: Screen) => void; // Función para cambiar de pantalla al tocar un botón
};

// Lista fija con las 5 secciones de la barra inferior
const navItems: { key: Screen; icon: string; label: string }[] = [
    {key: "home", icon: "home", label: "Inicio"},
    {key: "calendar", icon: "calendar", label: "Calendario"},
    {key: "create", icon: "plus", label: "Agregar"},
    {key: "stats", icon: "chart", label: "Estadísticas"},
    {key: "settings", icon: "settings", label: "Ajustes"},
];

export function BottomNav({active, navigate}: BottomNavProps) {
    const {colors} = useTheme();
    return (
        <View
            style={[
                styles.bottomNav,
                {backgroundColor: colors.card, borderTopColor: colors.border},
            ]}
            accessibilityRole="tablist"
        >
            {navItems.map((item) => {
                const isActive = active === item.key;
                const isAddButton = item.key === "create";

                return (
                    <TouchableOpacity
                        key={item.key}
                        activeOpacity={0.75}
                        style={styles.navItem}
                        onPress={() => navigate(item.key)}
                    >
                        {/* Contenedor del ícono: si es el botón "Agregar", le damos estilo circular morado */}
                        <View
                            style={[
                                styles.navIcon,
                                isAddButton && styles.navAddIcon,
                                isActive && !isAddButton && styles.navIconActive,
                                isActive && !isAddButton && {backgroundColor: colors.primarySoft},
                            ]}
                        >
                            <Icon
                                name={item.icon}
                                size={isAddButton ? 25 : 21}
                                color={
                                    isAddButton
                                        ? "#FFFFFF"
                                        : isActive
                                            ? colors.primary
                                            : colors.subtext
                                }
                            />
                        </View>

                        {/* Texto debajo del ícono */}
                        <Text
                            style={[
                                styles.navLabel,
                                {color: colors.subtext},
                                isActive && styles.navLabelActive,
                                isActive && {color: colors.primary},
                                isAddButton && styles.navLabelAdd,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#FFFFFF",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    navIcon: {
        width: 36,
        height: 32,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
    },
    navIconActive: {
        backgroundColor: "#EEF2FF",
    },
    navAddIcon: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#6254F5",
        marginTop: -18, // Hace que el botón "+" sobresalga ligeramente hacia arriba
        elevation: 4,
        shadowColor: "#6254F5",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    navLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#94A3B8",
    },
    navLabelActive: {
        color: "#6254F5",
        fontWeight: "700",
    },
    navLabelAdd: {
        marginTop: 2,
    },
});