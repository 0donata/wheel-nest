import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }, thunkAPI) => {
        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password,
            })
            return response.data.token
        } catch (error) {
            return thunkAPI.rejectWithValue('Invalid credentials')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('authToken') || null,
        error: null,
        status: 'idle',
    },
    reducers: {
        setAuthToken: (state, action) => {
            state.token = action.payload
            localStorage.setItem('authToken', action.payload)
        },
        clearAuthToken: (state) => {
            state.token = null
            localStorage.removeItem('authToken')
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.token = action.payload
                localStorage.setItem('authToken', action.payload)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    },
})

export const { setAuthToken, clearAuthToken } = authSlice.actions
export default authSlice.reducer
