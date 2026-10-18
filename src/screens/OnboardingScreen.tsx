// src/screens/OnboardingScreen.tsx
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import Svg, {Path} from "react-native-svg";
import {Button} from "../components/common/Button";
import {Icon} from "../components/common/Icon";
import {Logo} from "../components/common/Logo";
import {useTheme} from "../context/ThemeContext";

// Datos de las 3 pantallas de introducción
const onboardingData = [
    {
        title: "Gestiona tus tareas fácilmente",
        text: "Crea, organiza y completa tus tareas desde cualquier lugar",
        kind: "tasks",
    },
    {
        title: "No olvides lo importante",
        text: "Recibe recordatorios y mantén tu productividad al máximo",
        kind: "reminders",
    },
    {
        title: "Cumple tus metas",
        text: "Da seguimiento a tu progreso y celebra tus logros",
        kind: "goals",
    },
];

/**
 * Subcomponente que dibuja la ilustración central según el tipo ("tasks", "reminders", "goals").
 */
function OnboardingArt({kind}: { kind: string }) {
    const {colors} = useTheme();
    return (
        <View style={styles.artContainer}>
            {/* Círculo suave de fondo */}
            <View style={[styles.artBlob, {backgroundColor: colors.primarySoft}]}/>

            {/* Ilustración 1: Hoja de tareas y reloj */}
            {kind === "tasks" && (
                <View style={styles.artWrapper}>
                    <View style={[styles.paper, {backgroundColor: colors.card}]}>
                        <View style={[styles.paperLine, {backgroundColor: colors.border}]}/>
                        <View
                            style={[
                                styles.paperLine,
                                {width: "75%", backgroundColor: colors.border},
                            ]}
                        />
                        <View
                            style={[
                                styles.paperLine,
                                {width: "55%", backgroundColor: colors.border},
                            ]}
                        />
                    </View>
                    <View style={[styles.floatingBadge, {backgroundColor: colors.card}]}>
                        <Icon name="clock" size={40} color="#6254F5"/>
                    </View>
                </View>
            )}

            {/* Ilustración 2: Calendario y campana de notificación */}
            {kind === "reminders" && (
                <View style={styles.artWrapper}>
                    <View style={[styles.calendarCard, {backgroundColor: colors.card}]}>
                        <Icon name="calendar" size={76} color="#6254F5"/>
                    </View>
                    <View
                        style={[
                            styles.floatingBadge,
                            styles.bellBadge,
                            {backgroundColor: colors.card},
                        ]}
                    >
                        <Icon name="bell" size={34} color="#F59E0B"/>
                    </View>
                </View>
            )}

            {/* Ilustración 3: Trofeo vectorial de metas */}
            {kind === "goals" && (
                <Svg width={140} height={140} viewBox="0 0 140 140">
                    <Path
                        d="M45 27h50v28c0 23-12 38-25 38S45 78 45 55V27Z"
                        fill="#FFBE55"
                    />
                    <Path
                        d="M46 39H27c0 26 12 34 28 34M94 39h19c0 26-12 34-28 34"
                        fill="none"
                        stroke="#F0A62C"
                        strokeWidth="9"
                        strokeLinecap="round"
                    />
                    <Path
                        d="M70 91v19M50 120h40"
                        fill="none"
                        stroke="#6254F5"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />
                    <Path
                        d="m70 40 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z"
                        fill="#FFF6D9"
                    />
                </Svg>
            )}
        </View>
    );
}

// Propiedades que recibe la pantalla Onboarding
type OnboardingProps = {
    index: number; // 0, 1 o 2
    next: () => void; // Avanza a la siguiente diapositiva o al Login
    skip: () => void; // Salta directamente al Login
};

export function OnboardingScreen({index, next, skip}: OnboardingProps) {
    const {colors} = useTheme();
    const item = onboardingData[index] || onboardingData[0];

    return (
        <View style={styles.onboarding}>
            {/* Barra superior con el logo compacto y el botón "Saltar" */}
            <View style={styles.onboardingTop}>
                <Logo compact/>
                {index < 2 && (
                    <Button variant="ghost" onClick={skip}>
                        Saltar
                    </Button>
                )}
            </View>

            {/* Ilustración central */}
            <OnboardingArt kind={item.kind}/>

            {/* Indicadores de puntos (dots), título y descripción */}
            <View style={styles.onboardingCopy}>
                <View style={styles.dots}>
                    {[0, 1, 2].map((dot) => (
                        <View
                            key={dot}
                            style={[
                                styles.dot,
                                {backgroundColor: colors.border},
                                dot === index && styles.dotActive,
                                dot === index && {backgroundColor: colors.primary},
                            ]}
                        />
                    ))}
                </View>
                <Text style={[styles.title, {color: colors.text}]}>{item.title}</Text>
                <Text style={[styles.description, {color: colors.subtext}]}>
                    {item.text}
                </Text>
            </View>

            {/* Botón inferior para avanzar */}
            <Button full onClick={next}>
                {index === 2 ? "Comenzar  →" : "Siguiente  →"}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    onboarding: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 28,
        justifyContent: "space-between",
    },
    onboardingTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 44,
    },
    artContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 240,
    },
    artBlob: {
        position: "absolute",
        width: 210,
        height: 210,
        borderRadius: 105,
        backgroundColor: "#EEF2FF",
    },
    artWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        width: 110,
        height: 135,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        justifyContent: "center",
        gap: 12,
        elevation: 4,
        shadowColor: "#6254F5",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.12,
        shadowRadius: 10,
    },
    paperLine: {
        height: 8,
        backgroundColor: "#CBD5E1",
        borderRadius: 4,
        width: "100%",
    },
    calendarCard: {
        width: 120,
        height: 120,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#6254F5",
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.12,
        shadowRadius: 10,
    },
    floatingBadge: {
        position: "absolute",
        bottom: -12,
        right: -20,
        backgroundColor: "#FFFFFF",
        padding: 10,
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    bellBadge: {
        backgroundColor: "#FFFBEB",
    },
    onboardingCopy: {
        alignItems: "center",
    },
    dots: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#CBD5E1",
    },
    dotActive: {
        width: 24,
        backgroundColor: "#6254F5",
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#1E1E2D",
        textAlign: "center",
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: 12,
    },
});