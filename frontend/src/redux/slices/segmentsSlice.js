import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchSegments = createAsyncThunk(
    'segments/fetchSegments',
    async () => {
        const response = await axios.get('/segments')
        return response.data
    }
)

export const updateSegments = createAsyncThunk(
    'segments/updateSegments',
    async (segments, { getState }) => {
        const { auth } = getState()
        const response = await axios.post('/segments', segments, {
            headers: { Authorization: `Bearer ${auth.token}` },
        })
        return response.data
    }
)

const segmentsSlice = createSlice({
    name: 'segments',
    initialState: {
        segments: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSegments.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchSegments.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.segments = action.payload
            })
            .addCase(fetchSegments.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(updateSegments.fulfilled, (state, action) => {
                state.segments = action.meta.arg
            })
    },
})

export default segmentsSlice.reducer
