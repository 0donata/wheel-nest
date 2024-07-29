import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import segmentsReducer from './slices/segmentsSlice'
import spinSlice from './slices/spinSlice'
import statsReducer from './slices/statsSlice'
import userReducer from './slices/userSlice'
import withdrawalsReducer from './slices/withdrawalSlice'

const store = configureStore({
    reducer: {
        segments: segmentsReducer,
        stats: statsReducer,
        auth: authReducer,
        user: userReducer,
        spin: spinSlice,
        withdrawals: withdrawalsReducer,
    },
})

export default store
