import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUserSpins } from '../redux/slices/userSlice'
import css from './Invite.module.scss'

const InvitePopup = () => {
    const [inviteLink, setInviteLink] = useState('')
    const [subscriptionStatus, setSubscriptionStatus] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id
        setInviteLink(`https://t.me/wheel_of_fortunee_bot?start=${telegramId}`)
    }, [])

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink)
        alert('Invite link copied to clipboard!')
    }

    const checkSubscription = async () => {
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id
        try {
            const response = await axios.post('/api/check-subscription', {
                telegramId,
            })
            if (response.data.subscribed) {
                setSubscriptionStatus(
                    'You have received 1 additional spin for subscribing!'
                )
                dispatch(fetchUserSpins(telegramId))
            } else {
                setSubscriptionStatus(
                    'You need to subscribe to the channel first.'
                )
            }
        } catch (error) {
            console.error('Error checking subscription:', error)
            setSubscriptionStatus('Error checking subscription.')
        }
    }

    return (
        <div className={css.invitePop}>
            <p>Invite your friend and earn 1 spin!</p>
            <input type="text" value={inviteLink} readOnly />
            <button onClick={handleCopyLink}>Copy Invite Link</button>
            <p>Subscribe to our channel to get an additional spin:</p>
            <a
                className={css.link}
                href="https://t.me/aboba9494"
                target="_blank"
                rel="noopener noreferrer"
            >
                Subscribe to our channel
            </a>
            <button onClick={checkSubscription}>Check Subscription</button>
            {subscriptionStatus && <p>{subscriptionStatus}</p>}
        </div>
    )
}

export default InvitePopup
