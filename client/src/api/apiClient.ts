const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface APIResponse<T> {
    data: T
};

export async function apiGet<T>(path: string): Promise<T> {
    if (!path) {
        throw new Error("Invalid End point path");
    }

    const response = await fetch(`${APP_BASE_URL}${path}`);

    if (!response.ok) {
        throw new Error(`API request failed. ${response.status}`);
    }

    const body = (await response.json() as APIResponse<T>);

    return body.data;
}

export async function apiPost<T>(path: string, payload?: unknown): Promise<T> {
    if (!path) {
        throw new Error("Invalid End point path");
    }

    const response = await fetch(`${APP_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload ? JSON.stringify(payload) : undefined
    });

    if (!response.ok) {
        throw new Error(`API request failed. ${response.status}`);
    }

    const body = (await response.json() as APIResponse<T>);

    return body.data;
}