import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Priority} from "../../types";

type PriorityPillProps = {
    priority: Priority; // Puede ser "Baja", "Media" o "Alta"
};

export function PriorityPill({priority}: PriorityPillProps) {
    // Seleccionamos el estilo de fondo y de texto según el nivel de prioridad
    const containerStyle =
        priority === "Alta"
            ? styles.bgAlta
            : priority === "Media"
                ? styles.bgMedia
                : styles.bgBaja;

    const textStyle =
        priority === "Alta"
            ? styles.textAlta
            : priority === "Media"
                ? styles.textMedia
                : styles.textBaja;

    return (
        <View style={[styles.pill, containerStyle]}>
            <Text style={[styles.text, textStyle]}>{priority}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginRight: 6,
    },
    text: {
        fontSize: 11,
        fontWeight: "700",
    },
    // Colores para prioridad Baja (Verde suave)
    bgBaja: {
        backgroundColor: "#DCFCE7",
    },
    textBaja: {
        color: "#15803D",
    },
    // Colores para prioridad Media (Amarillo/Ámbar suave)
    bgMedia: {
        backgroundColor: "#FEF3C7",
    },
    textMedia: {
        color: "#B45309",
    },
    // Colores para prioridad Alta (Rojo suave)
    bgAlta: {
        backgroundColor: "#FEE2E2",
    },
    textAlta: {
        color: "#B91C1C",
    },
});