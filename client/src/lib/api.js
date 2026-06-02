export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getToken() {
    return localStorage.getItem('adminToken')
}

export function authHeaders(includeJson = true) {
    const headers = {}
    const token = getToken()

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    if (includeJson) {
        headers['Content-Type'] = 'application/json'
    }

    return headers
}

export async function publicGet(path) {
    const response = await fetch(`${API_BASE}/api${path}`)

    const data = await response.json()

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Request failed')
    }

    return data.data
}

export async function adminRequest(path, options = {}) {
    const isFormData = options.body instanceof FormData

    const response = await fetch(`${API_BASE}/api/admin${path}`, {
        ...options,
        headers: {
            ...authHeaders(!isFormData),
            ...options.headers,
        },
    })

    const data = await response.json()

    if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Request failed')
    }

    return data
}
