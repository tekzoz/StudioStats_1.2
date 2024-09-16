import React, { useState, useEffect } from 'react';
import { MonthYearIcon, YearIcon, CompareMonthsIcon, CompareYearsIcon, CalendarIcon, PerformanceTrendIcon, InformationIcon } from './Icons';

const DashboardCard = ({ icon, label, color, onClick, isVisible }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onClick={() => {
        onClick();
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
      }}
      style={{
        backgroundColor: color,
        borderRadius: '12px',
        boxShadow: isPressed 
          ? 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' 
          : '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: '1 / 1',
        cursor: 'pointer',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        transition: 'transform 0.1s, box-shadow 0.1s, opacity 0.2s, scale 0.2s',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      onMouseEnter={(e) => {
        if (!isPressed) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isPressed) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      <div style={{ width: '75%', height: '75%', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <span style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563', textAlign: 'center' }}>{label}</span>
    </div>
  );
};

const MainView = ({ setView }) => {
  const [visibleCards, setVisibleCards] = useState([]);

  const cards = [
    { icon: <MonthYearIcon />, label: "Ultimo Mese", color: "#E6F3FF", onClick: () => setView('lastMonth') },
    { icon: <YearIcon />, label: "Ultimo Anno", color: "#FEF3C7", onClick: () => console.log("Ultimo Anno") },
    { icon: <CompareMonthsIcon />, label: "Confronta mese", color: "#D1FAE5", onClick: () => console.log("Confronta mese") },
    { icon: <CompareYearsIcon />, label: "Confronta Anno", color: "#EDE9FE", onClick: () => console.log("Confronta Anno") },
    { icon: <CalendarIcon />, label: "Calendario", color: "#FEE2E2", onClick: () => console.log("Calendario") },
    { icon: <PerformanceTrendIcon />, label: "Performance Trend", color: "#D1FAE5", onClick: () => console.log("Performance Trend") },
    { icon: null, label: "", color: "#F3F4F6", onClick: () => {} },
    { icon: <InformationIcon />, label: "Informazioni", color: "#E0E7FF", onClick: () => console.log("Informazioni") },
  ];

  useEffect(() => {
    const totalAnimationTime = 1000; // 1 second
    const intervalTime = totalAnimationTime / cards.length;
    
    cards.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => {
          const newIndexes = [...prev, index];
          // Shuffle the new indexes to add randomness
          return newIndexes.sort(() => Math.random() - 0.5);
        });
      }, index * intervalTime);
    });
  }, []);

  return (
    <div style={{
      backgroundColor: '#F0F9FF',
      minHeight: '100vh',
      padding: '16px',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ maxWidth: '768px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px',
          color: '#2D3748',
        }}>
          Statistiche Studio Pumaisdue
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {cards.map((card, index) => (
            <DashboardCard key={index} {...card} isVisible={visibleCards.includes(index)} />
          ))}
        </div>
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6B7280',
          fontStyle: 'italic',
        }}>
          Fai clic per tornare indietro, tieni premuto per vedere la cronologia
        </div>
      </div>
    </div>
  );
};

export default MainView;