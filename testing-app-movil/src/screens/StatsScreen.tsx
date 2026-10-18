import React, {useState} from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, {Circle} from "react-native-svg";
import {Category, Screen, Task} from "../types";
import {useTheme} from "../context/ThemeContext";
import {Header} from "../components/common/Header";
import {BottomNav} from "../components/layout/BottomNav";

type StatsScreenProps = {
    tasks: Task[];
    navigate: (screen: Screen) => void;
};

export function StatsScreen({tasks, navigate}: StatsScreenProps) {
    const {colors} = useTheme();
    const [period, setPeriod] = useState("Semana");

    // 1. CÁLCULOS EN TIEMPO REAL A PARTIR DE LOS DATOS
    const total = tasks.length;
    const complete = tasks.filter((task) => task.completed).length;
    const pending = total - complete;
    const inProgress = Math.min(1, pending);
    const percent = Math.round((complete / Math.max(total, 1)) * 100);

    const categories = (
        ["Estudio", "Trabajo", "Personal", "General"] as Category[]
    ).map((name) => ({
        name,
        count: tasks.filter((task) => task.category === name).length,
    }));

    const size = 120;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius; // Fórmula: 2 * π * radio
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    const barColors = ["#6254F5", "#22C55E", "#F59E0B", "#EC4899"];

    return (
        <View style={[styles.screenWrapper, {backgroundColor: colors.background}]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Header
                    title="Estadísticas"
                    subtitle="Tu productividad en tiempo real"
                />

                {/* Pestañas de periodo: Semana, Mes, Año */}
                <View
                    style={[
                        styles.periodTabs,
                        {backgroundColor: colors.card, borderColor: colors.border},
                    ]}
                >
                    {["Semana", "Mes", "Año"].map((item) => {
                        const isActive = period === item;
                        return (
                            <TouchableOpacity
                                key={item}
                                style={[styles.periodTab, isActive && styles.periodTabActive]}
                                onPress={() => setPeriod(item)}
                            >
                                <Text
                                    style={[
                                        styles.periodTabText,
                                        {color: colors.subtext},
                                        isActive && styles.periodTabTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Tarjeta del Gráfico Circular (Donut) en Tiempo Real */}
                <View
                    style={[
                        styles.card,
                        {backgroundColor: colors.card, borderColor: colors.border},
                    ]}
                >
                    <View style={styles.sectionTitleRow}>
                        <Text style={[styles.sectionTitle, {color: colors.text}]}>
                            Resumen de tareas
                        </Text>
                        <Text style={[styles.sectionSub, {color: colors.subtext}]}>
                            Esta {period.toLowerCase()}
                        </Text>
                    </View>

                    <View style={styles.donutLayout}>
                        {/* Gráfico SVG */}
                        <View style={styles.donutContainer}>
                            <Svg width={size} height={size}>
                                {/* Anillo de fondo (Pendientes - Amarillo/Gris suave) */}
                                <Circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke="#FEF3C7"
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                />
                                {/* Anillo dinámico (Completadas - Verde) */}
                                <Circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke="#22C55E"
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    rotation="-90"
                                    origin={`${size / 2}, ${size / 2}`}
                                />
                            </Svg>
                            {/* Número total en el centro del anillo */}
                            <View style={styles.donutCenter}>
                                <Text style={[styles.donutTotal, {color: colors.text}]}>
                                    {total}
                                </Text>
                                <Text style={[styles.donutLabel, {color: colors.subtext}]}>
                                    Tareas
                                </Text>
                            </View>
                        </View>

                        {/* Leyenda a la derecha del gráfico */}
                        <View style={styles.legend}>
                            <View style={styles.legendRow}>
                                <View style={[styles.legendDot, {backgroundColor: "#22C55E"}]}/>
                                <Text style={[styles.legendText, {color: colors.subtext}]}>
                                    <Text style={[styles.legendBold, {color: colors.text}]}>
                                        {complete}{" "}
                                    </Text>
                                    Completadas
                                </Text>
                            </View>

                            <View style={styles.legendRow}>
                                <View style={[styles.legendDot, {backgroundColor: "#F59E0B"}]}/>
                                <Text style={[styles.legendText, {color: colors.subtext}]}>
                                    <Text style={[styles.legendBold, {color: colors.text}]}>
                                        {pending}{" "}
                                    </Text>
                                    Pendientes
                                </Text>
                            </View>

                            <View style={styles.legendRow}>
                                <View style={[styles.legendDot, {backgroundColor: "#6254F5"}]}/>
                                <Text style={[styles.legendText, {color: colors.subtext}]}>
                                    <Text style={[styles.legendBold, {color: colors.text}]}>
                                        {inProgress}{" "}
                                    </Text>
                                    En progreso
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Tarjeta de puntaje de productividad */}
                <View style={styles.productivityCard}>
                    <View style={styles.scoreRing}>
                        <Text style={styles.scoreText}>{percent}%</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.prodOverline}>PRODUCTIVIDAD</Text>
                        <Text style={styles.prodTitle}>¡Vas por buen camino!</Text>
                        <Text style={styles.prodSub}>
                            Completaste {complete} de {total} tareas.
                        </Text>
                    </View>
                </View>

                {/* Tarjeta de barras por Categoría en Tiempo Real */}
                <View
                    style={[
                        styles.card,
                        {backgroundColor: colors.card, borderColor: colors.border},
                    ]}
                >
                    <View style={styles.sectionTitleRow}>
                        <Text style={[styles.sectionTitle, {color: colors.text}]}>
                            Por categoría
                        </Text>
                        <Text style={[styles.sectionSub, {color: colors.subtext}]}>
                            {total} total
                        </Text>
                    </View>

                    <View style={styles.categoryBars}>
                        {categories.map((item, index) => {
                            const barWidth = Math.round(
                                (item.count / Math.max(total, 1)) * 100
                            );
                            return (
                                <View key={item.name} style={styles.barRow}>
                                    <View style={styles.barHeader}>
                                        <Text style={[styles.barName, {color: colors.text}]}>
                                            {item.name}
                                        </Text>
                                        <Text style={[styles.barCount, {color: colors.text}]}>
                                            {item.count}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.barTrack,
                                            {backgroundColor: colors.border},
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.barFill,
                                                {
                                                    width: `${barWidth}%`,
                                                    backgroundColor: barColors[index % barColors.length],
                                                },
                                            ]}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <BottomNav active="stats" navigate={navigate}/>
        </View>
    );
}

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    periodTabs: {
        flexDirection: "row",
        borderRadius: 14,
        padding: 4,
        borderWidth: 1,
        marginBottom: 18,
    },
    periodTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        borderRadius: 10,
    },
    periodTabActive: {
        backgroundColor: "#6254F5",
    },
    periodTabText: {
        fontSize: 13,
        fontWeight: "700",
    },
    periodTabTextActive: {
        color: "#FFFFFF",
    },
    card: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "800",
    },
    sectionSub: {
        fontSize: 12,
        fontWeight: "600",
    },
    donutLayout: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    donutContainer: {
        width: 120,
        height: 120,
        alignItems: "center",
        justifyContent: "center",
    },
    donutCenter: {
        position: "absolute",
        alignItems: "center",
    },
    donutTotal: {
        fontSize: 22,
        fontWeight: "800",
    },
    donutLabel: {
        fontSize: 11,
        fontWeight: "600",
    },
    legend: {
        gap: 10,
    },
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 13,
    },
    legendBold: {
        fontWeight: "800",
    },
    productivityCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6254F5",
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        gap: 16,
    },
    scoreRing: {
        width: 58,
        height: 58,
        borderRadius: 29,
        borderWidth: 4,
        borderColor: "rgba(255,255,255,0.35)",
        alignItems: "center",
        justifyContent: "center",
    },
    scoreText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800",
    },
    prodOverline: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
    },
    prodTitle: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
        marginVertical: 2,
    },
    prodSub: {
        color: "rgba(255,255,255,0.85)",
        fontSize: 13,
    },
    categoryBars: {
        gap: 14,
    },
    barRow: {
        gap: 6,
    },
    barHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    barName: {
        fontSize: 13,
        fontWeight: "600",
    },
    barCount: {
        fontSize: 13,
        fontWeight: "800",
    },
    barTrack: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden",
    },
    barFill: {
        height: "100%",
        borderRadius: 4,
    },
});