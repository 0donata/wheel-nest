import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    approveWithdrawalRequest,
    fetchWithdrawalRequests,
} from '../../redux/slices/withdrawalSlice'
import css from './AdminPanel.module.scss'

const WithdrawalRequests = () => {
    const dispatch = useDispatch()
    const requests = useSelector((state) => state.withdrawals.requests)

    useEffect(() => {
        dispatch(fetchWithdrawalRequests())
    }, [dispatch])

    const handleApprove = (id) => {
        dispatch(approveWithdrawalRequest(id))
    }

    return (
        <div>
            <h3>Withdrawal Requests</h3>
            <div className={css.requestsWrapper}>
                {requests.length === 0 ? (
                    <p>No requests</p>
                ) : (
                    requests.map((request) => (
                        <div key={request._id} className={css.request}>
                            <p>Telegram ID: {request.telegramId}</p>
                            <p>Wallet Address: {request.walletAddress}</p>
                            <p>Amount: {request.amount} USDT</p>
                            <p>Status: {request.status}</p>
                            {request.status === 'pending' && (
                                <button
                                    onClick={() => handleApprove(request._id)}
                                >
                                    Approve
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default WithdrawalRequests
