import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from 'react-router-dom'
import { useUserActivity } from './api/hooks'
import css from './App.module.scss'
import spinsImage from './assets/Free-spin.png'
import inviteImg from './assets/invite.png'
import usdtImage from './assets/Tether.png'
import tethertBalImg from './assets/TetherBal.png'
import tokenImage from './assets/Token.png'
import tokenBalImg from './assets/TokenBal.png'
import walletImg from './assets/wallet.png'
import AdminPanel from './components/Admin/AdminPanel'
import FirstWheel from './components/FirstWheel'
import InvitePopup from './components/Invite'
import Login from './components/Login'
import Popup from './components/Popup'
import SecondWheel from './components/SecondWheel'
import Wallet from './components/Wallet'
import { clearAuthToken } from './redux/slices/authSlice'
import { fetchUserBalance, fetchUserSpins } from './redux/slices/userSlice'

const App = () => {
    const dispatch = useDispatch()
    const [showSecondWheel, setShowSecondWheel] = useState(false)
    const [showWinPopup, setShowWinPopup] = useState(false)
    const [winData, setWinData] = useState(null)
    const segments = useSelector((state) => state.segments.segments)
    const spinResult = useSelector((state) => state.spin)
    const authToken = useSelector((state) => state.auth.token)

    useUserActivity()

    const handleFirstSpinEnd = () => {
        if (spinResult.firstWheelPrize.specialType !== 'Lose') {
            setShowSecondWheel(true)
        }
    }

    const handleSecondSpinEnd = () => {
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id
        setShowSecondWheel(false)
        dispatch(fetchUserSpins(telegramId))
        dispatch(fetchUserBalance(telegramId))

        const type = spinResult.firstWheelPrize.specialType
        if (spinResult) {
            let image = null
            switch (type) {
                case 'Token':
                    image = tokenImage
                    break
                case 'Tether':
                    image = usdtImage
                    break
                case 'Free spin':
                    image = spinsImage
                    break
                default:
                    image = null
            }
            if (spinResult) {
                setWinData({
                    image,
                    name: spinResult.firstWheelPrize.name,
                    amount: spinResult.secondWheelPrize.name,
                })
                setShowWinPopup(true)
            }
        }
    }

    const handleLogout = () => {
        dispatch(clearAuthToken())
    }

    const closeWinPopup = () => {
        setShowWinPopup(false)
        setWinData(null)
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/admin"
                    element={
                        !authToken ? (
                            <Login />
                        ) : (
                            <AdminPanel handleLogout={handleLogout} />
                        )
                    }
                />
                <Route
                    path="/"
                    element={
                        <MainPage
                            showSecondWheel={showSecondWheel}
                            segments={segments}
                            spinResult={spinResult}
                            onFirstSpinEnd={handleFirstSpinEnd}
                            onSecondSpinEnd={handleSecondSpinEnd}
                            showWinPopup={showWinPopup}
                            winData={winData}
                            closeWinPopup={closeWinPopup}
                        />
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}

const MainPage = ({
    showSecondWheel,
    segments,
    spinResult,
    onFirstSpinEnd,
    onSecondSpinEnd,
    showWinPopup,
    winData,
    closeWinPopup,
}) => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const [activeTab, setActiveTab] = useState(null)

    useEffect(() => {
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id
        dispatch(fetchUserBalance(telegramId))
    }, [dispatch])

    const togglePopup = (tabName) => {
        if (activeTab === tabName) {
            setActiveTab(null)
        } else {
            setActiveTab(tabName)
        }
    }

    return (
        <div className={css.main}>
            <div className={css.header}>
                <div className={css.bal}>
                    <div className={css.balance}>
                        <img src={tethertBalImg} alt="Tether Balance" />
                        <span className={css.tokenAmount}>
                            {user.balance?.Tether || 0}
                        </span>
                    </div>
                    <div className={css.balance}>
                        <img src={tokenBalImg} alt="Token Balance" />
                        <span className={css.tokenAmount}>
                            {user.balance?.Token || 0}
                        </span>
                    </div>
                </div>
                <img
                    className={css.invite}
                    onClick={() => togglePopup('invite')}
                    src={inviteImg}
                    alt="Invite"
                />
                <img
                    className={css.wallet}
                    onClick={() => togglePopup('wallet')}
                    src={walletImg}
                    alt="Wallet"
                />
            </div>

            {showWinPopup && (
                <Popup
                    title="Your Prize"
                    onClose={closeWinPopup}
                    content={
                        <div className={css.winContent}>
                            {winData.image && (
                                <img src={winData.image} alt="Prize" />
                            )}
                            <p>
                                {winData.amount} {winData.name}
                            </p>
                        </div>
                    }
                />
            )}

            {activeTab === 'invite' && (
                <Popup
                    title="Invite Friends"
                    onClose={() => togglePopup('invite')}
                    content={<InvitePopup />}
                />
            )}

            {activeTab === 'wallet' && (
                <Popup
                    title="Withdraw"
                    onClose={() => togglePopup('wallet')}
                    content={<Wallet />}
                />
            )}

            {!activeTab &&
                !showWinPopup &&
                (showSecondWheel ? (
                    <SecondWheel
                        segments={
                            spinResult.firstWheelPrize.secondWheelPrizes || []
                        }
                        onSpinEnd={onSecondSpinEnd}
                        title="Prize Size"
                        secondWheelPrize={spinResult.secondWheelPrize}
                    />
                ) : (
                    <FirstWheel
                        segments={segments}
                        onSpinEnd={onFirstSpinEnd}
                        title="Choose Prize"
                    />
                ))}
        </div>
    )
}

export default App
