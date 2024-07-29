import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchStats = createAsyncThunk('stats/fetchStats', async () => {
    const [
        onlineUsers,
        usersToday,
        usersLastHour,
        totalUsers,
        uniqueUsersToday,
    ] = await Promise.all([
        axios.get('/api/stats/online'),
        axios.get('/api/stats/daily'),
        axios.get('/api/stats/hourly'),
        axios.get('/api/stats/total'),
        axios.get('/api/stats/unique'),
    ])

    return {
        onlineUsers: onlineUsers.data.onlineUsers,
        usersToday: usersToday.data.usersToday,
        usersLastHour: usersLastHour.data.usersLastHour,
        totalUsers: totalUsers.data.totalUsers,
        uniqueUsersToday: uniqueUsersToday.data.uniqueUsersToday,
    }
})

const statsSlice = createSlice({
    name: 'stats',
    initialState: {
        onlineUsers: 0,
        usersToday: 0,
        usersLastHour: 0,
        totalUsers: 0,
        uniqueUsersToday: 0,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.status = 'succeeded'
                Object.assign(state, action.payload)
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    },
})

export default statsSlice.reducer
