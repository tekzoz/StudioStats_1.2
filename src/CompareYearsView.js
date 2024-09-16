import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { getYearData, getAvailableYears } from './data';

const YearDataDisplay = ({ yearData, yearLabel }) => {
  if (!yearData) return null;

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>{yearLabel}</h2>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Totale Turni</h3>
        <p>{yearData.totaleTurni}</p>
      </div>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Media Mensile</h3>
        <p>{yearData.mediaMensile.toFixed(2)}</p>
      </div>
    </div>
  );
};

const DifferenceDisplay = ({ yearData1, yearData2, year1Label, year2Label }) => {
  if (!yearData1 || !yearData2) return null;

  const calculateDifference = (value1, value2) => {
    const diff = value1 - value2;
    const percentage = ((diff / value2) * 100).toFixed(2);
    return { diff, percentage };
  };

  const totalTurniDiff = calculateDifference(yearData1.totaleTurni, yearData2.totaleTurni);
  const mediaMensileDiff = calculateDifference(yearData1.mediaMensile, yearData2.mediaMensile);

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
      <p style={{ textAlign: 'center', marginBottom: '16px' }}>{year1Label} rispetto a {year2Label}</p>
      {renderDifference('Totale Turni', totalTurniDiff.diff, totalTurniDiff.percentage)}
      {renderDifference('Media Mensile', mediaMensileDiff.diff, mediaMensileDiff.percentage)}
    </div>
  );
};

const CompareYearsView = ({ setView }) => {
  const [selectedYear1, setSelectedYear1] = useState('');
  const [selectedYear2, setSelectedYear2] = useState('');
  const [yearData1, setYearData1] = useState(null);
  const [yearData2, setYearData2] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    setAvailableYears(getAvailableYears());
  }, []);

  useEffect(() => {
    if (selectedYear1) {
      setYearData1(getYearData(selectedYear1));
    }
  }, [selectedYear1]);

  useEffect(() => {
    if (selectedYear2) {
      setYearData2(getYearData(selectedYear2));
    }
  }, [selectedYear2]);

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
          Confronta Anni
        </h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ width: '32%' }}>
            <select 
              value={selectedYear1} 
              onChange={(e) => setSelectedYear1(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', borderRadius: '4px', marginBottom: '16px' }}
            >
              <option value="">Seleziona il primo anno</option>
              {availableYears.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
            <YearDataDisplay yearData={yearData1} yearLabel={availableYears.find(y => y.value === selectedYear1)?.label} />
          </div>
          <div style={{ width: '28%' }}>
            <DifferenceDisplay 
              yearData1={yearData1} 
              yearData2={yearData2} 
              year1Label={availableYears.find(y => y.value === selectedYear1)?.label}
              year2Label={availableYears.find(y => y.value === selectedYear2)?.label}
            />
          </div>
          <div style={{ width: '32%' }}>
            <select 
              value={selectedYear2} 
              onChange={(e) => setSelectedYear2(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', borderRadius: '4px', marginBottom: '16px' }}
            >
              <option value="">Seleziona il secondo anno</option>
              {availableYears.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
            <YearDataDisplay yearData={yearData2} yearLabel={availableYears.find(y => y.value === selectedYear2)?.label} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareYearsView;