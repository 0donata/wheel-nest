import React, { useState } from 'react'
import css from './AdminPanel.module.scss'
import Segments from './Segments'

const AdminPanel = ({ handleLogout }) => {
    const [activeTab, setActiveTab] = useState('segments')

    return (
        <div className={css.Admin}>
            <h2>Admin Panel</h2>
            <button onClick={handleLogout}>Logout</button>
            <div className={css.tabs}>
                <button
                    className={activeTab === 'segments' ? css.active : ''}
                    onClick={() => setActiveTab('segments')}
                >
                    Segments
                </button>
            </div>
            <div className={css.tabContent}>
                {activeTab === 'segments' && <Segments />}
            </div>
        </div>
    )
}

export default AdminPanel
