// src/components/tasks/TaskRow.tsx
import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Task} from "../../types";
import {isoDate, today, tomorrow} from "../../utils/dateUtils";
import {useTheme} from "../../context/ThemeContext";
import {Icon} from "../common/Icon";
import {PriorityPill} from "./PriorityPill";

type TaskRowProps = {
    task: Task;
    toggle?: (id: number) => void; // Si se pasa, muestra el botón circular para completar la tarea
    compact?: boolean; // Si es true, oculta la etiqueta y el botón de menú (usado en Calendario)
};

// Nombres cortos de los meses para formatear fechas de forma segura en cualquier teléfono
const MONTHS_ES = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
];

/**
 * Convierte una fecha "AAAA-MM-DD" en "Hoy", "Mañana" o formato corto como "15 oct".
 */
function formatTaskDate(dateStr: string): string {
    if (dateStr === isoDate(today)) return "Hoy";
    if (dateStr === isoDate(tomorrow)) return "Mañana";

    const parts = dateStr.split("-");
    if (parts.length === 3) {
        const monthIndex = Number(parts[1]) - 1;
        const day = Number(parts[2]);
        return `${day} ${MONTHS_ES[monthIndex] || ""}`;
    }
    return dateStr;
}

export function TaskRow({task, toggle, compact = false}: TaskRowProps) {
    const {colors} = useTheme();

    // Color del punto indicador cuando está en modo compacto (Calendario)
    const dotColor =
        task.priority === "Alta"
            ? "#EF4444"
            : task.priority === "Media"
                ? "#F59E0B"
                : "#22C55E";

    return (
        <View
            style={[
                styles.taskRow,
                {backgroundColor: colors.card, borderColor: colors.border},
                task.completed && [styles.taskRowCompleted, {backgroundColor: colors.primarySoft}],
                compact && styles.taskRowCompact,
            ]}
        >
            {/* Lado izquierdo: Checkbox interactivo (en Inicio) o punto de color (en Calendario) */}
            {toggle ? (
                <TouchableOpacity
                    style={[
                        styles.taskCheck,
                        {borderColor: colors.subtext},
                        task.completed && styles.taskCheckCompleted,
                    ]}
                    onPress={() => toggle(task.id)}
                    accessibilityLabel={
                        task.completed ? "Marcar como pendiente" : "Completar tarea"
                    }
                >
                    {task.completed && <Icon name="check" size={14} color="#FFFFFF"/>}
                </TouchableOpacity>
            ) : (
                <View style={[styles.priorityDot, {backgroundColor: dotColor}]}/>
            )}

            {/* Centro: Título de la tarea y metadatos (fecha y hora) */}
            <View style={styles.taskMain}>
                <Text
                    style={[
                        styles.taskTitle,
                        {color: colors.text},
                        task.completed && styles.taskTitleCompleted,
                    ]}
                    numberOfLines={1}
                >
                    {task.title}
                </Text>

                <View style={styles.taskMeta}>
                    <View style={styles.metaItem}>
                        <Icon name="calendar" size={13} color={colors.subtext}/>
                        <Text style={[styles.metaText, {color: colors.subtext}]}>
                            {formatTaskDate(task.date)}
                        </Text>
                    </View>

                    <View style={styles.metaItem}>
                        <Icon name="clock" size={13} color={colors.subtext}/>
                        <Text style={[styles.metaText, {color: colors.subtext}]}>
                            {task.time}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Lado derecho: Etiqueta de prioridad y botón de más opciones (solo en vista normal) */}
            {!compact && <PriorityPill priority={task.priority}/>}

            {!compact && (
                <TouchableOpacity
                    style={styles.moreButton}
                    accessibilityLabel="Más opciones"
                >
                    <Icon name="more" size={18} color={colors.subtext}/>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    taskRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
    },
    taskRowCompleted: {
        opacity: 0.65,
    },
    taskRowCompact: {
        paddingVertical: 12,
    },
    taskCheck: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    taskCheckCompleted: {
        backgroundColor: "#6254F5",
        borderColor: "#6254F5",
    },
    priorityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    taskMain: {
        flex: 1,
        marginRight: 8,
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 4,
    },
    taskTitleCompleted: {
        textDecorationLine: "line-through",
        color: "#94A3B8",
    },
    taskMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        fontWeight: "500",
    },
    moreButton: {
        padding: 4,
    },
});
