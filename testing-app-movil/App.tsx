import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {ThemeProvider, useTheme} from "./src/context/ThemeContext";

import {Screen, Task} from "./src/types";
import {Icon} from "./src/components/common/Icon";
import {
    fetchTasks,
    postTask,
    toggleTaskInServer,
    deleteTaskFromServer,
    updateTaskInServer,
} from "./src/services/TaskService";
import {clearSession, getToken, getStoredUser} from "./src/services/AuthService";
import {SplashScreen} from "./src/screens/SplashScreen";
import {OnboardingScreen} from "./src/screens/OnboardingScreen";
import {LoginScreen} from "./src/screens/LoginScreen";
import {HomeScreen} from "./src/screens/HomeScreen";
import {CreateTaskScreen} from "./src/screens/CreateTaskScreen";
import {CalendarScreen} from "./src/screens/CalendarScreen";
import {StatsScreen} from "./src/screens/StatsScreen";
import {SettingsScreen} from "./src/screens/SettingsScreen";

function MainApp() {
    const {colors, isDark} = useTheme();
    const [userName, setUserName] = useState<string>("");
    const [screen, setScreen] = useState<Screen>("splash");
    const [toast, setToast] = useState<string>("");
    // Ahora la lista inicia vacía y se llena con lo que venga de MySQL
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const loadUserName = useCallback(async () => {
        const user = await getStoredUser();
        setUserName(user?.name ?? "");
    }, []);

    // 1. FUNCIÓN: Cargar las tareas desde Spring Boot (MySQL)
    const loadTasksFromBackend = useCallback(async () => {
        try {
            const serverTasks = await fetchTasks();
            setTasks(serverTasks);
        } catch (error) {
            console.error("Error al conectar con Spring Boot:", error);

            if (error instanceof Error && error.message.includes("HTTP 401")) {
                await clearSession();
                setTasks([]);
                setUserName("");
                setScreen("login");
                return;
            }

            setToast("Modo sin conexión: verifica tu servidor");
        }
    }, []);

    // 2. EFECTO: Restaurar la sesión guardada al abrir la app
    useEffect(() => {
        const restoreSession = async () => {
            const token = await getToken();

            if (!token) {
                return;
            }

            await loadUserName();
            setScreen("home");
            await loadTasksFromBackend();
        };

        restoreSession();
    }, [loadTasksFromBackend, loadUserName]);

    // 2. EFECTO: Temporizador de la pantalla Splash (1.5 segundos)
    useEffect(() => {
        if (screen !== "splash") return;
        const timer = setTimeout(() => setScreen("onboarding-1"), 1500);
        return () => clearTimeout(timer);
    }, [screen]);

    // 3. EFECTO: Ocultar mensaje flotante (toast) después de 2.6 segundos
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(""), 2600);
        return () => clearTimeout(timer);
    }, [toast]);

    const navigate = (target: Screen) => setScreen(target);

    // Entra al home solo después de un login/registro exitoso
    const enter = async () => {
        await loadUserName();   // NUEVO
        setScreen("home");
        await loadTasksFromBackend();
    };

    // Cierra la sesión y vuelve al login
    const logout = async () => {
        await clearSession();
        setTasks([]);
        setUserName("");
        setScreen("login");
    };

    /**
     * 4. FUNCIÓN: Marcar o desmarcar tarea en la base de datos MySQL.
     */

    const toggleTask = async (id: number) => {
        if (id == null || !Number.isInteger(id) || id <= 0) {
            console.error("ID inválido al actualizar la tarea:", id);
            setToast("No se encontró el ID de la tarea");
            return;
        }

        try {
            console.log("ID de la tarea seleccionada:", id);

            const updatedTask = await toggleTaskInServer(id);

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === id ? updatedTask : task
                )
            );

            console.log("Tarea actualizada correctamente:", updatedTask);
        } catch (error) {
            console.error("No se pudo actualizar la tarea:", error);
            setToast("Error al actualizar en la base de datos");
        }
    };

    /**
     * 5. FUNCIÓN: Eliminar una tarea de la base de datos MySQL.
     */
    const deleteTask = async (id: number) => {
        if (id == null || !Number.isInteger(id) || id <= 0) {
            console.error("ID inválido al eliminar la tarea:", id);
            setToast("No se encontró el ID de la tarea");
            return;
        }

        try {
            console.log("Eliminando tarea con ID:", id);

            await deleteTaskFromServer(id);

            setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
            setToast("Tarea eliminada");
        } catch (error) {
            console.error("No se pudo eliminar la tarea:", error);
            setToast("Error al eliminar la tarea");
        }
    };

    /**
     * 6. FUNCIÓN: Iniciar la edición de una tarea existente.
     */
    const startEdit = (task: Task) => {
        setTaskToEdit(task);
        setScreen("edit");
    };

    /**
     * 7. FUNCIÓN: Editar una tarea existente y guardarla en MySQL.
     */
    const editTask = async (id: number, data: Omit<Task, "id">) => {
        try {
            console.log("Editando tarea con ID:", id, data);

            const updatedTask = await updateTaskInServer(id, data);

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === id ? updatedTask : task
                )
            );

            setTaskToEdit(null);
            setToast("Tarea actualizada");
            setScreen("home");
        } catch (error) {
            console.error("No se pudo editar la tarea:", error);
            setToast("Error al actualizar la tarea");
        }
    };


    /**
     * 8. FUNCIÓN: Crear una nueva tarea y guardarla en MySQL.
     */
    const addTask = async (newTaskData: Omit<Task, "id" | "completed">) => {
        try {
            // Preparamos el objeto que espera nuestro TaskController en Java
            const payload: Omit<Task, "id"> = {
                ...newTaskData,
                completed: false,
                repeat: newTaskData.repeat ?? false,
            };

            // Enviamos por POST a Spring Boot y recibimos la tarea con su ID de MySQL
            const savedTask = await postTask(payload);

            // La agregamos al principio de nuestra lista en pantalla
            setTasks((currentTasks) => [savedTask, ...currentTasks]);
            setToast("Tarea guardada en MySQL");
            setScreen("home");
        } catch (error) {
            console.error("No se pudo guardar la tarea:", error);
            setToast("Error al guardar en el servidor");
        }
    };

    // 6. SELECTOR DE PANTALLA
    const content = useMemo(() => {
        switch (screen) {
            case "splash":
                return <SplashScreen/>;
            case "onboarding-1":
            case "onboarding-2":
            case "onboarding-3": {
                const index = Number(screen.slice(-1)) - 1;
                return (
                    <OnboardingScreen
                        index={index}
                        skip={() => setScreen("login")}
                        next={() =>
                            setScreen(
                                index === 2 ? "login" : (`onboarding-${index + 2}` as Screen)
                            )
                        }
                    />
                );
            }
            case "login":
                return <LoginScreen enter={enter}/>;
            case "home":
                return (
                    <HomeScreen
                        tasks={tasks}
                        userName={userName}
                        navigate={navigate}
                        toggle={toggleTask}
                        delete={deleteTask}
                        edit={startEdit}
                    />
                );
            case "edit":
                if (!taskToEdit) return null;
                return (
                    <CreateTaskScreen
                        task={taskToEdit ?? undefined}
                        editTask={editTask}
                        cancel={() => {
                            setTaskToEdit(null);
                            setScreen("home");
                        }}
                    />
                );
            case "create":
                return (
                    <CreateTaskScreen
                        addTask={addTask}
                        cancel={() => setScreen("home")}
                    />
                );
            case "calendar":
                return <CalendarScreen tasks={tasks} navigate={navigate}/>;
            case "stats":
                return <StatsScreen tasks={tasks} navigate={navigate}/>;
            case "settings":
                return (
                    <SettingsScreen
                        navigate={navigate}
                        logout={logout}
                    />
                );
        }
    }, [screen, tasks, taskToEdit, userName]);

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor:
                        screen === "splash" ? "#6254F5" : colors.background,
                },
            ]}
        >
            <StatusBar
                barStyle={
                    screen === "splash" || isDark ? "light-content" : "dark-content"
                }
            />
            <View style={styles.contentWrapper}>{content}</View>

            {toast !== "" && (
                <View style={styles.toast}>
                    <View style={styles.toastIcon}>
                        <Icon name="check" size={16} color="#FFFFFF"/>
                    </View>
                    <Text style={styles.toastText}>{toast}</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

/**
 * Punto de entrada principal envuelto con el proveedor de Modo Oscuro.
 */
export default function App() {
    return (
        <ThemeProvider>
            <MainApp/>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
    },
    toast: {
        position: "absolute",
        bottom: 90,
        alignSelf: "center",
        backgroundColor: "#1E1E2D",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 30,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
    toastIcon: {
        backgroundColor: "#22C55E",
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    toastText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
});