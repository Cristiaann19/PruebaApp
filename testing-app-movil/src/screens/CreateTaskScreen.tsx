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
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";

type CreateTaskScreenProps = {
    addTask?: (task: Omit<Task, "id" | "completed">) => void;
    editTask?: (id: number, data: Omit<Task, "id">) => void;
    task?: Task;
    cancel: () => void;
};

export function CreateTaskScreen({addTask, editTask, task, cancel}: CreateTaskScreenProps) {
    const {colors} = useTheme();
    const isEditing = !!task;

    const [title, setTitle] = useState(task?.title ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [date, setDate] = useState(task?.date ?? isoDate(today));
    const [time, setTime] = useState(task?.time?.slice(0, 5) ?? "09:00");
    const [priority, setPriority] = useState<Priority>(task?.priority ?? "Media");
    const [category, setCategory] = useState<Category>(task?.category ?? "General");
    const [repeat, setRepeat] = useState(task?.repeat ?? false);
    const [error, setError] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);


    const handleSubmit = () => {
        if (!title.trim()) {
            setError("Escribe un título para continuar");
            return;
        }

        const payload = {
            title: title.trim(),
            description,
            date,
            time,
            priority,
            category,
            repeat,
        };

        if (task && editTask) {
            // Conservamos "completed" para no reabrir una tarea ya terminada
            editTask(task.id, {...payload, completed: task.completed});
        } else {
            addTask?.(payload);
        }
    };

    const pad = (n: number) => String(n).padStart(2, "0");

    const toDateObject = (d: string, t: string): Date => {
        const [y, m, day] = d.split("-").map(Number);
        const [h, min] = t.split(":").map(Number);
        return new Date(y, (m || 1) - 1, day || 1, h || 0, min || 0);
    };

    const onChangeDate = (event: DateTimePickerEvent, selected?: Date) => {
        setShowDatePicker(Platform.OS === "ios"); // en Android se cierra solo
        if (event.type === "dismissed" || !selected) return;
        setDate(`${selected.getFullYear()}-${pad(selected.getMonth() + 1)}-${pad(selected.getDate())}`);
    };

    const onChangeTime = (event: DateTimePickerEvent, selected?: Date) => {
        setShowTimePicker(Platform.OS === "ios");
        if (event.type === "dismissed" || !selected) return;
        setTime(`${pad(selected.getHours())}:${pad(selected.getMinutes())}`);
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
                    title={isEditing ? "Editar tarea" : "Nueva tarea"}
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
                        <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDatePicker(true)}>
                            <Text style={[styles.pickerText, {color: colors.text}]}>{date}</Text>
                        </TouchableOpacity>
                    </Field>

                    <Field label="Hora" icon="clock">
                        <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowTimePicker(true)}>
                            <Text style={[styles.pickerText, {color: colors.text}]}>{time}</Text>
                        </TouchableOpacity>
                    </Field>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={toDateObject(date, time)}
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={onChangeDate}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        value={toDateObject(date, time)}
                        mode="time"
                        is24Hour
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onChangeTime}
                    />
                )}

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
                    {isEditing ? "Guardar cambios" : "+ Agregar tarea"}
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
    pickerBtn: {
        flex: 1,
        justifyContent: "center",
        paddingVertical: 12,
    },
    pickerText: {
        fontSize: 15,
    },
});