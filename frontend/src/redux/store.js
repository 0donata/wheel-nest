import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import segmentsReducer from './slices/segmentsSlice'
import spinSlice from './slices/spinSlice'
import userReducer from './slices/userSlice'

const store = configureStore({
    reducer: {
        segments: segmentsReducer,
        auth: authReducer,
        user: userReducer,
        spin: spinSlice,
    },
})

export default store
