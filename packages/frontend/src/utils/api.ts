class API {
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  private authToken: string | null = null

  setAuth(token: string | null) {
    this.authToken = token
  }

  private async request(path: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    const response = await fetch(`${this.baseURL}/api${path}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Request failed')
    }

    return response.json()
  }

  get(path: string) {
    return this.request(path)
  }

  post(path: string, data?: any) {
    return this.request(path, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put(path: string, data: any) {
    return this.request(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(path: string) {
    return this.request(path, {
      method: 'DELETE',
    })
  }
}

export const api = new API()