import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { getYearData, getAvailableYears, getCurrentYearAndMonth } from './data';

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

const YearDataDisplay = ({ yearData, yearLabel, limitedToMonth }) => {
  if (!yearData) return null;

  return (
    <Card>
      <CardTitle>{yearLabel}</CardTitle>
      <DataSection>
        <DataTitle>Totale Turni {limitedToMonth ? `(fino a ${limitedToMonth})` : ''}</DataTitle>
        <p>{yearData.totaleTurni}</p>
      </DataSection>
      <DataSection>
        <DataTitle>Media Mensile</DataTitle>
        <p>{yearData.mediaMensile.toFixed(2)}</p>
      </DataSection>
    </Card>
  );
};

const DifferenceDisplay = ({ yearData1, yearData2, year1Label, year2Label, limitedToMonth }) => {
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
      <p style={{ textAlign: 'center', marginBottom: '16px' }}>
        {year1Label} rispetto a {year2Label}
        {limitedToMonth ? ` (fino a ${limitedToMonth})` : ''}
      </p>
      {renderDifference('Totale Turni', totalTurniDiff.diff, totalTurniDiff.percentage)}
      {renderDifference('Media Mensile', mediaMensileDiff.diff, mediaMensileDiff.percentage)}
    </Card>
  );
};

const CompareYearsView = ({ setView }) => {
  const [selectedYear1, setSelectedYear1] = useState('');
  const [selectedYear2, setSelectedYear2] = useState('');
  const [yearData1, setYearData1] = useState(null);
  const [yearData2, setYearData2] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [limitedToMonth, setLimitedToMonth] = useState(null);

  const { currentYear, currentMonth } = getCurrentYearAndMonth();

  useEffect(() => {
    setAvailableYears(getAvailableYears());
  }, []);

  useEffect(() => {
    if (selectedYear1 && selectedYear2) {
      let limitMonth = 12;
      if (selectedYear1 == currentYear || selectedYear2 == currentYear) {
        // Calcoliamo il mese precedente
        limitMonth = currentMonth > 1 ? currentMonth - 1 : 12;
        const limitMonthName = getMonthName(limitMonth);
        setLimitedToMonth(limitMonthName);
      } else {
        setLimitedToMonth(null);
      }

      setYearData1(getYearData(selectedYear1, limitMonth));
      setYearData2(getYearData(selectedYear2, limitMonth));
    }
  }, [selectedYear1, selectedYear2, currentYear, currentMonth]);

  const getMonthName = (monthNumber) => {
    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return monthNames[monthNumber - 1];
  };

  return (
    <ViewContainer>
      <Content>
        <BackButton onClick={() => setView('main')}>
          <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Torna alla Dashboard
        </BackButton>
        
        <Title>Confronta Anni</Title>

        <ComparisonContainer>
          <Column>
            <Select 
              value={selectedYear1} 
              onChange={(e) => setSelectedYear1(e.target.value)}
            >
              <option value="">Seleziona il primo anno</option>
              {availableYears.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </Select>
            <YearDataDisplay 
              yearData={yearData1} 
              yearLabel={availableYears.find(y => y.value === selectedYear1)?.label}
              limitedToMonth={limitedToMonth}
            />
          </Column>
          <Column>
            <DifferenceDisplay 
              yearData1={yearData1} 
              yearData2={yearData2} 
              year1Label={availableYears.find(y => y.value === selectedYear1)?.label}
              year2Label={availableYears.find(y => y.value === selectedYear2)?.label}
              limitedToMonth={limitedToMonth}
            />
          </Column>
          <Column>
            <Select 
              value={selectedYear2} 
              onChange={(e) => setSelectedYear2(e.target.value)}
            >
              <option value="">Seleziona il secondo anno</option>
              {availableYears.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </Select>
            <YearDataDisplay 
              yearData={yearData2} 
              yearLabel={availableYears.find(y => y.value === selectedYear2)?.label}
              limitedToMonth={limitedToMonth}
            />
          </Column>
        </ComparisonContainer>
      </Content>
    </ViewContainer>
  );
};

export default CompareYearsView;