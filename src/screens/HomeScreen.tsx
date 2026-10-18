// src/screens/HomeScreen.tsx
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Screen, Task } from "../types";
import { Icon } from "../components/common/Icon";
import { BottomNav } from "../components/layout/BottomNav";
import { TaskRow } from "../components/tasks/TaskRow";

type HomeScreenProps = {
    tasks: Task[]; // Lista completa de tareas recibida desde App.tsx
    navigate: (screen: Screen) => void; // Función para cambiar de pantalla
    toggle: (id: number) => void; // Función para marcar/desmarcar una tarea
};

type FilterType = "Todas" | "Pendientes" | "Completadas";

export function HomeScreen({ tasks, navigate, toggle }: HomeScreenProps) {
    // Estado para controlar qué filtro está activo
    const [filter, setFilter] = useState<FilterType>("Todas");

    // Calculamos cuántas tareas están completadas y el porcentaje total
    const completedCount = tasks.filter((task) => task.completed).length;
    const totalCount = tasks.length;
    const progressPercent = Math.round(
        (completedCount / Math.max(totalCount, 1)) * 100
    );

    // Filtramos las tareas según la pestaña seleccionada por el usuario
    const filteredTasks = tasks.filter((task) => {
        if (filter === "Todas") return true;
        if (filter === "Completadas") return task.completed;
        return !task.completed;
    });

    return (
        <View style={styles.screenWrapper}>
            {/* Área deslizable con todo el contenido del inicio */}
            <ScrollView
                style={styles.appScroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Encabezado con saludo y campana de notificación */}
                <View style={styles.homeHeader}>
                    <View>
                        <Text style={styles.overline}>MI DÍA</Text>
                        <Text style={styles.greeting}>Hola, Cristian 👋</Text>
                        <Text style={styles.subtitle}>Aquí tienes tus tareas de hoy</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.notificationBtn}
                        accessibilityLabel="Notificaciones"
                    >
                        <Icon name="bell" size={22} color="#1E1E2D" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                {/* 2. Tarjeta morada de progreso del día */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progreso de hoy</Text>
                        <Text style={styles.progressValue}>{progressPercent}%</Text>
                    </View>
                    <Text style={styles.progressSubtext}>
                        ¡Sigue así! Cada tarea te acerca a tu meta.
                    </Text>
                    <View style={styles.progressTrack}>
                        <View
                            style={[styles.progressFill, { width: `${progressPercent}%` }]}
                        />
                    </View>
                </View>

                {/* 3. Cuadrícula de 3 tarjetas de resumen (Total, Completadas, Pendientes) */}
                <View style={styles.statGrid}>
                    <View style={[styles.statCard, styles.statTotal]}>
                        <View style={[styles.statIconWrap, { backgroundColor: "#EEF2FF" }]}>
                            <Icon name="calendar" size={18} color="#6254F5" />
                        </View>
                        <Text style={styles.statNumber}>{totalCount}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>

                    <View style={[styles.statCard, styles.statDone]}>
                        <View style={[styles.statIconWrap, { backgroundColor: "#DCFCE7" }]}>
                            <Icon name="check" size={18} color="#16A34A" />
                        </View>
                        <Text style={styles.statNumber}>{completedCount}</Text>
                        <Text style={styles.statLabel}>Completadas</Text>
                    </View>

                    <View style={[styles.statCard, styles.statPending]}>
                        <View style={[styles.statIconWrap, { backgroundColor: "#FEF3C7" }]}>
                            <Icon name="clock" size={18} color="#D97706" />
                        </View>
                        <Text style={styles.statNumber}>{totalCount - completedCount}</Text>
                        <Text style={styles.statLabel}>Pendientes</Text>
                    </View>
                </View>

                {/* 4. Sección de lista de tareas y botones de filtro */}
                <View style={styles.tasksSection}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionTitle}>Mis tareas</Text>
                        <Text style={styles.sectionCount}>
                            {filteredTasks.length} tareas
                        </Text>
                    </View>

                    {/* Botones de filtro: Todas, Pendientes, Completadas */}
                    <View style={styles.filtersRow}>
                        {(["Todas", "Pendientes", "Completadas"] as const).map((item) => {
                            const isActive = filter === item;
                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.filterChip,
                                        isActive && styles.filterChipActive,
                                    ]}
                                    onPress={() => setFilter(item)}
                                >
                                    <Text
                                        style={[
                                            styles.filterChipText,
                                            isActive && styles.filterChipTextActive,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Lista de tareas o estado vacío si no hay resultados */}
                    <View style={styles.taskList}>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
                                <TaskRow key={task.id} task={task} toggle={toggle} />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconCircle}>
                                    <Icon name="check" size={28} color="#6254F5" />
                                </View>
                                <Text style={styles.emptyTitle}>Todo despejado</Text>
                                <Text style={styles.emptySubtitle}>
                                    No hay tareas en esta vista.
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Botón flotante de acción rápida (FAB) */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.85}
                onPress={() => navigate("create")}
                accessibilityLabel="Crear tarea"
            >
                <Icon name="plus" size={26} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Barra de navegación inferior fija */}
            <BottomNav active="home" navigate={navigate} />
        </View>
    );
}

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
        backgroundColor: "#F8F9FE",
    },
    appScroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 90, // Espacio extra abajo para que el botón flotante no tape la última tarea
    },
    homeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    overline: {
        fontSize: 11,
        fontWeight: "800",
        color: "#6254F5",
        letterSpacing: 1,
        marginBottom: 4,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1E1E2D",
    },
    subtitle: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 2,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    notificationDot: {
        position: "absolute",
        top: 10,
        right: 11,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#EF4444",
    },
    progressCard: {
        backgroundColor: "#6254F5",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        elevation: 4,
        shadowColor: "#6254F5",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    progressLabel: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 14,
        fontWeight: "600",
    },
    progressValue: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "800",
    },
    progressSubtext: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 13,
        marginBottom: 14,
    },
    progressTrack: {
        height: 8,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
    },
    statGrid: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        alignItems: "flex-start",
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    statTotal: {},
    statDone: {},
    statPending: {},
    statIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1E1E2D",
    },
    statLabel: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 2,
    },
    tasksSection: {
        flex: 1,
    },
    sectionTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1E1E2D",
    },
    sectionCount: {
        fontSize: 13,
        color: "#64748B",
        fontWeight: "600",
    },
    filtersRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    filterChipActive: {
        backgroundColor: "#6254F5",
        borderColor: "#6254F5",
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#64748B",
    },
    filterChipTextActive: {
        color: "#FFFFFF",
    },
    taskList: {
        marginTop: 4,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        paddingVertical: 36,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    emptyIconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E1E2D",
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: "#64748B",
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
        shadowColor: "#6254F5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
    },
});