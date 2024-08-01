import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import pressedButton from '../assets/button-active.png'
import normalButton from '../assets/button-normal.png'
import frameImage from '../assets/frame.png'
import spinsImage from '../assets/Free-spin.png'
import loseImage from '../assets/Lose.png'
import usdtImage from '../assets/Tether.png'
import tokenImage from '../assets/Token.png'
import { spinWheel } from '../redux/slices/spinSlice'
import css from './Wheel.module.scss'

const segmentColors = [
    '#6db436',
    '#d19f36',
    '#cc3437',
    '#9730bd',
    '#c03880',
    '#1a885a',
    '#df7a42',
    '#4392c0',
]

const FirstWheel = ({ segments, onSpinEnd, title }) => {
    const canvasRef = useRef(null)
    const [isSpinning, setIsSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [localSpins, setLocalSpins] = useState(0)
    const user = useSelector((state) => state.user)
    const spinResult = useSelector((state) => state.spin)
    const [isPressed, setIsPressed] = useState(false)
    const dispatch = useDispatch()
    const [preloadedImages, setPreloadedImages] = useState({})

    useEffect(() => {
        const imageSources = {
            tokenImage,
            spinsImage,
            usdtImage,
            loseImage,
            pressedButton,
            normalButton,
            frameImage,
        }

        const images = {}
        let loadedCount = 0
        const totalImages = Object.keys(imageSources).length

        const onImageLoad = () => {
            loadedCount += 1
            if (loadedCount === totalImages) {
                setPreloadedImages(images)
            }
        }

        Object.keys(imageSources).forEach((key) => {
            const img = new Image()
            img.src = imageSources[key]
            img.onload = onImageLoad
            images[key] = img
        })
    }, [])

    useEffect(() => {
        setLocalSpins(user.spins)
    }, [user.spins])

    const data = useMemo(() => {
        if (segments && segments.length > 0) {
            return segments.map((segment, index) => {
                let image = null
                if (segment.specialType === 'Free spin') {
                    image = {
                        img: preloadedImages.spinsImage,
                        sizeMultiplier: 0.1,
                    }
                } else if (segment.specialType === 'Token') {
                    image = {
                        img: preloadedImages.tokenImage,
                        sizeMultiplier: 0.4,
                    }
                } else if (segment.specialType === 'Tether') {
                    image = {
                        img: preloadedImages.usdtImage,
                        sizeMultiplier: 0.5,
                    }
                } else if (segment.specialType === 'Lose') {
                    image = {
                        img: preloadedImages.loseImage,
                        sizeMultiplier: 0.12,
                    }
                }
                return {
                    option: segment.name,
                    image: image,
                    color: segmentColors[index % segmentColors.length],
                }
            })
        }
        return []
    }, [segments, preloadedImages])

    useEffect(() => {
        if (spinResult.status === 'succeeded' && isSpinning) {
            const prizeIndex = segments.findIndex(
                (segment) => segment.name === spinResult.firstWheelPrize.name
            )
            const segmentAngle = 360 / segments.length
            const prizeAngle = segmentAngle * prizeIndex
            const extraRotation = 360 * 5
            const totalRotation =
                extraRotation + (360 - prizeAngle - segmentAngle / 2)

            const spinDuration = 3000

            const animate = (startTime) => {
                const currentTime = performance.now()
                const elapsed = currentTime - startTime
                const progress = elapsed / spinDuration

                if (progress < 1) {
                    const easeOutQuad = (t) => t * (2 - t)
                    setRotation(totalRotation * easeOutQuad(progress))
                    requestAnimationFrame(() => animate(startTime))
                } else {
                    setRotation(totalRotation % 360)
                    setTimeout(() => {
                        onSpinEnd()
                        setIsSpinning(false)
                    }, 500)
                }
            }

            requestAnimationFrame(() => animate(performance.now()))
        }
    }, [spinResult, segments, onSpinEnd, isSpinning])

    const handleSpinClick = () => {
        if (user.spins > 0 && !isSpinning) {
            const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id
            dispatch(spinWheel(telegramId))
            setLocalSpins(localSpins - 1)
            setIsSpinning(true)
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const drawWheel = () => {
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2
            const radius = Math.min(centerX, centerY) - 10

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            data.forEach((segment, index) => {
                const angle =
                    (index * 2 * Math.PI) / data.length +
                    rotation * (Math.PI / 180)
                const nextAngle =
                    ((index + 1) * 2 * Math.PI) / data.length +
                    rotation * (Math.PI / 180)

                ctx.beginPath()
                ctx.moveTo(centerX, centerY)
                ctx.arc(centerX, centerY, radius, angle, nextAngle)
                ctx.closePath()
                ctx.fillStyle = segment.color
                ctx.fill()

                ctx.lineWidth = 2
                ctx.strokeStyle = '#a34808'
                ctx.stroke()

                if (segment.image) {
                    const img = segment.image.img
                    if (img) {
                        ctx.save()
                        ctx.translate(centerX, centerY)
                        ctx.rotate(angle + (nextAngle - angle) / 2)
                        const imgWidth =
                            img.width * (segment.image.sizeMultiplier || 1)
                        const imgHeight =
                            img.height * (segment.image.sizeMultiplier || 1)
                        ctx.drawImage(
                            img,
                            radius / 2.5,
                            -imgHeight / 2,
                            imgWidth,
                            imgHeight
                        )
                        ctx.restore()
                    }
                } else {
                    ctx.save()
                    ctx.translate(centerX, centerY)
                    ctx.rotate(angle + (nextAngle - angle) / 2)
                    ctx.fillStyle = '#000000'
                    ctx.fillText(segment.option, radius / 3, 0)
                    ctx.restore()
                }
            })
        }

        if (Object.keys(preloadedImages).length === 7) {
            drawWheel()
        }
    }, [data, rotation, preloadedImages])

    return (
        <div>
            <h2 className={css.title}>{title}</h2>
            <div>Spins left: {localSpins}</div>
            <div className={css.wheelContainer}>
                <div className={css.wheelFrame}>
                    <img
                        src={
                            preloadedImages.frameImage
                                ? preloadedImages.frameImage.src
                                : frameImage
                        }
                        alt="Frame"
                        className={css.frameImage}
                    />
                    <div className={css.wrapper}>
                        <canvas ref={canvasRef} width="500" height="500" />
                    </div>
                </div>
            </div>
            <button
                onClick={handleSpinClick}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                className={css.spinButton}
            >
                <img
                    src={
                        isPressed || isSpinning
                            ? preloadedImages.pressedButton
                                ? preloadedImages.pressedButton.src
                                : pressedButton
                            : preloadedImages.normalButton
                            ? preloadedImages.normalButton.src
                            : normalButton
                    }
                    alt="Spin Button"
                />
            </button>
        </div>
    )
}

export default FirstWheel
