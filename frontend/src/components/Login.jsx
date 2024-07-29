import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/slices/authSlice'
import css from './Login.module.scss'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const { error, status } = useSelector((state) => state.auth)

    const handleLogin = () => {
        dispatch(loginUser({ username, password }))
    }

    return (
        <div className={css.Login}>
            <h2>Login</h2>
            {status === 'failed' && <p>{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} disabled={status === 'loading'}>
                {status === 'loading' ? 'Logging in...' : 'Login'}
            </button>
        </div>
    )
}

export default Login
