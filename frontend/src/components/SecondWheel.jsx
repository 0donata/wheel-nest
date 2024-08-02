import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import pressedButton from '../assets/button-active.png'
import normalButton from '../assets/button-normal.png'
import frameImage from '../assets/frame.png'
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

const SecondWheel = ({ segments, onSpinEnd, title }) => {
    const canvasRef = useRef(null)
    const [isSpinning, setIsSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const spinResult = useSelector((state) => state.spin)
    const [isPressed, setIsPressed] = useState(false)

    const data = useMemo(() => {
        if (segments && segments.length > 0) {
            return segments.map((segment, index) => ({
                option: segment.name,
                color: segmentColors[index % segmentColors.length],
            }))
        }
        return []
    }, [segments])

    useEffect(() => {
        if (spinResult.status === 'succeeded' && isSpinning) {
            const prizeIndex = segments.findIndex(
                (segment) => segment.name === spinResult.secondWheelPrize.name
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
        setIsSpinning(true)
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

                const gradient = ctx.createRadialGradient(
                    centerX,
                    centerY,
                    0,
                    centerX,
                    centerY,
                    radius
                )
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.31)')
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.31)')

                ctx.lineWidth = 8
                ctx.strokeStyle = gradient
                ctx.stroke()

                ctx.save()
                ctx.translate(centerX, centerY)
                ctx.rotate(angle + (nextAngle - angle) / 2)
                ctx.fillStyle = '#fff'
                ctx.font = '60px Gumdrop, sans-serif'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(segment.option, radius / 2, 0)
                ctx.restore()
            })
        }

        drawWheel()
    }, [data, rotation])

    return (
        <div>
            <h2 className={css.title}>{title}</h2>
            <div className={css.hidden}>Spins left:</div>
            <div className={css.wheelContainer}>
                <div className={css.wheelFrame}>
                    <img
                        src={frameImage}
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
                    src={isPressed || isSpinning ? pressedButton : normalButton}
                    alt="Spin Button"
                />
            </button>
        </div>
    )
}

export default SecondWheel
