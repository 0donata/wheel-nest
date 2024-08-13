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
import shibImage from './assets/Doge.png'
import spinsImage from './assets/Free-spin.png'
import pepeImage from './assets/Pepe.png'
import usdtImage from './assets/Tether.png'
import tokenImage from './assets/Token.png'
import AdminPanel from './components/Admin/AdminPanel'
import FirstWheel from './components/FirstWheel'
import Login from './components/Login'
import Popup from './components/Popup'
import SecondWheel from './components/SecondWheel'
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
                case 'USDT':
                    image = usdtImage
                    break
                case 'Free spin':
                    image = spinsImage
                    break
                case 'SHIB':
                    image = shibImage
                    break
                case 'PEPE':
                    image = pepeImage
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
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    console.log(user.balance)

    useEffect(() => {
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id
        dispatch(fetchUserBalance(telegramId))
    }, [dispatch])

    return (
        <div className={css.main}>
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
            {!showWinPopup &&
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
