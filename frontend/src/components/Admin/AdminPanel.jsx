import React, { useState } from 'react'
import css from './AdminPanel.module.scss'
import Segments from './Segments'
import Statistics from './Statistics'
import WithdrawalRequests from './WithdrawalRequests'

const AdminPanel = ({ handleLogout }) => {
    const [activeTab, setActiveTab] = useState('statistics')

    return (
        <div className={css.Admin}>
            <h2>Admin Panel</h2>
            <button onClick={handleLogout}>Logout</button>
            <div className={css.tabs}>
                <button
                    className={activeTab === 'statistics' ? css.active : ''}
                    onClick={() => setActiveTab('statistics')}
                >
                    Statistics
                </button>
                <button
                    className={activeTab === 'segments' ? css.active : ''}
                    onClick={() => setActiveTab('segments')}
                >
                    Segments
                </button>
                <button
                    className={activeTab === 'withdrawals' ? css.active : ''}
                    onClick={() => setActiveTab('withdrawals')}
                >
                    Withdrawal Requests
                </button>
            </div>
            <div className={css.tabContent}>
                {activeTab === 'statistics' && <Statistics />}
                {activeTab === 'segments' && <Segments />}
                {activeTab === 'withdrawals' && <WithdrawalRequests />}
            </div>
        </div>
    )
}

export default AdminPanel
