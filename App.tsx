// App.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

// Importamos nuestros tipos y datos iniciales
import { Screen, Task } from "./src/types";
import { initialTasks } from  "./src/constants/initialTasks"

// Importamos el componente de ícono (lo crearemos en el siguiente paso)
import { Icon } from "./src/components/common/Icon";

// Importamos las pantallas (las iremos creando paso a paso)
import { SplashScreen } from "./src/screens/SplashScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CreateTaskScreen } from "./src/screens/CreateTaskScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

// Clave única para guardar las tareas en la memoria del teléfono
const STORAGE_KEY = "taskly-tasks";

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  // Mensaje temporal de confirmación (ej. "Tarea agregada")
  const [toast, setToast] = useState<string>("");
  // Lista de todas las tareas del usuario
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  // Verifica si ya terminamos de leer la memoria del celular
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // 2. EFECTO: Cargar tareas guardadas al abrir la app
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

  // 3. EFECTO: Guardar tareas automáticamente cuando cambian
  useEffect(() => {
    // Evitamos sobrescribir la memoria antes de que termine de cargar al inicio
    if (!isLoaded) return;

    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Error al guardar las tareas:", error);
      }
    };

    saveTasks();
  }, [tasks, isLoaded]);

  // 4. EFECTO: Temporizador de la pantalla inicial (Splash)
  // Puedes ajustar "1500" (1.5 segundos) si quieres que dure más o menos tiempo.
  useEffect(() => {
    if (screen !== "splash") return;
    const timer = setTimeout(() => setScreen("onboarding-1"), 1500);
    return () => clearTimeout(timer);
  }, [screen]);

  // 5. EFECTO: Ocultar la notificación (Toast) después de 2.6 segundos
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  // 6. FUNCIONES DE CONTROL DE TAREAS Y NAVEGACIÓN
  /**
   * Cambia la pantalla actual a la pantalla indicada.
   */
  const navigate = (target: Screen) => setScreen(target);

  /**
   * Marca una tarea como completada o pendiente según su ID.
   */
  const toggleTask = (id: number) => {
    setTasks((currentTasks) =>
        currentTasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        )
    );
  };

  /**
   * Crea una nueva tarea, muestra el mensaje de éxito y vuelve al Inicio.
   */
  const addTask = (newTaskData: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now(), // Genera un ID único usando la fecha/hora actual en milisegundos
      completed: false,
    };
    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setToast("Tarea agregada correctamente");
    setScreen("home");
  };

  // 7. SELECTOR DE PANTALLA (Renderizado condicional)
  const content = useMemo(() => {
    switch (screen) {
      case "splash":
        return <SplashScreen />;

      case "onboarding-1":
      case "onboarding-2":
      case "onboarding-3": {
        // Obtiene el índice (0, 1 o 2) a partir del número al final del nombre
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
        return <LoginScreen enter={() => setScreen("home")} />;

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
        return <CalendarScreen tasks={tasks} navigate={navigate} />;

      case "stats":
        return <StatsScreen tasks={tasks} navigate={navigate} />;

      case "settings":
        return (
            <SettingsScreen
                navigate={navigate}
                logout={() => setScreen("login")}
            />
        );
    }
  }, [screen, tasks]);

  // 8. VISTA PRINCIPAL
  return (
      <SafeAreaView
          style={[
            styles.container,
            // Si estamos en el splash, ponemos el fondo morado; si no, blanco/gris claro
            screen === "splash" ? styles.bgPurple : styles.bgLight,
          ]}
      >
        {/* Configura el color de los íconos de batería/hora del teléfono */}
        <StatusBar
            barStyle={screen === "splash" ? "light-content" : "dark-content"}
        />

        {/* Muestra la pantalla activa */}
        <View style={styles.contentWrapper}>{content}</View>

        {/* Si hay un mensaje en "toast", muestra la burbuja flotante */}
        {toast !== "" && (
            <View style={styles.toast}>
              <View style={styles.toastIcon}>
                <Icon name="check" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.toastText}>{toast}</Text>
            </View>
        )}
      </SafeAreaView>
  );
}

// 9. ESTILOS VISUALES (El reemplazo de CSS en React Native)
const styles = StyleSheet.create({
  container: {
    flex: 1, // Hace que ocupe el 100% del alto de la pantalla del teléfono
  },
  bgLight: {
    backgroundColor: "#F8F9FE",
  },
  bgPurple: {
    backgroundColor: "#6254F5",
  },
  contentWrapper: {
    flex: 1,
  },
  toast: {
    position: "absolute",
    bottom: 90, // Aparece justo arriba de la barra de navegación inferior
    alignSelf: "center",
    backgroundColor: "#1E1E2D",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    // Sombra para Android (elevation) y para iOS (shadow...)
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
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