export function initLoginPage(navigate) {
    window.login = function login() {
        const username = document.getElementById('username').value

        const password = document.getElementById('password').value

        const savedAdmin = JSON.parse(localStorage.getItem('adminData'))

        const adminUsername = savedAdmin?.username || 'admin'

        const adminPassword = savedAdmin?.password || 'admin123'

        if (username === adminUsername && password === adminPassword) {
            navigate('/admin')
        } else {
            alert('Wrong username or password')
        }
    }

    return () => {
        delete window.login
    }
}

export function initLogout(navigate) {
    window.logout = function logout() {
        navigate('/login')
    }

    return () => {
        delete window.logout
    }
}
