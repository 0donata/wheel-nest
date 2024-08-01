import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchBalances = createAsyncThunk(
    'balances/fetchBalances',
    async () => {
        const response = await axios.get('/balances')
        return response.data
    }
)

const balancesSlice = createSlice({
    name: 'balances',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBalances.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchBalances.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchBalances.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    },
})

export default balancesSlice.reducer
