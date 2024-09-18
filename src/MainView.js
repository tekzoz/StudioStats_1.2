import React from 'react';
import styled from 'styled-components';
import { 
  Calendar, 
  BarChart2, 
  GitCompare, 
  TrendingUp, 
  Mic, 
  PieChart, 
  Info, 
  PlusCircle 
} from 'lucide-react';

const DashboardContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const DashboardTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  margin-right: 10px;
`;

const CardLabel = styled.span`
  font-size: 16px;
`;

const CopyrightText = styled.p`
  font-size: 12px;
  margin-top: 20px;
`;

const MainView = ({ setView }) => {
  const cards = [
    { icon: Calendar, label: "Ultimo Mese", onClick: () => setView('lastMonth') },
    { icon: BarChart2, label: "Ultimo Anno", onClick: () => setView('lastYear') },
    { icon: GitCompare, label: "Confronta mesi", onClick: () => setView('compareMonths') },
    { icon: TrendingUp, label: "Confronta Anni", onClick: () => setView('compareYears') },
    { icon: Mic, label: "Statistiche Fonici", onClick: () => setView('statisticheFonici') },
    { icon: PieChart, label: "Performance Trend", onClick: () => setView('performanceTrend') },
    { icon: Info, label: "Informazioni", onClick: () => setView('information') },
    { icon: PlusCircle, label: "Inserisci Dati", onClick: () => setView('dataInput') },
  ];

  return (
    <DashboardContainer>
      <DashboardTitle>DASHBOARD</DashboardTitle>
      <CardList>
        {cards.map((card, index) => (
          <Card key={index} onClick={card.onClick}>
            <IconWrapper>
              <card.icon size={20} />
            </IconWrapper>
            <CardLabel>{card.label}</CardLabel>
          </Card>
        ))}
      </CardList>
      <CopyrightText>Version 1.2.2 - © 2024 Marco Augusto Comba</CopyrightText>
    </DashboardContainer>
  );
};

export default MainView;