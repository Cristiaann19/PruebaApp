import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthResponse, User } from "../types";
import { API_BASE_URL } from "./api";

const TOKEN_KEY = "taskly.token";
const USER_KEY = "taskly.user";

type AuthErrorBody = {
    message?: string;
    fieldErrors?: Record<string, string>;
};

function extractErrorMessage(body: unknown, status: number): string {
    if (typeof body === "object" && body !== null) {
        const data = body as AuthErrorBody;

        if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
            return Object.values(data.fieldErrors).join("\n");
        }

        if (data.message) {
            return data.message;
        }
    }

    return `Error HTTP ${status}`;
}

async function requestAuth(
    path: string,
    payload: Record<string, string>
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(extractErrorMessage(body, response.status));
    }

    return body as AuthResponse;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const auth = await requestAuth("/api/auth/login", { email, password });
    await saveSession(auth);
    return auth;
}

export async function register(
    name: string,
    email: string,
    password: string
): Promise<AuthResponse> {
    const auth = await requestAuth("/api/auth/register", { name, email, password });
    await saveSession(auth);
    return auth;
}

export async function saveSession(auth: AuthResponse): Promise<void> {
    await AsyncStorage.multiSet([
        [TOKEN_KEY, auth.token],
        [USER_KEY, JSON.stringify(auth.user)],
    ]);
}

export async function getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser(): Promise<User | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
}

export async function clearSession(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
