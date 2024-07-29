import axios from 'axios'

export const updateUserActivity = async (telegramId, username) => {
    try {
        await axios.post('/api/update-activity', { telegramId, username })
        console.log('User activity updated')
    } catch (error) {
        console.error('Error updating user activity:', error)
    }
}
