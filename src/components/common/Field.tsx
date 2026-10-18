// src/components/common/Field.tsx
import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "./Icon";

type FieldProps = {
    label?: string;
    icon?: string;
    error?: string;
    children: ReactNode;
};

export function Field({ label, icon, error, children }: FieldProps) {
    return (
        <View style={styles.fieldWrap}>
            {/* Etiqueta superior del campo */}
            {label && <Text style={styles.fieldLabel}>{label}</Text>}

            {/* Caja del input con ícono opcional */}
            <View style={[styles.fieldControl, error ? styles.hasError : null]}>
                {icon && (
                    <View style={styles.iconWrap}>
                        <Icon name={icon} size={19} color="#94A3B8" />
                    </View>
                )}
                <View style={styles.inputContainer}>{children}</View>
            </View>

            {/* Mensaje de error debajo de la caja */}
            {error ? <Text style={styles.fieldError}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    fieldWrap: {
        marginBottom: 16,
        flex: 1,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#334155",
        marginBottom: 6,
    },
    fieldControl: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        paddingHorizontal: 14,
        minHeight: 50,
    },
    hasError: {
        borderColor: "#EF4444",
    },
    iconWrap: {
        marginRight: 10,
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    fieldError: {
        fontSize: 12,
        color: "#EF4444",
        marginTop: 4,
        fontWeight: "500",
    },
});