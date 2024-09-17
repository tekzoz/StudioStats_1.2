import React, { useState } from 'react';
import MainView from './MainView';
import LandingPage from './LandingPage';
import LastMonthView from './LastMonthView';
import LastYearView from './LastYearView';
import CompareMonthsView from './CompareMonthsView';
import CompareYearsView from './CompareYearsView';
import DataInputView from './DataInputView';
import InformationView from './InformationView';
import StatisticheFonici from './StatisticheFonici';
import PerformanceTrendView from './PerformanceTrendView';

const App = () => {
  const [currentView, setCurrentView] = useState('landing');

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onEnter={() => setCurrentView('main')} />;
      case 'main':
        return <MainView setView={setCurrentView} />;
      case 'lastMonth':
        return <LastMonthView setView={setCurrentView} />;
      case 'lastYear':
        return <LastYearView setView={setCurrentView} />;
      case 'compareMonths':
        return <CompareMonthsView setView={setCurrentView} />;
      case 'compareYears':
        return <CompareYearsView setView={setCurrentView} />;
      case 'dataInput':
        return <DataInputView setView={setCurrentView} />;
      case 'information':
        return <InformationView setView={setCurrentView} />;
      case 'statisticheFonici':
        return <StatisticheFonici setView={setCurrentView} />;
      case 'performanceTrend':
        return <PerformanceTrendView setView={setCurrentView} />;
      default:
        return <LandingPage onEnter={() => setCurrentView('main')} />;
    }
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
};

export default App;