import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchWithdrawalRequests = createAsyncThunk(
    'withdrawals/fetchWithdrawalRequests',
    async () => {
        const response = await axios.get('/api/withdrawals')
        return response.data
    }
)

export const submitWithdrawalRequest = createAsyncThunk(
    'withdrawal/submitWithdrawalRequest',
    async ({ telegramId }) => {
        const response = await axios.post('/api/withdrawals/withdraw', {
            telegramId,
        })
        return response.data
    }
)

export const approveWithdrawalRequest = createAsyncThunk(
    'withdrawals/approveWithdrawalRequest',
    async (requestId) => {
        const response = await axios.post(
            `/api/withdrawals/${requestId}/approve`
        )
        return response.data
    }
)

const withdrawalSlice = createSlice({
    name: 'withdrawals',
    initialState: {
        requests: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWithdrawalRequests.fulfilled, (state, action) => {
                state.requests = action.payload
            })
            .addCase(submitWithdrawalRequest.fulfilled, (state, action) => {
                state.requests.push(action.payload)
            })
            .addCase(approveWithdrawalRequest.fulfilled, (state, action) => {
                const index = state.requests.findIndex(
                    (req) => req.id === action.payload.id
                )
                if (index !== -1) {
                    state.requests[index] = action.payload
                }
            })
    },
})

export default withdrawalSlice.reducer
