// src/components/common/Header.tsx
import React, {ReactNode} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useTheme} from "../../context/ThemeContext";
import {Icon} from "./Icon";

type HeaderProps = {
    title: string;
    subtitle?: string;
    back?: () => void;
    action?: ReactNode;
};

export function Header({title, subtitle, back, action}: HeaderProps) {
    const {colors} = useTheme();
    return (
        <View style={styles.screenHeader}>
            <View style={styles.leftRow}>
                {back && (
                    <TouchableOpacity
                        style={[
                            styles.iconButton,
                            {backgroundColor: colors.card, borderColor: colors.border},
                        ]}
                        onPress={back}
                        accessibilityLabel="Volver"
                    >
                        <Icon name="back" size={22} color={colors.text}/>
                    </TouchableOpacity>
                )}
                <View>
                    <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
                    {subtitle && (
                        <Text style={[styles.subtitle, {color: colors.subtext}]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            {action && <View style={styles.headerAction}>{action}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    screenHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        marginBottom: 8,
    },
    leftRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1E1E2D",
    },
    subtitle: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 2,
    },
    headerAction: {
        alignItems: "flex-end",
    },
});