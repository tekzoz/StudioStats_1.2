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
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
`;

const DashboardContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const DashboardTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #1e293b;
`;

const CardList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const CardItem = styled.li`
  margin-bottom: 1rem;
`;

const DashboardCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const CardIcon = styled.div`
  margin-right: 1rem;
  color: ${props => props.color};
`;

const CardLabel = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #334155;
`;

const CopyrightText = styled.p`
  margin-top: 2rem;
  font-size: 0.75rem;
  color: #64748b;
  text-align: center;
`;

const MainView = ({ setView }) => {
  const cards = [
    { icon: Calendar, label: "Ultimo Mese", color: "#3b82f6", onClick: () => setView('lastMonth') },
    { icon: BarChart2, label: "Ultimo Anno", color: "#ef4444", onClick: () => setView('lastYear') },
    { icon: GitCompare, label: "Confronta mesi", color: "#10b981", onClick: () => setView('compareMonths') },
    { icon: TrendingUp, label: "Confronta Anni", color: "#8b5cf6", onClick: () => setView('compareYears') },
    { icon: Mic, label: "Statistiche Fonici", color: "#f59e0b", onClick: () => setView('statisticheFonici') },
    { icon: PieChart, label: "Performance Trend", color: "#14b8a6", onClick: () => setView('performanceTrend') },
    { icon: Info, label: "Informazioni", color: "#6366f1", onClick: () => setView('information') },
    { icon: PlusCircle, label: "Inserisci Dati", color: "#ec4899", onClick: () => setView('dataInput') },
  ];

  return (
    <DashboardContainer>
      <DashboardContent>
        <DashboardTitle>DASHBOARD</DashboardTitle>
        <CardList>
          {cards.map((card, index) => (
            <CardItem key={index}>
              <DashboardCard onClick={card.onClick}>
                <CardIcon color={card.color}>
                  <card.icon size={24} />
                </CardIcon>
                <CardLabel>{card.label}</CardLabel>
              </DashboardCard>
            </CardItem>
          ))}
        </CardList>
        <CopyrightText>Version 1.2.2 - © 2024 Marco Augusto Comba</CopyrightText>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default MainView;