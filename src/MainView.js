import React, { useMemo } from 'react';
import styled from 'styled-components';
import { 
  Calendar, 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  GitCompare, 
  Info, 
  PlusCircle, 
  Mic 
} from 'lucide-react';

const DashboardContainer = styled.div`
  background-color: #F0F9FF;
  min-height: 100vh;
  padding: 24px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  position: relative;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: #1E40AF;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const DashboardCard = styled.div`
  background-color: ${props => props.color};
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 16px;
`;

const CardLabel = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #4B5563;
  text-align: center;
`;

const CopyrightText = styled.p`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #6B7280;
  text-align: center;
`;

const MainView = ({ setView }) => {
  const cards = useMemo(() => [
    { icon: <Calendar size={48} />, label: "Ultimo Mese", color: "#E6F3FF", onClick: () => setView('lastMonth') },
    { icon: <BarChart2 size={48} />, label: "Ultimo Anno", color: "#FEF3C7", onClick: () => setView('lastYear') },
    { icon: <GitCompare size={48} />, label: "Confronta mesi", color: "#D1FAE5", onClick: () => setView('compareMonths') },
    { icon: <TrendingUp size={48} />, label: "Confronta Anni", color: "#EDE9FE", onClick: () => setView('compareYears') },
    { icon: <Mic size={48} />, label: "Statistiche Fonici", color: "#FEE2E2", onClick: () => setView('statisticheFonici') },
    { icon: <PieChart size={48} />, label: "Performance Trend", color: "#D1FAE5", onClick: () => setView('performanceTrend') },
    { icon: <Info size={48} />, label: "Informazioni", color: "#E0E7FF", onClick: () => setView('information') },
    { icon: <PlusCircle size={48} />, label: "Inserisci Dati", color: "#FDE68A", onClick: () => setView('dataInput') },
  ], [setView]);

  return (
    <DashboardContainer>
      <DashboardContent>
        <DashboardTitle>DASHBOARD</DashboardTitle>
        <DashboardGrid>
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              color={card.color}
              onClick={card.onClick}
              role="button"
              aria-label={card.label}
            >
              <CardIcon>{card.icon}</CardIcon>
              <CardLabel>{card.label}</CardLabel>
            </DashboardCard>
          ))}
        </DashboardGrid>
      </DashboardContent>
      <CopyrightText>Version 1.2.2 - © 2024 Marco Augusto Comba</CopyrightText>
    </DashboardContainer>
  );
};

export default MainView;