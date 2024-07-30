import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSegments } from '../redux/slices/segmentsSlice'
import { fetchUserBalance } from '../redux/slices/userSlice'
import css from './Wallet.module.scss'

const Wallet = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const segments = useSelector((state) => state.segments.segments)
    const [walletAddress, setWalletAddress] = useState('')
    const [isEditing, setIsEditing] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [totalBalanceUSDT, setTotalBalanceUSDT] = useState(0)

    useEffect(() => {
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id
        dispatch(fetchUserBalance(telegramId))
        dispatch(fetchSegments())
    }, [dispatch])

    useEffect(() => {
        setWalletAddress(user.walletAddress)
        setIsEditing(!user.walletAddress)
    }, [user.walletAddress])

    useEffect(() => {
        if (user.balance) {
            let total = 0
            Object.entries(user.balance).forEach(([token, amount]) => {
                const segment = segments.find(
                    (s) => s.name.toLowerCase() === token.toLowerCase()
                )
                if (segment) {
                    total += amount * segment.conversionRate
                }
            })
            setTotalBalanceUSDT(total)
        }
    }, [user.balance, segments])

    const handleSaveWalletAddress = () => {
        if (!walletAddress.trim()) {
            setError('Wallet address cannot be empty')
            return
        }
        setError('')
        setIsEditing(false)
    }

    const handleUpdateWalletAddress = () => {
        setIsEditing(true)
    }

    const handleWithdraw = () => {
        if (isEditing) {
            setError('Wallet address not saved')
            return
        }
        if (!walletAddress.trim()) {
            setError('Wallet address cannot be empty')
            return
        }
        if (totalBalanceUSDT < 1) {
            setError('The minimum withdrawal amount is 1 USDT')
            return
        }
    }

    return (
        <div className={css.walletContainer}>
            <div className={css.walletInputContainer}>
                <label>Wallet Address:</label>
                <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    disabled={!isEditing}
                />
                {isEditing ? (
                    <button onClick={handleSaveWalletAddress}>Save</button>
                ) : (
                    <button onClick={handleUpdateWalletAddress}>Update</button>
                )}
            </div>
            {error && <p className={css.errorMessage}>{error}</p>}
            {success && <p className={css.successMessage}>{success}</p>}
            <div>
                <h3>Balance:</h3>
                {Object.entries(user.balance).map(([token, amount]) => (
                    <p key={token}>{`${token}: ${amount} (${(
                        amount *
                        (segments.find(
                            (s) => s.name.toLowerCase() === token.toLowerCase()
                        )?.conversionRate || 0)
                    ).toFixed(2)} USDT)`}</p>
                ))}
                <p>Total Balance: {totalBalanceUSDT.toFixed(2)} USDT</p>
            </div>
            <button className={css.button} onClick={handleWithdraw}>
                Get
            </button>
        </div>
    )
}

export default Wallet
