const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An unexpected error occurred' }));
        throw new Error(error.detail || response.statusText);
    }

    return response.json();
}
