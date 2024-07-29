import { fetchStats } from '@/redux/slices/statsSlice'
import { React, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Statistics = () => {
    const stats = useSelector((state) => state.stats)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchStats())
    }, [dispatch])

    return (
        <div>
            <h3>Statistics</h3>
            <p>Online Users: {stats.onlineUsers}</p>
            <p>Users Today: {stats.usersToday}</p>
            <p>Users in Last Hour: {stats.usersLastHour}</p>
            <p>Total Users: {stats.totalUsers}</p>
            <p>Unique Users Today: {stats.uniqueUsersToday}</p>
        </div>
    )
}

export default Statistics
