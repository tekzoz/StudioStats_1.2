import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { getMonthData, getAvailableMonths } from './data';

const MonthDataDisplay = ({ monthData, monthLabel }) => {
  if (!monthData) return null;

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>{monthLabel}</h2>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Totale Turni</h3>
        <p>{monthData.totaleTurni}</p>
      </div>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Media Giornaliera</h3>
        <p>{monthData.mediaGiornaliera.toFixed(2)}</p>
      </div>
    </div>
  );
};

const DifferenceDisplay = ({ monthData1, monthData2, month1Label, month2Label }) => {
  if (!monthData1 || !monthData2) return null;

  const calculateDifference = (value1, value2) => {
    const diff = value1 - value2;
    const percentage = ((diff / value2) * 100).toFixed(2);
    return { diff, percentage };
  };

  const totalTurniDiff = calculateDifference(monthData1.totaleTurni, monthData2.totaleTurni);
  const mediaGiornalieraDiff = calculateDifference(monthData1.mediaGiornaliera, monthData2.mediaGiornaliera);

  const renderDifference = (label, diff, percentage) => {
    const isPositive = diff > 0;
    const color = isPositive ? '#10B981' : '#EF4444';
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{label}</h3>
        <div style={{ display: 'flex', alignItems: 'center', color: color }}>
          <Icon size={20} style={{ marginRight: '8px' }} />
          <p>
            {isPositive ? '+' : ''}{diff.toFixed(2)} ({isPositive ? '+' : ''}{percentage}%)
          </p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Differenze</h2>
      <p style={{ textAlign: 'center', marginBottom: '16px' }}>{month1Label} rispetto a {month2Label}</p>
      {renderDifference('Totale Turni', totalTurniDiff.diff, totalTurniDiff.percentage)}
      {renderDifference('Media Giornaliera', mediaGiornalieraDiff.diff, mediaGiornalieraDiff.percentage)}
    </div>
  );
};

const CompareMonthsView = ({ setView }) => {
  const [selectedMonth1, setSelectedMonth1] = useState('');
  const [selectedMonth2, setSelectedMonth2] = useState('');
  const [monthData1, setMonthData1] = useState(null);
  const [monthData2, setMonthData2] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    setAvailableMonths(getAvailableMonths());
  }, []);

  useEffect(() => {
    if (selectedMonth1) {
      setMonthData1(getMonthData(selectedMonth1));
    }
  }, [selectedMonth1]);

  useEffect(() => {
    if (selectedMonth2) {
      setMonthData2(getMonthData(selectedMonth2));
    }
  }, [selectedMonth2]);

  return (
    <div style={{
      backgroundColor: '#F0F9FF',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
          marginBottom: '32px',
          color: '#1F2937',
        }}>
          Confronta Mesi
        </h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ width: '32%' }}>
            <select 
              value={selectedMonth1} 
              onChange={(e) => setSelectedMonth1(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', borderRadius: '4px', marginBottom: '16px' }}
            >
              <option value="">Seleziona il primo mese</option>
              {availableMonths.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <MonthDataDisplay monthData={monthData1} monthLabel={availableMonths.find(m => m.value === selectedMonth1)?.label} />
          </div>
          <div style={{ width: '28%' }}>
            <DifferenceDisplay 
              monthData1={monthData1} 
              monthData2={monthData2} 
              month1Label={availableMonths.find(m => m.value === selectedMonth1)?.label}
              month2Label={availableMonths.find(m => m.value === selectedMonth2)?.label}
            />
          </div>
          <div style={{ width: '32%' }}>
            <select 
              value={selectedMonth2} 
              onChange={(e) => setSelectedMonth2(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', borderRadius: '4px', marginBottom: '16px' }}
            >
              <option value="">Seleziona il secondo mese</option>
              {availableMonths.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <MonthDataDisplay monthData={monthData2} monthLabel={availableMonths.find(m => m.value === selectedMonth2)?.label} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareMonthsView;