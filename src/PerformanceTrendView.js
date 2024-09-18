import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Share2 } from 'lucide-react';
import { 
  getYearlyData, 
  getCurrentYearAndMonth,
  getAvailableYears
} from './data';

// Styled components (invariati)

const ViewContainer = styled.div`
  background-color: #F0F9FF;
  min-height: 100vh;
  padding: 24px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const ViewContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ViewTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px;
  color: #1F2937;
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const AnalysisSection = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const AnalysisTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #1F2937;
`;

const AnalysisText = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: #4B5563;
  white-space: pre-wrap;
`;

const BlurredText = styled.div`
  filter: blur(5px);
  position: relative;
  overflow: hidden;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 24px;
  font-weight: bold;
  color: red;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  filter: none;
  text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 10px;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => props.color};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const Button = styled.button`
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #2563EB;
  }

  svg {
    margin-right: 8px;
  }
`;

// Helper functions
const getMonthName = (monthNumber) => {
  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  return monthNames[monthNumber - 1];
};

const formatNumber = (num) => new Intl.NumberFormat('it-IT').format(Math.round(num));

const generateColorPalette = (numColors) => {
  const hueStep = 360 / numColors;
  return Array.from({ length: numColors }, (_, i) => 
    `hsl(${i * hueStep}, 70%, 50%)`
  );
};

const PerformanceTrendView = ({ setView }) => {
  const [allYearsData, setAllYearsData] = useState({});
  const [yearAnalysis, setYearAnalysis] = useState('');
  const [prediction, setPrediction] = useState('');

  const availableYears = useMemo(() => getAvailableYears().map(y => parseInt(y.value)), []);
  const colorPalette = useMemo(() => generateColorPalette(availableYears.length), [availableYears]);
  const { currentYear, currentMonth } = getCurrentYearAndMonth();

  const generateYearAnalysis = useCallback((year, currentMonth, yearData, allYearsData) => {
    const month = currentMonth > 1 ? currentMonth - 1 : 12;
    const yearToAnalyze = month === 12 ? year - 1 : year;
    const currentYearData = yearData[yearToAnalyze] || {};
    
    const totalTurni = Object.values(currentYearData)
      .slice(0, month)
      .reduce((sum, monthData) => sum + (monthData?.totaleTurni || 0), 0);
    
    const monthsWithData = Object.values(currentYearData)
      .slice(0, month)
      .filter(monthData => monthData && monthData.totaleTurni > 0).length;
    
    const averageMonthlyTurni = monthsWithData > 0 ? totalTurni / monthsWithData : 0;
  
    const previousYearsData = Object.entries(allYearsData)
      .filter(([y]) => parseInt(y) < yearToAnalyze && parseInt(y) >= 2021)
      .map(([year, data]) => {
        const yearTotal = Object.values(data)
          .slice(0, month)
          .reduce((sum, monthData) => sum + (monthData?.totaleTurni || 0), 0);
        return { year: parseInt(year), totalTurni: yearTotal };
      });
  
    const avgPreviousYears = previousYearsData.reduce((sum, y) => sum + y.totalTurni, 0) / previousYearsData.length;
    
    let analysis = `Considerazioni sull'anno in corso ${yearToAnalyze} (fino a ${getMonthName(month)}):\n\n`;
    analysis += `Nel periodo analizzato, sono stati effettuati un totale di ${formatNumber(totalTurni)} turni, `;
    analysis += `con una media mensile di ${formatNumber(averageMonthlyTurni)} turni. `;
    
    const percentageDiff = ((totalTurni - avgPreviousYears) / avgPreviousYears) * 100;
    analysis += `Questo rappresenta un ${percentageDiff > 0 ? 'aumento' : 'diminuzione'} del ${formatNumber(Math.abs(percentageDiff))}% `;
    analysis += `rispetto alla media di tutti gli anni precedenti nello stesso periodo. `;

    analysis += `\n\nAnalisi stagionale:\n`;
    const monthlyTurni = Object.values(currentYearData)
      .slice(0, month)
      .map(m => m ? m.totaleTurni : undefined);
    const quarterlyData = [
      monthlyTurni.slice(0, 3).filter(m => m !== undefined),
      monthlyTurni.slice(3, 6).filter(m => m !== undefined),
      monthlyTurni.slice(6, 9).filter(m => m !== undefined),
      monthlyTurni.slice(9, 12).filter(m => m !== undefined)
    ];

    const quarterlyAverages = quarterlyData.map(q => q.length > 0 ? q.reduce((a, b) => a + b, 0) / q.length : null);
    
    const quarters = ['primo', 'secondo', 'terzo', 'quarto'];
    quarterlyAverages.forEach((avg, index) => {
      if (avg !== null) {
        const percentDiff = ((avg - avgPreviousYears / 12) / (avgPreviousYears / 12)) * 100;
        analysis += `Il ${quarters[index]} trimestre mostra una media di ${formatNumber(avg)} turni al mese, `;
        analysis += `${percentDiff > 0 ? 'superiore' : 'inferiore'} del ${formatNumber(Math.abs(percentDiff))}% rispetto alla media degli anni passati.\n`;
      }
    });

    const allYearsTotals = Object.entries(allYearsData)
      .map(([year, data]) => ({
        year: parseInt(year),
        totalTurni: Object.values(data)
          .slice(0, month)
          .reduce((sum, monthData) => sum + (monthData?.totaleTurni || 0), 0)
      }))
      .sort((a, b) => b.totalTurni - a.totalTurni);

    const currentYearRank = allYearsTotals.findIndex(y => y.year === yearToAnalyze) + 1;
    const totalYears = allYearsTotals.length;

    analysis += `\nConclusione:\n`;
    analysis += `Con le informazioni attuali possiamo determinare che la produttività dell'anno in corso è `;
    analysis += `${percentageDiff > 0 ? 'superiore' : 'inferiore'} alla media degli anni passati del ${formatNumber(Math.abs(percentageDiff))}%. `;
    analysis += `Si posiziona al ${currentYearRank}° posto su ${totalYears} nella classifica generale. `;
    analysis += `Questo posizionamento tiene conto di tutti gli anni disponibili nei dati, `;
    analysis += `mentre il confronto con la media considera solo il periodo analizzato fino ad ora (${getMonthName(month)}). `;
    
    if (month < 12) {
      analysis += `C'è ancora tempo per migliorare la performance complessiva dell'anno.`;
    }

    return analysis;
  }, []);

  const makePrediction = useCallback((year, month, allYearsData) => {
    let analysis = '';
    const futurePredictions = [];
    let totalEffectiveTurni = 0;
    let totalPredictedTurni = 0;
  
    for (let i = 0; i < 12; i++) {
      const monthData = allYearsData[year][i];
      if (i < month - 1) {
        totalEffectiveTurni += monthData ? monthData.totaleTurni : 0;
      } else {
        let totalTurni = 0;
        let yearsCount = 0;
        availableYears.forEach(y => {
          if (y !== 2020 && y !== year) {
            const yearData = allYearsData[y];
            if (yearData && yearData[i] && yearData[i].totaleTurni > 0) {
              totalTurni += yearData[i].totaleTurni;
              yearsCount++;
            }
          }
        });
        if (yearsCount > 0) {
          const averageTurni = Math.round(totalTurni / yearsCount);
          totalPredictedTurni += averageTurni;
          futurePredictions.push(`• ${getMonthName(i + 1)}: ${formatNumber(averageTurni)} turni`);
        }
      }
    }
  
    const totalComplessivo = totalEffectiveTurni + totalPredictedTurni;
  
    const productivityRanking = availableYears
      .map(y => {
        if (y === year) {
          return { year: y, totalTurni: totalComplessivo };
        } else {
          const yearTotalTurni = Object.values(allYearsData[y]).reduce((sum, month) => sum + (month ? month.totaleTurni : 0), 0);
          return { year: y, totalTurni: yearTotalTurni };
        }
      })
      .sort((a, b) => b.totalTurni - a.totalTurni);
  
    analysis += `Turni effettivi (fino a ${getMonthName(month - 1)}): ${formatNumber(totalEffectiveTurni)}\n`;
    analysis += `Turni previsti (da ${getMonthName(month)} a Dicembre): ${formatNumber(totalPredictedTurni)}\n`;
    analysis += `Totale complessivo stimato per l'anno ${year}: ${formatNumber(totalComplessivo)}\n\n`;
  
    analysis += `Previsione per i mesi rimanenti (in base alla media degli anni precedenti):\n${futurePredictions.join('\n')}\n\n`;
  
    analysis += `Classifica di produttività (totale turni per anno):\n`;
    productivityRanking.forEach((item, index) => {
      analysis += `${index + 1}. ${item.year}: ${formatNumber(item.totalTurni)} turni`;
      if (item.year === year) {
        analysis += ` (proiezione)`;
      }
      analysis += '\n';
    });
  
    const currentYearRank = productivityRanking.findIndex(item => item.year === year) + 1;
    analysis += `\nL'anno ${year} si posiziona attualmente al ${currentYearRank}° posto nella classifica di produttività.`;
    
    if (currentYearRank === 1) {
      analysis += ` Questo suggerisce un anno particolarmente produttivo, potenzialmente superando i risultati degli anni precedenti.`;
    } else if (currentYearRank <= 3) {
      analysis += ` Questa è una performance solida, indicando un anno di buona produttività.`;
    } else {
      analysis += ` C'è potenziale per migliorare la produttività nei mesi rimanenti per salire nella classifica.`;
    }
  
    return analysis;
  }, [availableYears]);

  const formatChartData = useCallback(() => {
    const chartData = [];
    
    const calculateAverageForMonth = (month) => {
      const relevantYears = availableYears.filter(year => year !== 2020 && year !== currentYear);
      const sum = relevantYears.reduce((acc, year) => {
        const yearData = allYearsData[year];
        return acc + (yearData && yearData[month] ? yearData[month].totaleTurni : 0);
      }, 0);
      return Math.round(sum / relevantYears.length);
    };
  
    for (let month = 0; month < 12; month++) {
      const monthData = { month: getMonthName(month + 1) };
      availableYears.forEach(year => {
        const yearData = allYearsData[year];
        if (year === currentYear) {
          if (month < currentMonth - 1) {
            monthData[year] = yearData && yearData[month] ? Math.round(yearData[month].totaleTurni) : 0;
            monthData[`${year}IsPrediction`] = false;
          } else {
            monthData[year] = calculateAverageForMonth(month);
            monthData[`${year}IsPrediction`] = true;
          }
        } else {
          monthData[year] = yearData && yearData[month] ? Math.round(yearData[month].totaleTurni) : 0;
        }
      });
      chartData.push(monthData);
    }
    return chartData;
  }, [allYearsData, availableYears, currentYear, currentMonth]);

  useEffect(() => {
    const fetchData = async () => {
      const yearsData = {};
      for (const year of availableYears) {
        yearsData[year] = await getYearlyData(year);
      }
      setAllYearsData(yearsData);

      setYearAnalysis(generateYearAnalysis(currentYear, currentMonth, yearsData, yearsData));
      setPrediction(makePrediction(currentYear, currentMonth, yearsData));
    };

    fetchData();
  }, [currentYear, currentMonth, availableYears, generateYearAnalysis, makePrediction]);

  const chartData = useMemo(() => formatChartData(), [formatChartData]);

  const renderAnalysisWithBlur = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('Considerazioni') || line.trim() === '' || line.startsWith('Analisi') || line.startsWith('Conclusione')) {
        return <div key={index}>{line}</div>;
      } else {
        return (
          <div style={{ position: 'relative' }} key={index}>
            <BlurredText>{line}</BlurredText>
            <OverlayText>In fase di sviluppo</OverlayText>
          </div>
        );
      }
    });
  };

  const handleShare = () => {
    const shareText = `Performance Trend ${currentYear}\n\n${yearAnalysis}\n\n${prediction}`;
    if (navigator.share) {
      navigator.share({
        title: 'Performance Trend',
        text: shareText,
      }).catch(console.error);
    } else {
      alert("La condivisione non è supportata su questo browser. Copia e incolla il testo seguente:\n\n" + shareText);
    }
  };

  return (
    <ViewContainer>
      <ViewContent>
        <ViewTitle>Performance Trend</ViewTitle>
        <ChartContainer>
          <AnalysisTitle>Trend annuale</AnalysisTitle>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              {availableYears.map((year, index) => {
                const isCurrentYear = year === currentYear;
                if (isCurrentYear) {
                  return (
                    <React.Fragment key={year}>
                      <Line
                        type="monotone"
                        dataKey={(dataPoint) => dataPoint[`${year}IsPrediction`] ? undefined : dataPoint[year]}
                        stroke={colorPalette[index]}
                        strokeWidth={3}
                        dot={false}
                        connectNulls={true}
                      />
                      <Line
                        type="monotone"
                        dataKey={(dataPoint) => {
                          if (dataPoint[`${year}IsPrediction`]) {
                            return dataPoint[year];
                          }
                          const lastRealMonth = chartData.findIndex(d => d[`${year}IsPrediction`]) - 1;
                          return dataPoint === chartData[lastRealMonth] ? dataPoint[year] : undefined;
                        }}
                        stroke={colorPalette[index]}
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={false}
                        connectNulls={true}
                      />
                    </React.Fragment>
                  );
                } else {
                  return (
                    <Line
                      key={year}
                      type="monotone"
                      dataKey={year.toString()}
                      stroke={colorPalette[index]}
                      strokeWidth={1}
                      dot={false}
                    />
                  );
                }
              })}
            </LineChart>
          </ResponsiveContainer>
          <LegendContainer>
            {availableYears.map((year, index) => (
              <LegendItem key={year}>
                <LegendColor color={colorPalette[index]} />
                <span>{year === currentYear ? `${year} (linea continua: dati reali, tratteggiata: previsione)` : year}</span>
              </LegendItem>
            ))}
          </LegendContainer>
        </ChartContainer>
        <AnalysisSection>
          <AnalysisTitle>Considerazioni sull'anno in corso</AnalysisTitle>
          <AnalysisText>{renderAnalysisWithBlur(yearAnalysis)}</AnalysisText>
        </AnalysisSection>
        <AnalysisSection>
          <AnalysisTitle>Previsione per i prossimi mesi</AnalysisTitle>
          <AnalysisText>{prediction}</AnalysisText>
        </AnalysisSection>
        <ButtonContainer>
          <Button onClick={() => setView('main')}>Torna alla Dashboard</Button>
          <Button onClick={handleShare}>
            <Share2 size={20} />
            Condividi
          </Button>
        </ButtonContainer>
      </ViewContent>
    </ViewContainer>
  );
};

export default PerformanceTrendView;