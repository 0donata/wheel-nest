import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSegments } from '../redux/slices/segmentsSlice'
import { fetchUserSpins } from '../redux/slices/userSlice'

export const useUserActivity = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const initData = window.Telegram.WebApp.initDataUnsafe

        if (initData.user) {
            const telegramId = initData.user.id
            dispatch(fetchUserSpins(telegramId))
        }

        dispatch(fetchSegments())
    }, [dispatch])
}
