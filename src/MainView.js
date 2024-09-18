import React from 'react';
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const DashboardCard = styled.div`
  background-color: ${props => props.color};
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const CardIcon = styled.div`
  margin-bottom: 12px;
`;

const CardLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #4B5563;
  text-align: center;
`;

const CopyrightText = styled.p`
  margin-top: 40px;
  font-size: 12px;
  color: #6B7280;
  text-align: center;
`;

const MainView = ({ setView }) => {
  const cards = [
    { icon: <Calendar size={32} />, label: "Ultimo Mese", color: "#E6F3FF", onClick: () => setView('lastMonth') },
    { icon: <BarChart2 size={32} />, label: "Ultimo Anno", color: "#FEF3C7", onClick: () => setView('lastYear') },
    { icon: <GitCompare size={32} />, label: "Confronta mesi", color: "#D1FAE5", onClick: () => setView('compareMonths') },
    { icon: <TrendingUp size={32} />, label: "Confronta Anni", color: "#EDE9FE", onClick: () => setView('compareYears') },
    { icon: <Mic size={32} />, label: "Statistiche Fonici", color: "#FEE2E2", onClick: () => setView('statisticheFonici') },
    { icon: <PieChart size={32} />, label: "Performance Trend", color: "#D1FAE5", onClick: () => setView('performanceTrend') },
    { icon: <Info size={32} />, label: "Informazioni", color: "#E0E7FF", onClick: () => setView('information') },
    { icon: <PlusCircle size={32} />, label: "Inserisci Dati", color: "#FDE68A", onClick: () => setView('dataInput') },
  ];

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
            >
              <CardIcon>{card.icon}</CardIcon>
              <CardLabel>{card.label}</CardLabel>
            </DashboardCard>
          ))}
        </DashboardGrid>
        <CopyrightText>Version 1.2.2 - © 2024 Marco Augusto Comba</CopyrightText>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default MainView;