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

const Container = styled.div`
  background-color: #F0F9FF;
  min-height: 100vh;
  padding: 16px;
  font-family: 'Helvetica Neue', Arial, sans-serif;

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: #1F2937;

  @media (min-width: 768px) {
    font-size: 32px;
    margin-bottom: 32px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: 16px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #4B5563;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const CopyrightText = styled.p`
  font-size: 12px;
  color: #6B7280;
  text-align: center;
  margin-top: 24px;
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
    <Container>
      <Content>
        <Title>DASHBOARD</Title>
        <Grid>
          {cards.map((card, index) => (
            <Card key={index} onClick={card.onClick}>
              <CardContent>
                <IconWrapper>
                  <card.icon size={24} />
                </IconWrapper>
                <CardTitle>{card.label}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <CopyrightText>Version 1.2.2 - © 2024 Marco Augusto Comba</CopyrightText>
      </Content>
    </Container>
  );
};

export default MainView;