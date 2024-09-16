import React, { useState } from 'react';
import MainView from './MainView';
import LastMonthView from './LastMonthView';

const Dashboard = () => {
    const [view, setView] = useState('main');

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Statistiche Studio Pumaisdue</h1>
            {view === 'main' ? (
                <MainView setView={setView} />
            ) : view === 'lastMonth' ? (
                <LastMonthView setView={setView} />
            ) : null}
        </div>
    );
};

export default Dashboard;