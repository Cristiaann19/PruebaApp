import React, {ReactNode, useState} from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {Screen} from "../types";
import {useTheme} from "../context/ThemeContext";
import {Button} from "../components/common/Button";
import {Header} from "../components/common/Header";
import {Icon} from "../components/common/Icon";
import {BottomNav} from "../components/layout/BottomNav";

// Subcomponente para cada fila de ajuste
type SettingRowProps = {
    icon: string;
    title: string;
    detail?: string;
    iconBg: string;
    iconColor: string;
    action?: ReactNode;
    onClick?: () => void;
};

function SettingRow({
                        icon,
                        title,
                        detail,
                        iconBg,
                        iconColor,
                        action,
                        onClick,
                    }: SettingRowProps) {
    const {colors} = useTheme();
    return (
        <TouchableOpacity
            style={[styles.settingRow, {borderBottomColor: colors.border}]}
            onPress={onClick}
            activeOpacity={0.75}
        >
            <View style={[styles.settingIcon, {backgroundColor: iconBg}]}>
                <Icon name={icon} size={20} color={iconColor}/>
            </View>
            <View style={styles.settingCopy}>
                <Text style={[styles.settingTitle, {color: colors.text}]}>
                    {title}
                </Text>
                {detail && (
                    <Text style={[styles.settingDetail, {color: colors.subtext}]}>
                        {detail}
                    </Text>
                )}
            </View>
            {action || <Icon name="chevron" size={18} color={colors.subtext}/>}
        </TouchableOpacity>
    );
}

type SettingsScreenProps = {
    navigate: (screen: Screen) => void;
    logout: () => void;
};

export function SettingsScreen({navigate, logout}: SettingsScreenProps) {
    // Conectamos la pantalla al estado global de Modo Oscuro
    const {theme, isDark, colors, toggleTheme} = useTheme();

    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState("Español");

    return (
        <View style={[styles.screenWrapper, {backgroundColor: colors.background}]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Header title="Ajustes"/>

                {/* Tarjeta de Perfil */}
                <View
                    style={[
                        styles.profileCard,
                        {backgroundColor: colors.card, borderColor: colors.border},
                    ]}
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>CH</Text>
                        <View style={styles.onlineDot}/>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={[styles.profileName, {color: colors.text}]}>
                            Cristian Huamán
                        </Text>
                        <Text style={[styles.profileEmail, {color: colors.subtext}]}>
                            cristian@email.com
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.editProfileBtn}>
                        <Icon name="edit" size={18} color="#6254F5"/>
                    </TouchableOpacity>
                </View>

                {/* Grupo 1: Preferencias */}
                <View style={styles.settingsGroup}>
                    <Text style={[styles.groupTitle, {color: colors.subtext}]}>
                        PREFERENCIAS
                    </Text>
                    <View
                        style={[
                            styles.settingsCard,
                            {backgroundColor: colors.card, borderColor: colors.border},
                        ]}
                    >
                        <SettingRow
                            icon="bell"
                            title="Notificaciones"
                            detail={notifications ? "Activadas" : "Desactivadas"}
                            iconBg="#EEF2FF"
                            iconColor="#6254F5"
                            onClick={() => setNotifications(!notifications)}
                            action={
                                <View
                                    style={[
                                        styles.switchTrack,
                                        notifications && styles.switchTrackOn,
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.switchThumb,
                                            notifications && styles.switchThumbOn,
                                        ]}
                                    />
                                </View>
                            }
                        />

                        {/* Interruptor que activa el Modo Oscuro en toda la aplicación */}
                        <SettingRow
                            icon="settings"
                            title="Tema de la aplicación"
                            detail={theme}
                            iconBg="#E0F2FE"
                            iconColor="#0284C7"
                            onClick={toggleTheme}
                            action={
                                <View
                                    style={[styles.switchTrack, isDark && styles.switchTrackOn]}
                                >
                                    <View
                                        style={[styles.switchThumb, isDark && styles.switchThumbOn]}
                                    />
                                </View>
                            }
                        />

                        <SettingRow
                            icon="globe"
                            title="Idioma"
                            detail={language}
                            iconBg="#DCFCE7"
                            iconColor="#16A34A"
                            onClick={() =>
                                setLanguage(language === "Español" ? "English" : "Español")
                            }
                        />
                    </View>
                </View>

                {/* Grupo 2: Más información */}
                <View style={styles.settingsGroup}>
                    <Text style={[styles.groupTitle, {color: colors.subtext}]}>MÁS</Text>
                    <View
                        style={[
                            styles.settingsCard,
                            {backgroundColor: colors.card, borderColor: colors.border},
                        ]}
                    >
                        <SettingRow
                            icon="help"
                            title="Ayuda y soporte"
                            iconBg="#FEF3C7"
                            iconColor="#D97706"
                        />
                        <SettingRow
                            icon="info"
                            title="Acerca de Taskly"
                            detail="Versión 1.0.0"
                            iconBg="#FCE7F3"
                            iconColor="#DB2777"
                        />
                    </View>
                </View>

                {/* Botón de Cerrar Sesión */}
                <Button variant="danger" full onClick={logout}>
                    Cerrar sesión
                </Button>

                <Text style={[styles.madeWith, {color: colors.subtext}]}>
                    Taskly · Organiza. Enfócate. Logra más.
                </Text>
            </ScrollView>

            <BottomNav active="settings" navigate={navigate}/>
        </View>
    );
}

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 22,
        gap: 14,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#6254F5",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "800",
    },
    onlineDot: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#22C55E",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    profileName: {
        fontSize: 17,
        fontWeight: "800",
    },
    profileEmail: {
        fontSize: 13,
        marginTop: 2,
    },
    editProfileBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
    },
    settingsGroup: {
        marginBottom: 20,
    },
    groupTitle: {
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 0.8,
        marginBottom: 8,
        marginLeft: 4,
    },
    settingsCard: {
        borderRadius: 18,
        borderWidth: 1,
        overflow: "hidden",
    },
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderBottomWidth: 1,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    settingCopy: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: "700",
    },
    settingDetail: {
        fontSize: 12,
        marginTop: 2,
    },
    switchTrack: {
        width: 46,
        height: 26,
        borderRadius: 13,
        backgroundColor: "#CBD5E1",
        padding: 3,
        justifyContent: "center",
    },
    switchTrackOn: {
        backgroundColor: "#6254F5",
    },
    switchThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
    },
    switchThumbOn: {
        alignSelf: "flex-end",
    },
    madeWith: {
        textAlign: "center",
        fontSize: 12,
        marginTop: 18,
    },
});