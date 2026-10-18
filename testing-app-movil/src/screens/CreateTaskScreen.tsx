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
import {Category, Priority, Task} from "../types";
import {isoDate, today} from "../utils/dateUtils";
import {useTheme} from "../context/ThemeContext";
import {Button} from "../components/common/Button";
import {Field} from "../components/common/Field";
import {Header} from "../components/common/Header";
import {Icon} from "../components/common/Icon";

type CreateTaskScreenProps = {
    addTask: (task: Omit<Task, "id" | "completed">) => void;
    cancel: () => void;
};

export function CreateTaskScreen({addTask, cancel}: CreateTaskScreenProps) {
    const {colors} = useTheme();
    // Estados para cada campo del formulario
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(isoDate(today));
    const [time, setTime] = useState("09:00");
    const [priority, setPriority] = useState<Priority>("Media");
    const [category, setCategory] = useState<Category>("General");
    const [repeat, setRepeat] = useState(false);
    const [error, setError] = useState("");

    /**
     * Valida que el título no esté vacío y envía la nueva tarea a App.tsx.
     */
    const handleSubmit = () => {
        if (!title.trim()) {
            setError("Escribe un título para continuar");
            return;
        }
        addTask({
            title: title.trim(),
            description,
            date,
            time,
            priority,
            category,
            repeat,
        });
    };

    return (
        <KeyboardAvoidingView
            style={[styles.screenWrapper, {backgroundColor: colors.background}]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Barra superior con botón de volver y enlace "Guardar" */}
                <Header
                    title="Nueva tarea"
                    back={cancel}
                    action={
                        <TouchableOpacity onPress={handleSubmit}>
                            <Text style={[styles.saveLink, {color: colors.primary}]}>Guardar</Text>
                        </TouchableOpacity>
                    }
                />

                {/* 1. Campo: Título de la tarea */}
                <Field label="Título de la tarea" error={error}>
                    <TextInput
                        style={[styles.input, {color: colors.text}]}
                        value={title}
                        onChangeText={(text) => {
                            setTitle(text);
                            if (error) setError("");
                        }}
                        placeholder="Ej. Preparar presentación"
                        placeholderTextColor={colors.subtext}
                    />
                </Field>

                {/* 2. Campo: Descripción opcional */}
                <Field label="Descripción (opcional)">
                    <TextInput
                        style={[styles.input, styles.textArea, {color: colors.text}]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Añade notas o detalles..."
                        placeholderTextColor={colors.subtext}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </Field>

                {/* 3. Fila doble: Fecha y Hora */}
                <View style={styles.formRow}>
                    <Field label="Fecha" icon="calendar">
                        <TextInput
                            style={[styles.input, {color: colors.text}]}
                            value={date}
                            onChangeText={setDate}
                            placeholder="AAAA-MM-DD"
                            placeholderTextColor={colors.subtext}
                        />
                    </Field>

                    <Field label="Hora" icon="clock">
                        <TextInput
                            style={[styles.input, {color: colors.text}]}
                            value={time}
                            onChangeText={setTime}
                            placeholder="09:00"
                            placeholderTextColor={colors.subtext}
                        />
                    </Field>
                </View>

                {/* 4. Selector de Prioridad (Baja, Media, Alta) */}
                <View style={styles.fieldset}>
                    <Text style={[styles.legend, {color: colors.text}]}>Prioridad</Text>
                    <View style={styles.choiceGrid}>
                        {(["Baja", "Media", "Alta"] as Priority[]).map((item) => {
                            const isSelected = priority === item;
                            const dotColor =
                                item === "Alta"
                                    ? "#EF4444"
                                    : item === "Media"
                                        ? "#F59E0B"
                                        : "#22C55E";

                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.priorityChoice,
                                        {backgroundColor: colors.card, borderColor: colors.border},
                                        isSelected && styles.choiceSelected,
                                        isSelected && {
                                            backgroundColor: colors.primarySoft,
                                            borderColor: colors.primary,
                                        },
                                    ]}
                                    onPress={() => setPriority(item)}
                                >
                                    <View
                                        style={[styles.priorityDot, {backgroundColor: dotColor}]}
                                    />
                                    <Text
                                        style={[
                                            styles.choiceText,
                                            {color: colors.subtext},
                                            isSelected && styles.choiceTextSelected,
                                            isSelected && {color: colors.primary},
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* 5. Selector de Categoría (General, Estudio, Trabajo, Personal) */}
                <View style={styles.fieldset}>
                    <Text style={[styles.legend, {color: colors.text}]}>Categoría</Text>
                    <View style={styles.categoryGrid}>
                        {(["General", "Estudio", "Trabajo", "Personal"] as Category[]).map(
                            (item) => {
                                const isSelected = category === item;
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.categoryBtn,
                                            {backgroundColor: colors.card, borderColor: colors.border},
                                            isSelected && styles.categoryBtnSelected,
                                            isSelected && {
                                                backgroundColor: colors.primarySoft,
                                                borderColor: colors.primary,
                                            },
                                        ]}
                                        onPress={() => setCategory(item)}
                                    >
                                        <View
                                            style={[
                                                styles.categoryInitial,
                                                {backgroundColor: colors.border},
                                                isSelected && styles.categoryInitialSelected,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryInitialText,
                                                    {color: colors.subtext},
                                                    isSelected && styles.categoryInitialTextSelected,
                                                ]}
                                            >
                                                {item.slice(0, 1)}
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.choiceText,
                                                {color: colors.subtext},
                                                isSelected && styles.choiceTextSelected,
                                                isSelected && {color: colors.primary},
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }
                        )}
                    </View>
                </View>

                {/* 6. Interruptor: Repetir tarea */}
                <View
                    style={[
                        styles.repeatRow,
                        {backgroundColor: colors.card, borderColor: colors.border},
                    ]}
                >
                    <View style={[styles.settingIconPurple, {backgroundColor: colors.primarySoft}]}>
                        <Icon name="calendar" size={20} color="#6254F5"/>
                    </View>
                    <View style={styles.repeatCopy}>
                        <Text style={[styles.repeatTitle, {color: colors.text}]}>
                            Repetir tarea
                        </Text>
                        <Text style={[styles.repeatSub, {color: colors.subtext}]}>
                            Se repetirá cada semana
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setRepeat(!repeat)}
                        style={[styles.switchTrack, repeat && styles.switchTrackOn]}
                        accessibilityLabel="Repetir tarea"
                    >
                        <View
                            style={[styles.switchThumb, repeat && styles.switchThumbOn]}
                        />
                    </TouchableOpacity>
                </View>

                {/* 7. Botones de acción inferiores */}
                <Button full onClick={handleSubmit} style={styles.submitBtn}>
                    + Agregar tarea
                </Button>
                <Button variant="ghost" full onClick={cancel}>
                    Cancelar
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
        backgroundColor: "#F8F9FE",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 36,
    },
    saveLink: {
        fontSize: 15,
        fontWeight: "700",
        color: "#6254F5",
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#1E1E2D",
        paddingVertical: 10,
    },
    textArea: {
        minHeight: 76,
        paddingTop: 12,
    },
    formRow: {
        flexDirection: "row",
        gap: 12,
    },
    fieldset: {
        marginBottom: 18,
    },
    legend: {
        fontSize: 13,
        fontWeight: "600",
        color: "#334155",
        marginBottom: 8,
    },
    choiceGrid: {
        flexDirection: "row",
        gap: 10,
    },
    priorityChoice: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    choiceSelected: {
        borderColor: "#6254F5",
        backgroundColor: "#EEF2FF",
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    choiceText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#475569",
    },
    choiceTextSelected: {
        color: "#6254F5",
        fontWeight: "700",
    },
    categoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    categoryBtn: {
        width: "48%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#FFFFFF",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    categoryBtnSelected: {
        borderColor: "#6254F5",
        backgroundColor: "#EEF2FF",
    },
    categoryInitial: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
    },
    categoryInitialSelected: {
        backgroundColor: "#6254F5",
    },
    categoryInitialText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#64748B",
    },
    categoryInitialTextSelected: {
        color: "#FFFFFF",
    },
    repeatRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginBottom: 22,
    },
    settingIconPurple: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    repeatCopy: {
        flex: 1,
    },
    repeatTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1E1E2D",
    },
    repeatSub: {
        fontSize: 12,
        color: "#64748B",
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
    submitBtn: {
        marginBottom: 8,
    },
});