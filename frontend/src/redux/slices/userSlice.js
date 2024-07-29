import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUserSpins = createAsyncThunk(
    'user/fetchUserSpins',
    async (telegramId) => {
        const response = await axios.get(
            `/api/user/spins?telegramId=${telegramId}`
        )
        return response.data.spins
    }
)

export const fetchUserBalance = createAsyncThunk(
    'user/fetchUserBalance',
    async (telegramId) => {
        const response = await axios.get(
            `/api/user/balance?telegramId=${telegramId}`
        )
        return response.data
    }
)

export const updateUserWallet = createAsyncThunk(
    'user/updateUserWallet',
    async ({ telegramId, walletAddress }) => {
        const response = await axios.post(`/api/user/update-wallet`, {
            telegramId,
            walletAddress,
        })
        return response.data
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        spins: 0,
        balance: {},
        status: 'idle',
        walletAddress: '',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserSpins.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchUserSpins.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.spins = action.payload
            })
            .addCase(fetchUserSpins.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(fetchUserBalance.fulfilled, (state, action) => {
                state.balance = action.payload.balance
                state.walletAddress = action.payload.walletAddress
            })
            .addCase(updateUserWallet.fulfilled, (state, action) => {
                state.walletAddress = action.payload.walletAddress
            })
    },
})

export default userSlice.reducer
