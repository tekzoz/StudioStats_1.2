import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MonthYearIcon, YearIcon, CompareMonthsIcon, CompareYearsIcon, PerformanceTrendIcon, InformationIcon } from './Icons';
import { PlusCircle, Mic } from 'lucide-react';

const DashboardContainer = styled.div`
  background-color: #F0F9FF;
  min-height: 100vh;
  padding: 24px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const DashboardContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const DashboardTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px;
  color: #1F2937;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DashboardCard = styled.div`
  background-color: ${props => props.color};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s, scale 0.3s;
  opacity: ${props => props.isVisible ? 1 : 0};
  scale: ${props => props.isVisible ? 1 : 0.8};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
    max-width: 150px;
    max-height: 150px;
  }
`;

const CardLabel = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #4B5563;
  text-align: center;
`;

const MainView = ({ setView }) => {
  const [visibleCards, setVisibleCards] = useState([]);

  const cards = [
    { icon: <MonthYearIcon />, label: "Ultimo Mese", color: "#E6F3FF", onClick: () => setView('lastMonth') },
    { icon: <YearIcon />, label: "Ultimo Anno", color: "#FEF3C7", onClick: () => setView('lastYear') },
    { icon: <CompareMonthsIcon />, label: "Confronta mesi", color: "#D1FAE5", onClick: () => setView('compareMonths') },
    { icon: <CompareYearsIcon />, label: "Confronta Anni", color: "#EDE9FE", onClick: () => setView('compareYears') },
    { icon: <Mic size="100%" color="red" />, label: "Statistiche Fonici", color: "#FEE2E2", onClick: () => setView('statisticheFonici') },
    { icon: <PerformanceTrendIcon />, label: "Performance Trend", color: "#D1FAE5", onClick: () => console.log("Performance Trend") },
    { icon: <InformationIcon />, label: "Informazioni", color: "#E0E7FF", onClick: () => setView('information') },
    { icon: <PlusCircle size="100%" />, label: "Inserisci Dati", color: "#FDE68A", onClick: () => setView('dataInput') },
  ];

  useEffect(() => {
    const totalAnimationTime = 1000;
    const delay = totalAnimationTime / cards.length;
    
    const timer = setInterval(() => {
      setVisibleCards(prev => {
        if (prev.length === cards.length) {
          clearInterval(timer);
          return prev;
        }
        const remaining = cards.length - prev.length;
        const newIndexes = [...Array(remaining)].map((_, i) => prev.length + i);
        return [...prev, ...newIndexes.sort(() => Math.random() - 0.5)];
      });
    }, delay);

    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <DashboardContainer>
      <DashboardContent>
        <DashboardTitle>Statistiche Studio Pumaisdue</DashboardTitle>
        <DashboardGrid>
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              color={card.color}
              onClick={card.onClick}
              isVisible={visibleCards.includes(index)}
              role="button"
              aria-label={card.label}
            >
              <CardIcon>{card.icon}</CardIcon>
              <CardLabel>{card.label}</CardLabel>
            </DashboardCard>
          ))}
        </DashboardGrid>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default MainView;