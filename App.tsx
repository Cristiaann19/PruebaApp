// App.tsx
import React, {useEffect, useMemo, useState} from "react";
import {
    SafeAreaView,
    StatusBar,
    ScrollView, StyleSheet, Text, TouchableOpacity, View

} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importamos el ThemeProvider y el hook useTheme
import {ThemeProvider, useTheme} from "./src/context/ThemeContext";

import {Screen, Task} from "./src/types";
import {initialTasks} from "./src/constants/initialTasks";
import {Icon} from "./src/components/common/Icon";

import {SplashScreen} from "./src/screens/SplashScreen";
import {OnboardingScreen} from "./src/screens/OnboardingScreen";
import {LoginScreen} from "./src/screens/LoginScreen";
import {HomeScreen} from "./src/screens/HomeScreen";
import {CreateTaskScreen} from "./src/screens/CreateTaskScreen";
import {CalendarScreen} from "./src/screens/CalendarScreen";
import {StatsScreen} from "./src/screens/StatsScreen";
import {SettingsScreen} from "./src/screens/SettingsScreen";

const STORAGE_KEY = "taskly-tasks";

/**
 * Componente interno que renderiza toda la aplicación y consume los colores del tema.
 */
function MainApp() {
    const {colors, isDark} = useTheme();

    const [screen, setScreen] = useState<Screen>("splash");
    const [toast, setToast] = useState<string>("");
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const loadSavedTasks = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved !== null) {
                    setTasks(JSON.parse(saved));
                }
            } catch (error) {
                console.error("Error al cargar las tareas:", error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadSavedTasks();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks, isLoaded]);

    useEffect(() => {
        if (screen !== "splash") return;
        const timer = setTimeout(() => setScreen("onboarding-1"), 1500);
        return () => clearTimeout(timer);
    }, [screen]);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(""), 2600);
        return () => clearTimeout(timer);
    }, [toast]);

    const navigate = (target: Screen) => setScreen(target);

    const toggleTask = (id: number) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id ? {...task, completed: !task.completed} : task
            )
        );
    };

    const addTask = (newTaskData: Omit<Task, "id" | "completed">) => {
        const newTask: Task = {
            ...newTaskData,
            id: Date.now(),
            completed: false,
        };
        setTasks((currentTasks) => [newTask, ...currentTasks]);
        setToast("Tarea agregada correctamente");
        setScreen("home");
    };

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
                return <LoginScreen enter={() => setScreen("home")}/>;
            case "home":
                return (
                    <HomeScreen
                        tasks={tasks}
                        navigate={navigate}
                        toggle={toggleTask}
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
                        logout={() => setScreen("login")}
                    />
                );
        }
    }, [screen, tasks]);

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
 * Componente principal que exporta la App envolviéndola con el ThemeProvider.
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