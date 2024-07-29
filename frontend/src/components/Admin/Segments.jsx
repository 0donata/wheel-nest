import cloneDeep from 'lodash/cloneDeep'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSegments, updateSegments } from '../../redux/slices/segmentsSlice'
import css from './AdminPanel.module.scss'

const Segments = () => {
    const dispatch = useDispatch()
    const segments = useSelector((state) => state.segments.segments)
    const [localSegments, setLocalSegments] = useState([])
    const [newSegmentName, setNewSegmentName] = useState('')
    const [newSegmentWeight, setNewSegmentWeight] = useState(1)
    const [newSegmentConversionRate, setNewSegmentConversionRate] = useState(1)
    const [newSegmentSpecialType, setNewSegmentSpecialType] = useState('Tether')
    const [errorMessage, setErrorMessage] = useState('')
    const [saveStatus, setSaveStatus] = useState(null)

    useEffect(() => {
        dispatch(fetchSegments())
    }, [dispatch])

    useEffect(() => {
        setLocalSegments(cloneDeep(segments))
    }, [segments])

    const handleWeightChange = (index, weight) => {
        const updatedSegments = cloneDeep(localSegments)
        updatedSegments[index].weight = parseFloat(weight)
        setLocalSegments(updatedSegments)
    }

    const handleNameChange = (index, name) => {
        const updatedSegments = cloneDeep(localSegments)
        updatedSegments[index].name = name
        setLocalSegments(updatedSegments)
    }

    const handleSecondWheelPrizeChange = (
        segmentIndex,
        prizeIndex,
        key,
        value
    ) => {
        const updatedSegments = cloneDeep(localSegments)
        updatedSegments[segmentIndex].secondWheelPrizes[prizeIndex][key] = value
        setLocalSegments(updatedSegments)
    }

    const handleAddSecondWheelPrize = (segmentIndex) => {
        const updatedSegments = cloneDeep(localSegments)
        updatedSegments[segmentIndex].secondWheelPrizes.push({
            name: '',
            weight: 0,
        })
        setLocalSegments(updatedSegments)
    }

    const handleRemoveSecondWheelPrize = (segmentIndex, prizeIndex) => {
        const updatedSegments = cloneDeep(localSegments)
        updatedSegments[segmentIndex].secondWheelPrizes.splice(prizeIndex, 1)
        setLocalSegments(updatedSegments)
    }

    const handleConversionRateChange = (index, rate) => {
        const updatedSegments = cloneDeep(localSegments)
        updatedSegments[index].conversionRate = parseFloat(rate)
        setLocalSegments(updatedSegments)
    }

    const handleSpecialTypeChange = (index, type) => {
        const updatedSegments = cloneDeep(localSegments)
        updatedSegments[index].specialType = type
        if (type !== 'Tether' || type !== 'Token') {
            updatedSegments[index].conversionRate = 1
        }
        setLocalSegments(updatedSegments)
    }

    const handleSave = async () => {
        for (const segment of localSegments) {
            if (!segment.name || segment.weight < 0) {
                setErrorMessage(
                    'All segments must have a name and weight greater than or equal to 0.'
                )
                return
            }
            if (
                (segment.specialType === 'Tether' ||
                    segment.specialType === 'Token') &&
                segment.conversionRate <= 0
            ) {
                setErrorMessage(
                    'Conversion rate must be greater than 0 for non-special segments.'
                )
                return
            }
            for (const prize of segment.secondWheelPrizes) {
                if (!prize.name || prize.weight < 0) {
                    setErrorMessage(
                        'All second wheel prizes must have a name and weight greater than or equal to 0.'
                    )
                    return
                }
            }
        }
        setErrorMessage('')
        try {
            await dispatch(updateSegments(localSegments))
            setSaveStatus('success')
        } catch (error) {
            setSaveStatus('error')
        }
    }

    const handleAddSegment = () => {
        if (!newSegmentName || newSegmentWeight < 0) {
            setErrorMessage(
                'New segment must have a name and weight greater than or equal to 0.'
            )
            return
        }
        const newSegment = {
            name: newSegmentName,
            weight: parseFloat(newSegmentWeight),
            conversionRate:
                newSegmentSpecialType === 'Tether' ||
                newSegmentSpecialType === 'Token'
                    ? parseFloat(newSegmentConversionRate)
                    : 1,
            specialType: newSegmentSpecialType,
            secondWheelPrizes: [],
        }
        setLocalSegments([...localSegments, newSegment])
        setNewSegmentName('')
        setNewSegmentWeight(1)
        setNewSegmentConversionRate(1)
        setNewSegmentSpecialType('Tether')
        setErrorMessage('')
    }

    const handleRemoveSegment = (index) => {
        const updatedSegments = localSegments.filter((_, i) => i !== index)
        setLocalSegments(updatedSegments)
    }

    return (
        <div>
            <h2>Segments</h2>
            <button className={css.save} onClick={handleSave}>
                Save segments
            </button>
            {errorMessage && <p className={css.error}>{errorMessage}</p>}
            {saveStatus === 'success' && (
                <p className={css.success}>Segments saved successfully!</p>
            )}
            {saveStatus === 'error' && (
                <p className={css.error}>
                    Error saving segments. Please try again.
                </p>
            )}
            <div className={css.newSegment}>
                <div className={css.item}>
                    name
                    <input
                        type="text"
                        placeholder="New Segment Name"
                        value={newSegmentName}
                        onChange={(e) => setNewSegmentName(e.target.value)}
                    />
                </div>
                <div className={css.item}>
                    chance
                    <input
                        type="number"
                        placeholder="Weight"
                        value={newSegmentWeight}
                        onChange={(e) => setNewSegmentWeight(e.target.value)}
                    />
                </div>
                {(newSegmentSpecialType === 'Tether' ||
                    newSegmentSpecialType === 'Token') && (
                    <div className={css.item}>
                        rate
                        <input
                            type="number"
                            placeholder="Conversion Rate"
                            value={newSegmentConversionRate}
                            onChange={(e) =>
                                setNewSegmentConversionRate(e.target.value)
                            }
                        />
                    </div>
                )}
                <div className={css.item}>
                    type
                    <select
                        value={newSegmentSpecialType}
                        onChange={(e) =>
                            setNewSegmentSpecialType(e.target.value)
                        }
                    >
                        <option value="Tether">Tether</option>
                        <option value="Token">Token</option>
                        <option value="Lose">Lose</option>
                        <option value="Free spin">Free spin</option>
                    </select>
                </div>
                <button onClick={handleAddSegment}>Add New Segment</button>
            </div>
            <div className={css.segments}>
                {localSegments.map((segment, index) => (
                    <div className={css.section} key={index}>
                        <div className={css.item}>
                            name
                            <input
                                type="text"
                                value={segment.name}
                                onChange={(e) =>
                                    handleNameChange(index, e.target.value)
                                }
                            />
                        </div>
                        <div className={css.item}>
                            chance
                            <input
                                type="number"
                                value={segment.weight}
                                onChange={(e) =>
                                    handleWeightChange(index, e.target.value)
                                }
                            />
                        </div>
                        {(segment.specialType === 'Tether' ||
                            segment.specialType === 'Token') && (
                            <div className={css.item}>
                                rate
                                <input
                                    type="number"
                                    value={segment.conversionRate}
                                    onChange={(e) =>
                                        handleConversionRateChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        )}
                        <div className={css.item}>
                            type
                            <select
                                value={segment.specialType}
                                onChange={(e) =>
                                    handleSpecialTypeChange(
                                        index,
                                        e.target.value
                                    )
                                }
                            >
                                <option value="Tether">Tether</option>
                                <option value="Token">Token</option>
                                <option value="Lose">Lose</option>
                                <option value="Free spin">Free spin</option>
                            </select>
                        </div>
                        <button onClick={() => handleRemoveSegment(index)}>
                            Remove
                        </button>
                        <h4>Second Wheel Prizes</h4>
                        {segment.secondWheelPrizes.map((prize, prizeIndex) => (
                            <div className={css.secondSection} key={prizeIndex}>
                                <div className={css.item}>
                                    prize
                                    <input
                                        type="number"
                                        value={prize.name}
                                        onChange={(e) =>
                                            handleSecondWheelPrizeChange(
                                                index,
                                                prizeIndex,
                                                'name',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className={css.item}>
                                    chance
                                    <input
                                        type="number"
                                        value={prize.weight}
                                        onChange={(e) =>
                                            handleSecondWheelPrizeChange(
                                                index,
                                                prizeIndex,
                                                'weight',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <button
                                    onClick={() =>
                                        handleRemoveSecondWheelPrize(
                                            index,
                                            prizeIndex
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => handleAddSecondWheelPrize(index)}
                        >
                            Add Second Wheel Prize
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Segments
