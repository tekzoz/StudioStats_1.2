import React from 'react';
import { ArrowLeft, Calendar, Clock, Gauge } from 'lucide-react';
import { getLatestMonthData, getPreviousMonthData, getAnnualAverageData } from './data';
import PerformanceGauge from './PerformanceGauge';

const StatCard = ({ icon, label, value, comparison, backgroundColor, component }) => (
  <div style={{
    backgroundColor: backgroundColor,
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '24px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
      {React.cloneElement(icon, { size: 24, color: '#4B5563' })}
      <span style={{ marginLeft: '12px', fontSize: '18px', fontWeight: '500', color: '#4B5563' }}>{label}</span>
    </div>
    {component ? (
      component
    ) : (
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>{value}</div>
    )}
    {comparison && (
      <div style={{ marginTop: '8px', fontSize: '14px' }}>
        <div style={{ color: comparison.prevMonth.value === 'N/A' ? 'gray' : (parseFloat(comparison.prevMonth.value) > 0 ? 'green' : 'red') }}>
          {comparison.prevMonth.value} ({comparison.prevMonth.percentage}) rispetto a {comparison.prevMonthName} {comparison.prevMonthYear}
        </div>
        <div style={{ color: comparison.annual.value === 'N/A' ? 'gray' : (parseFloat(comparison.annual.value) > 0 ? 'green' : 'red') }}>
          {comparison.annual.value} ({comparison.annual.percentage}) rispetto alla media annuale {comparison.year}
        </div>
      </div>
    )}
  </div>
);

const calculateComparison = (current, previous) => {
  if (typeof current !== 'number' || typeof previous !== 'number') {
    return { value: 'N/A', percentage: 'N/A' };
  }
  const diff = current - previous;
  const percentage = ((diff / previous) * 100).toFixed(1);
  return {
    value: diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1),
    percentage: diff > 0 ? `+${percentage}%` : `${percentage}%`
  };
};

const roundToHalf = (num) => {
  return Math.round(num * 2) / 2;
};

const LastMonthView = ({ setView }) => {
  const latestMonthData = getLatestMonthData();
  const previousMonthData = getPreviousMonthData();
  const annualAverageData = getAnnualAverageData();

  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const displayMonth = monthNames[lastMonth.getMonth()];
  const displayYear = lastMonth.getFullYear();
  const previousMonthName = monthNames[previousMonth.getMonth()];
  const previousMonthYear = previousMonth.getFullYear();

  const comparisonDataTurni = {
    prevMonth: calculateComparison(latestMonthData.totaleTurni, previousMonthData.totaleTurni),
    annual: calculateComparison(latestMonthData.totaleTurni, annualAverageData.mediaAnnuale),
    prevMonthName: previousMonthName,
    prevMonthYear: previousMonthYear,
    year: displayYear
  };

  const comparisonDataMedia = {
    prevMonth: calculateComparison(roundToHalf(latestMonthData.mediaGiornaliera), roundToHalf(previousMonthData.mediaGiornaliera)),
    annual: calculateComparison(roundToHalf(latestMonthData.mediaGiornaliera), roundToHalf(annualAverageData.mediaAnnuale / 30)), // Approssimazione
    prevMonthName: previousMonthName,
    prevMonthYear: previousMonthYear,
    year: displayYear
  };

  const stats = [
    { 
      icon: <Calendar />, 
      label: 'Totale Turni di Doppiaggio', 
      value: latestMonthData.totaleTurni,
      comparison: comparisonDataTurni,
      backgroundColor: '#E6F3FF'
    },
    { 
      icon: <Clock />, 
      label: 'Media Turni di Doppiaggio Giornaliera (Lun-Ven)', 
      value: roundToHalf(latestMonthData.mediaGiornaliera).toFixed(1),
      comparison: comparisonDataMedia,
      backgroundColor: '#FFF0E6'
    },
    { 
      icon: <Gauge />, 
      label: 'Utilizzo delle Sale di Doppiaggio', 
      component: <PerformanceGauge value={roundToHalf(latestMonthData.mediaGiornaliera)} />,
      backgroundColor: '#F0E6FF'
    },
  ];

  return (
    <div style={{
      backgroundColor: '#F0F9FF',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button 
          onClick={() => setView('main')} 
          style={{
            background: '#4B5563',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            marginBottom: '24px',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4B5563'}
        >
          <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Torna alla Dashboard
        </button>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '8px',
          color: '#1F2937',
        }}>
          Statistiche Ultimo Mese
        </h1>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '32px',
          color: '#4B5563',
          textTransform: 'uppercase',
        }}>
          {displayMonth} {displayYear}
        </h2>
        
        <div>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LastMonthView;