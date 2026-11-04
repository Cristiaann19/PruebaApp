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
import {useTheme} from "../context/ThemeContext";
import {login as loginUser, register as registerUser} from "../services/AuthService";

type LoginScreenProps = {
    enter: () => void; // Función que navega hacia la pantalla principal ("home")
};

export function LoginScreen({enter}: LoginScreenProps) {
    const {colors} = useTheme();
    // Estados del formulario de inicio de sesión
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados del modal de registro
    const [registerOpen, setRegisterOpen] = useState(false);
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);

        try {
            await loginUser(email.trim(), password);
            enter();
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setError(null);
        setLoading(true);

        try {
            await registerUser(regName.trim(), regEmail.trim(), regPassword);
            setRegisterOpen(false);
            enter();
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

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
                    <Text style={[styles.eyebrow, {color: colors.primary}]}>
                        BIENVENIDO DE NUEVO
                    </Text>
                    <Text style={[styles.title, {color: colors.text}]}>Inicia sesión</Text>
                    <Text style={[styles.subtitle, {color: colors.subtext}]}>
                        Continúa organizando tu día con Taskly.
                    </Text>
                </View>

                {/* Formulario principal */}
                <View style={styles.loginForm}>
                    <Field label="Correo electrónico" icon="mail">
                        <TextInput
                            style={[styles.input, {color: colors.text}]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="tu@email.com"
                            placeholderTextColor={colors.subtext}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </Field>

                    <Field label="Contraseña" icon="lock">
                        <TextInput
                            style={[styles.input, {color: colors.text}]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholder="Tu contraseña"
                            placeholderTextColor={colors.subtext}
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
                                color={showPassword ? colors.primary : colors.subtext}
                            />
                        </TouchableOpacity>
                    </Field>

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={[styles.forgotText, {color: colors.primary}]}>
                            ¿Olvidaste tu contraseña?
                        </Text>
                    </TouchableOpacity>

                    {error && !registerOpen && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    <Button full disabled={loading} onClick={handleLogin}>
                        {loading ? "Ingresando..." : "Iniciar sesión"}
                    </Button>
                </View>

                {/* Separador visual */}
                <View style={styles.separator}>
                    <View style={[styles.separatorLine, {backgroundColor: colors.border}]}/>
                    <Text style={[styles.separatorText, {color: colors.subtext}]}>
                        o continúa con
                    </Text>
                    <View style={[styles.separatorLine, {backgroundColor: colors.border}]}/>
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
                    <Text style={[styles.signupText, {color: colors.subtext}]}>
                        ¿No tienes una cuenta?{" "}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setError(null);
                            setRegisterOpen(true);
                        }}
                    >
                        <Text style={[styles.signupLink, {color: colors.primary}]}>
                            Regístrate
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Modal emergente para crear cuenta */}
                {registerOpen && (
                    <Modal title="Crea tu cuenta" close={() => setRegisterOpen(false)}>
                        <View>
                            <Field label="Nombre completo" icon="user">
                                <TextInput
                                    style={[styles.input, {color: colors.text}]}
                                    value={regName}
                                    onChangeText={setRegName}
                                    placeholder="Tu nombre"
                                    placeholderTextColor={colors.subtext}
                                />
                            </Field>

                            <Field label="Correo electrónico" icon="mail">
                                <TextInput
                                    style={[styles.input, {color: colors.text}]}
                                    value={regEmail}
                                    onChangeText={setRegEmail}
                                    placeholder="tu@email.com"
                                    placeholderTextColor={colors.subtext}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Field>

                            <Field label="Contraseña" icon="lock">
                                <TextInput
                                    style={[styles.input, {color: colors.text}]}
                                    value={regPassword}
                                    onChangeText={setRegPassword}
                                    secureTextEntry
                                    placeholder="Mínimo 8 caracteres"
                                    placeholderTextColor={colors.subtext}
                                />
                            </Field>

                            {error && (
                                <Text style={styles.errorText}>{error}</Text>
                            )}

                            <Button full disabled={loading} onClick={handleRegister}>
                                {loading ? "Creando cuenta..." : "Crear cuenta"}
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
    errorText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#EF4444",
        marginBottom: 12,
        textAlign: "center",
    },
});