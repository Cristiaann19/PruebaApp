// src/screens/CalendarScreen.tsx
import React, {useState} from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {Screen, Task} from "../types";
import {isoDate, pad, today} from "../utils/dateUtils";
import {useTheme} from "../context/ThemeContext";
import {Header} from "../components/common/Header";
import {Icon} from "../components/common/Icon";
import {BottomNav} from "../components/layout/BottomNav";
import {TaskRow} from "../components/tasks/TaskRow";

type CalendarScreenProps = {
    tasks: Task[];
    navigate: (screen: Screen) => void;
};

// Nombres de los meses en español para asegurar compatibilidad en todos los teléfonos
const MONTHS_FULL_ES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function CalendarScreen({tasks, navigate}: CalendarScreenProps) {
    const {colors} = useTheme();

    // Mes que se está visualizando actualmente en la cuadrícula
    const [viewDate, setViewDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );
    // Día seleccionado por el usuario (por defecto hoy en formato "AAAA-MM-DD")
    const [selected, setSelected] = useState(isoDate(today));

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthHeader = `${MONTHS_FULL_ES[month]} de ${year}`;

    // Calcula en qué día de la semana empieza el mes (Lunes = 0 ... Domingo = 6)
    const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    // Calcula cuántos días tiene el mes actual (28, 29, 30 o 31)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Genera las 42 celdas (6 semanas x 7 días) del calendario
    const cells = Array.from({length: 42}, (_, i) => {
        const day = i - startOffset + 1;
        return day > 0 && day <= daysInMonth ? day : null;
    });

    // Filtra las tareas que corresponden al día tocado por el usuario
    const selectedTasks = tasks.filter((task) => task.date === selected);

    // Retrocede (-1) o avanza (+1) un mes
    const changeMonth = (delta: number) => {
        setViewDate(new Date(year, month + delta, 1));
    };

    return (
        <View style={[styles.screenWrapper, {backgroundColor: colors.background}]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Header
                    title="Calendario"
                    action={
                        <TouchableOpacity
                            style={[
                                styles.moreBtn,
                                {backgroundColor: colors.card, borderColor: colors.border},
                            ]}
                        >
                            <Icon name="more" size={20} color={colors.text}/>
                        </TouchableOpacity>
                    }
                />

                {/* Tarjeta del calendario mensual */}
                <View
                    style={[
                        styles.calendarCard,
                        {backgroundColor: colors.card, borderColor: colors.border},
                    ]}
                >
                    {/* Selector de mes (< Octubre de 2026 >) */}
                    <View style={styles.monthSelect}>
                        <TouchableOpacity
                            style={styles.arrowBtn}
                            onPress={() => changeMonth(-1)}
                        >
                            <Icon name="back" size={20} color={colors.text}/>
                        </TouchableOpacity>

                        <Text style={[styles.monthTitle, {color: colors.text}]}>
                            {monthHeader}
                        </Text>

                        <TouchableOpacity
                            style={styles.arrowBtn}
                            onPress={() => changeMonth(1)}
                        >
                            <Icon name="chevron" size={20} color={colors.text}/>
                        </TouchableOpacity>
                    </View>

                    {/* Iniciales de los días de la semana */}
                    <View style={styles.weekdays}>
                        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                            <Text key={d} style={[styles.weekdayText, {color: colors.subtext}]}>
                                {d}
                            </Text>
                        ))}
                    </View>

                    {/* Cuadrícula de días */}
                    <View style={styles.calendarGrid}>
                        {cells.map((day, index) => {
                            if (!day) {
                                return <View key={`empty-${index}`} style={styles.dayCell}/>;
                            }

                            const dateValue = `${year}-${pad(month + 1)}-${pad(day)}`;
                            const hasTasks = tasks.some((t) => t.date === dateValue);
                            const isSelected = selected === dateValue;
                            const isToday = dateValue === isoDate(today);

                            return (
                                <TouchableOpacity
                                    key={dateValue}
                                    style={[
                                        styles.dayCell,
                                        isToday && !isSelected && styles.dayToday,
                                        isSelected && styles.daySelected,
                                    ]}
                                    onPress={() => setSelected(dateValue)}
                                >
                                    <Text
                                        style={[
                                            styles.dayNumber,
                                            {color: colors.text},
                                            isToday && !isSelected && styles.dayNumberToday,
                                            isSelected && styles.dayNumberSelected,
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                    {/* Puntito indicador si ese día tiene tareas registradas */}
                                    {hasTasks && (
                                        <View
                                            style={[
                                                styles.taskDot,
                                                isSelected && {backgroundColor: "#FFFFFF"},
                                            ]}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Lista de tareas del día seleccionado */}
                <View style={styles.dayTasksSection}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.overline}>AGENDA</Text>
                            <Text style={[styles.sectionTitle, {color: colors.text}]}>
                                Tareas del día
                            </Text>
                        </View>
                        <Text style={[styles.taskCount, {color: colors.subtext}]}>
                            {selectedTasks.length} tareas
                        </Text>
                    </View>

                    {selectedTasks.length > 0 ? (
                        selectedTasks.map((task) => (
                            <TaskRow key={task.id} task={task} compact/>
                        ))
                    ) : (
                        <View
                            style={[
                                styles.emptyState,
                                {backgroundColor: colors.card, borderColor: colors.border},
                            ]}
                        >
                            <View style={styles.emptyIconWrap}>
                                <Icon name="calendar" size={26} color="#6254F5"/>
                            </View>
                            <Text style={[styles.emptyTitle, {color: colors.text}]}>
                                Un día libre
                            </Text>
                            <Text style={[styles.emptySub, {color: colors.subtext}]}>
                                No tienes tareas programadas.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Botón flotante para crear tarea */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigate("create")}
                accessibilityLabel="Crear tarea"
            >
                <Icon name="plus" size={26} color="#FFFFFF"/>
            </TouchableOpacity>

            <BottomNav active="calendar" navigate={navigate}/>
        </View>
    );
}

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 90,
    },
    moreBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
    calendarCard: {
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        marginBottom: 22,
    },
    monthSelect: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    arrowBtn: {
        padding: 6,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: "800",
    },
    weekdays: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 8,
    },
    weekdayText: {
        width: "14.28%",
        textAlign: "center",
        fontSize: 12,
        fontWeight: "700",
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayCell: {
        width: "14.28%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    dayToday: {
        backgroundColor: "#EEF2FF",
    },
    daySelected: {
        backgroundColor: "#6254F5",
    },
    dayNumber: {
        fontSize: 14,
        fontWeight: "600",
    },
    dayNumberToday: {
        color: "#6254F5",
        fontWeight: "800",
    },
    dayNumberSelected: {
        color: "#FFFFFF",
        fontWeight: "800",
    },
    taskDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#6254F5",
        marginTop: 3,
    },
    dayTasksSection: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 14,
    },
    overline: {
        fontSize: 11,
        fontWeight: "800",
        color: "#6254F5",
        letterSpacing: 1,
        marginBottom: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
    },
    taskCount: {
        fontSize: 13,
        fontWeight: "600",
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 28,
        borderRadius: 18,
        borderWidth: 1,
    },
    emptyIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 2,
    },
    emptySub: {
        fontSize: 13,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 82,
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#6254F5",
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
    },
});