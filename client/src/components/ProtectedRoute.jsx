import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { API_BASE, authHeaders } from '../lib/api'

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('adminToken')

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <AuthGate token={token}>{children}</AuthGate>
}

function AuthGate({ token, children }) {
    const [status, setStatus] = useState('checking')

    useEffect(() => {
        let cancelled = false

        fetch(`${API_BASE}/api/auth/verify`, {
            headers: authHeaders(false),
        })
            .then((res) => {
                if (!cancelled) {
                    setStatus(res.ok ? 'allowed' : 'denied')
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setStatus('denied')
                }
            })

        return () => { cancelled = true }
    }, [token])

    if (status === 'denied') {
        return <Navigate to="/login" replace />
    }

    if (status === 'checking') {
        return null
    }

    return children
}
