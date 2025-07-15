class API {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        this.authToken = null;
    }
    setAuth(token) {
        this.authToken = token;
    }
    async request(path, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        const response = await fetch(`${this.baseURL}/api${path}`, {
            ...options,
            headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }
        return response.json();
    }
    get(path) {
        return this.request(path);
    }
    post(path, data) {
        return this.request(path, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    put(path, data) {
        return this.request(path, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
    delete(path) {
        return this.request(path, {
            method: 'DELETE',
        });
    }
}
export const api = new API();
