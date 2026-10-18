import React, {ReactNode} from "react";
import {
    Modal as RNModal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {useTheme} from "../../context/ThemeContext";

type ModalProps = {
    title: string;
    children: ReactNode;
    close: () => void;
};

export function Modal({title, children, close}: ModalProps) {
    const {colors} = useTheme();
    return (
        <RNModal
            transparent={true}
            animationType="slide"
            visible={true}
            onRequestClose={close}
        >
            {/* Fondo oscuro semitransparente; al tocarlo se cierra el modal */}
            <Pressable style={styles.modalBackdrop} onPress={close}>
                {/* Contenedor inferior; evita cerrarse si tocas dentro del formulario */}
                <Pressable
                    style={[styles.modalCard, {backgroundColor: colors.card}]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={[styles.modalHandle, {backgroundColor: colors.border}]}/>
                    <Text style={[styles.modalTitle, {color: colors.text}]}>{title}</Text>
                    {children}
                </Pressable>
            </Pressable>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        justifyContent: "flex-end",
    },
    modalCard: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 34,
    },
    modalHandle: {
        width: 42,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#CBD5E1",
        alignSelf: "center",
        marginBottom: 18,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1E1E2D",
        marginBottom: 18,
    },
});