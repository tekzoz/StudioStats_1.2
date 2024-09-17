import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { getMonthData, getAvailableMonths } from './data';

const ViewContainer = styled.div`
  background-color: #F0F9FF;
  min-height: 100vh;
  padding: 24px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: #4B5563;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 24px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #374151;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px;
  color: #1F2937;
`;

const ComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Column = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 32%;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const Card = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;

const DataSection = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background-color: #F3F4F6;
  border-radius: 4px;
`;

const DataTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const DifferenceSection = styled(DataSection)`
  display: flex;
  align-items: center;
  color: ${props => props.isPositive ? '#10B981' : '#EF4444'};
`;

const MonthDataDisplay = ({ monthData, monthLabel }) => {
  if (!monthData) return null;

  return (
    <Card>
      <CardTitle>{monthLabel}</CardTitle>
      <DataSection>
        <DataTitle>Totale Turni</DataTitle>
        <p>{monthData.totaleTurni}</p>
      </DataSection>
      <DataSection>
        <DataTitle>Media Giornaliera</DataTitle>
        <p>{monthData.mediaGiornaliera.toFixed(2)}</p>
      </DataSection>
    </Card>
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
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
      <DifferenceSection isPositive={isPositive}>
        <DataTitle>{label}</DataTitle>
        <Icon size={20} style={{ marginRight: '8px' }} />
        <p>
          {isPositive ? '+' : ''}{diff.toFixed(2)} ({isPositive ? '+' : ''}{percentage}%)
        </p>
      </DifferenceSection>
    );
  };

  return (
    <Card>
      <CardTitle>Differenze</CardTitle>
      <p style={{ textAlign: 'center', marginBottom: '16px' }}>{month1Label} rispetto a {month2Label}</p>
      {renderDifference('Totale Turni', totalTurniDiff.diff, totalTurniDiff.percentage)}
      {renderDifference('Media Giornaliera', mediaGiornalieraDiff.diff, mediaGiornalieraDiff.percentage)}
    </Card>
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
    <ViewContainer>
      <Content>
        <BackButton onClick={() => setView('main')}>
          <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Torna alla Dashboard
        </BackButton>
        
        <Title>Confronta Mesi</Title>

        <ComparisonContainer>
          <Column>
            <Select 
              value={selectedMonth1} 
              onChange={(e) => setSelectedMonth1(e.target.value)}
            >
              <option value="">Seleziona il primo mese</option>
              {availableMonths.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </Select>
            <MonthDataDisplay monthData={monthData1} monthLabel={availableMonths.find(m => m.value === selectedMonth1)?.label} />
          </Column>
          <Column>
            <DifferenceDisplay 
              monthData1={monthData1} 
              monthData2={monthData2} 
              month1Label={availableMonths.find(m => m.value === selectedMonth1)?.label}
              month2Label={availableMonths.find(m => m.value === selectedMonth2)?.label}
            />
          </Column>
          <Column>
            <Select 
              value={selectedMonth2} 
              onChange={(e) => setSelectedMonth2(e.target.value)}
            >
              <option value="">Seleziona il secondo mese</option>
              {availableMonths.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </Select>
            <MonthDataDisplay monthData={monthData2} monthLabel={availableMonths.find(m => m.value === selectedMonth2)?.label} />
          </Column>
        </ComparisonContainer>
      </Content>
    </ViewContainer>
  );
};

export default CompareMonthsView;