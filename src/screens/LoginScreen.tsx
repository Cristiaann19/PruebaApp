// src/screens/LoginScreen.tsx
import React, {useState} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {Button} from "../components/common/Button";
import {Field} from "../components/common/Field";
import {Icon} from "../components/common/Icon";
import {Logo} from "../components/common/Logo";
import {Modal} from "../components/common/Modal";

type LoginScreenProps = {
    enter: () => void; // Función que navega hacia la pantalla principal ("home")
};

export function LoginScreen({enter}: LoginScreenProps) {
    // Estados del formulario de inicio de sesión
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados del modal de registro
    const [register, setRegister] = useState(false);
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.login}
                keyboardShouldPersistTaps="handled"
            >
                <Logo compact/>

                {/* Encabezado de bienvenida */}
                <View style={styles.loginHeading}>
                    <Text style={styles.eyebrow}>BIENVENIDO DE NUEVO</Text>
                    <Text style={styles.title}>Inicia sesión</Text>
                    <Text style={styles.subtitle}>
                        Continúa organizando tu día con Taskly.
                    </Text>
                </View>

                {/* Formulario principal */}
                <View style={styles.loginForm}>
                    <Field label="Correo electrónico" icon="mail">
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="tu@email.com"
                            placeholderTextColor="#94A3B8"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </Field>

                    <Field label="Contraseña" icon="lock">
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholder="Tu contraseña"
                            placeholderTextColor="#94A3B8"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeButton}
                            accessibilityLabel={
                                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                            }
                        >
                            <Icon
                                name="eye"
                                size={19}
                                color={showPassword ? "#6254F5" : "#94A3B8"}
                            />
                        </TouchableOpacity>
                    </Field>

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <Button full onClick={enter}>
                        Iniciar sesión
                    </Button>
                </View>

                {/* Separador visual */}
                <View style={styles.separator}>
                    <View style={styles.separatorLine}/>
                    <Text style={styles.separatorText}>o continúa con</Text>
                    <View style={styles.separatorLine}/>
                </View>

                {/* Botones de redes sociales */}
                <View style={styles.socialRow}>
                    <Button variant="secondary" style={styles.socialBtn}>
                        G Google
                    </Button>
                    <Button variant="secondary" style={styles.socialBtn}>
                        ● Apple
                    </Button>
                </View>

                {/* Enlace para abrir el modal de registro */}
                <View style={styles.signupRow}>
                    <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
                    <TouchableOpacity onPress={() => setRegister(true)}>
                        <Text style={styles.signupLink}>Regístrate</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal emergente para crear cuenta */}
                {register && (
                    <Modal title="Crea tu cuenta" close={() => setRegister(false)}>
                        <View>
                            <Field label="Nombre completo" icon="user">
                                <TextInput
                                    style={styles.input}
                                    value={regName}
                                    onChangeText={setRegName}
                                    placeholder="Tu nombre"
                                    placeholderTextColor="#94A3B8"
                                />
                            </Field>

                            <Field label="Correo electrónico" icon="mail">
                                <TextInput
                                    style={styles.input}
                                    value={regEmail}
                                    onChangeText={setRegEmail}
                                    placeholder="tu@email.com"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Field>

                            <Field label="Contraseña" icon="lock">
                                <TextInput
                                    style={styles.input}
                                    value={regPassword}
                                    onChangeText={setRegPassword}
                                    secureTextEntry
                                    placeholder="Mínimo 8 caracteres"
                                    placeholderTextColor="#94A3B8"
                                />
                            </Field>

                            <Button
                                full
                                onClick={() => {
                                    setRegister(false);
                                    enter();
                                }}
                            >
                                Crear cuenta
                            </Button>
                        </View>
                    </Modal>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    login: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 30,
        justifyContent: "center",
    },
    loginHeading: {
        marginTop: 28,
        marginBottom: 24,
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: "800",
        color: "#6254F5",
        letterSpacing: 1,
        marginBottom: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1E1E2D",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: "#64748B",
    },
    loginForm: {
        marginBottom: 20,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#1E1E2D",
        paddingVertical: 12,
    },
    eyeButton: {
        padding: 6,
    },
    forgotBtn: {
        alignSelf: "flex-end",
        marginBottom: 18,
    },
    forgotText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6254F5",
    },
    separator: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E2E8F0",
    },
    separatorText: {
        marginHorizontal: 12,
        fontSize: 13,
        color: "#94A3B8",
    },
    socialRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 26,
    },
    socialBtn: {
        flex: 1,
    },
    signupRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    signupText: {
        fontSize: 14,
        color: "#64748B",
    },
    signupLink: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6254F5",
    },
});