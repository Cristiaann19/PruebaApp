// src/screens/SplashScreen.tsx
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Logo} from "../components/common/Logo";

/**
 * Pantalla de bienvenida (Splash) que se muestra al abrir la aplicación.
 * Utiliza el fondo morado principal y el logo en versión clara.
 */
export function SplashScreen() {
    return (
        <View style={styles.container}>
            {/* Figuras circulares decorativas en el fondo */}
            <View style={[styles.splashShape, styles.shapeOne]}/>
            <View style={[styles.splashShape, styles.shapeTwo]}/>

            {/* Contenido central: Logo y eslogan */}
            <View style={styles.splashContent}>
                <Logo light/>
                <Text style={styles.tagline}>Organiza. Enfócate. Logra más.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#6254F5",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    splashShape: {
        position: "absolute",
        borderRadius: 999,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    shapeOne: {
        width: 280,
        height: 280,
        top: -60,
        right: -80,
    },
    shapeTwo: {
        width: 340,
        height: 340,
        bottom: -100,
        left: -120,
    },
    splashContent: {
        alignItems: "center",
        gap: 14,
    },
    tagline: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 15,
        fontWeight: "500",
        marginTop: 8,
    },
});