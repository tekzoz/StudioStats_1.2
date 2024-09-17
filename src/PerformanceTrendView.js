import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  getYearlyData, 
  getCurrentYearAndMonth,
  getAvailableYears
} from './data';

// Styled components
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

const AnalysisText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #4B5563;
  white-space: pre-line;
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

const BackButton = styled.button`
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563EB;
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
  const [yearConclusions, setYearConclusions] = useState('');
  const [prediction, setPrediction] = useState('');

  const availableYears = useMemo(() => getAvailableYears().map(y => parseInt(y.value)), []);
  const colorPalette = useMemo(() => generateColorPalette(availableYears.length), [availableYears]);
  const { currentYear, currentMonth } = getCurrentYearAndMonth();

  const generateYearConclusions = useCallback((year, currentMonth, yearData, allYearsData) => {
    const month = currentMonth > 1 ? currentMonth - 1 : 12;
    const yearToAnalyze = month === 12 ? year - 1 : year;
    const currentYearData = yearData[yearToAnalyze] || {};
    
    const totalTurni = Object.values(currentYearData)
      .slice(0, month)
      .reduce((sum, monthData) => sum + (monthData.totaleTurni || 0), 0);
    
    const monthsWithData = Object.values(currentYearData)
      .slice(0, month)
      .filter(monthData => monthData && monthData.totaleTurni > 0).length;
    
    const averageMonthlyTurni = monthsWithData > 0 ? totalTurni / monthsWithData : 0;
  
    // Calcolo delle statistiche per gli anni precedenti
    const previousYearsData = Object.entries(allYearsData)
      .filter(([y]) => parseInt(y) < yearToAnalyze)
      .map(([year, data]) => {
        const yearTotal = Object.values(data)
          .slice(0, month)
          .reduce((sum, monthData) => sum + (monthData.totaleTurni || 0), 0);
        return { year: parseInt(year), totalTurni: yearTotal };
      });
  
    const avgPreviousYears = previousYearsData.reduce((sum, y) => sum + y.totalTurni, 0) / previousYearsData.length;
    
    // Analisi del trend
    const trend = monthsWithData >= 3 ? 
      (currentYearData[month - 1].totaleTurni > currentYearData[month - 3].totaleTurni ? "crescente" : 
       currentYearData[month - 1].totaleTurni < currentYearData[month - 3].totaleTurni ? "decrescente" : "stabile") :
      "non determinabile";
  
    // Composizione dell'analisi
    let analysis = `Analisi dettagliata dell'anno ${yearToAnalyze} (fino a ${getMonthName(month)}):\n\n`;
    
    analysis += `Nel periodo analizzato, sono stati effettuati un totale di ${formatNumber(totalTurni)} turni, `;
    analysis += `con una media mensile di ${formatNumber(averageMonthlyTurni)} turni. `;
    
    if (totalTurni > avgPreviousYears) {
      analysis += `Questo rappresenta un aumento del ${formatNumber(((totalTurni / avgPreviousYears) - 1) * 100)}% `;
      analysis += `rispetto alla media degli anni precedenti nello stesso periodo. `;
    } else if (totalTurni < avgPreviousYears) {
      analysis += `Questo rappresenta una diminuzione del ${formatNumber(((avgPreviousYears / totalTurni) - 1) * 100)}% `;
      analysis += `rispetto alla media degli anni precedenti nello stesso periodo. `;
    } else {
      analysis += `Questo è in linea con la media degli anni precedenti nello stesso periodo. `;
    }
  
    analysis += `\n\nIl trend degli ultimi tre mesi è ${trend}. `;
  
    if (trend === "crescente") {
      analysis += `Questo potrebbe indicare un aumento della domanda o un'espansione delle attività dello studio. `;
    } else if (trend === "decrescente") {
      analysis += `Questo potrebbe suggerire una riduzione della domanda o possibili sfide operative. `;
    }
  
    analysis += `\n\nConfrontando con gli anni precedenti:\n`;
    previousYearsData.forEach(({ year, totalTurni: prevYearTotal }) => {
      const diff = totalTurni - prevYearTotal;
      const percentDiff = (diff / prevYearTotal) * 100;
      analysis += `- ${year}: ${diff > 0 ? 'aumento' : 'diminuzione'} del ${formatNumber(Math.abs(percentDiff))}%\n`;
    });
  
    analysis += `\nQuesti dati suggeriscono che `;
    if (totalTurni > avgPreviousYears) {
      analysis += `l'anno ${yearToAnalyze} sta mostrando una performance superiore alla media storica. `;
      analysis += `Potrebbe essere opportuno valutare se le risorse attuali sono sufficienti per gestire questo aumento di attività. `;
    } else if (totalTurni < avgPreviousYears) {
      analysis += `l'anno ${yearToAnalyze} sta mostrando una performance inferiore alla media storica. `;
      analysis += `Potrebbe essere utile analizzare le cause di questa diminuzione e considerare strategie per stimolare la domanda. `;
    } else {
      analysis += `l'anno ${yearToAnalyze} sta mantenendo una performance in linea con la media storica. `;
      analysis += `Questo suggerisce una stabilità nelle operazioni dello studio. `;
    }
  
    analysis += `\n\nRaccomandazioni:
    1. Monitorare attentamente il trend nei prossimi mesi per adattare le risorse in modo proattivo.
    2. Considerare un'analisi più approfondita dei fattori che influenzano la domanda di turni.
    3. Valutare l'efficienza operativa e considerare eventuali ottimizzazioni dei processi.`;
  
    return analysis;
  }, []);

  const makePrediction = useCallback((year, month, allYearsData) => {
    let analysis = '';
    const futurePredictions = [];
    let totalEffectiveTurni = 0;
    let totalPredictedTurni = 0;
  
    // Calcolo dei turni effettivi e previsti per l'anno corrente
    for (let i = 0; i < 12; i++) {
      const monthData = allYearsData[year][i];
      if (i < month - 1) {
        // Turni effettivi per i mesi passati
        totalEffectiveTurni += monthData ? monthData.totaleTurni : 0;
      } else {
        // Previsione per i mesi rimanenti
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
  
    // Calcolo del totale complessivo
    const totalComplessivo = totalEffectiveTurni + totalPredictedTurni;
  
    // Creazione della classifica di produttività
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
  
    // Composizione dell'analisi
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
  
    // Aggiungi un commento sulla posizione dell'anno corrente nella classifica
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
            // Dati reali per i mesi passati
            monthData[year] = yearData && yearData[month] ? Math.round(yearData[month].totaleTurni) : 0;
            monthData[`${year}IsPrediction`] = false;
          } else {
            // Previsione per il mese corrente e i mesi futuri
            monthData[year] = calculateAverageForMonth(month);
            monthData[`${year}IsPrediction`] = true;
          }
        } else {
          // Dati degli anni passati
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

      setYearConclusions(generateYearConclusions(currentYear, currentMonth, yearsData, yearsData));
      setPrediction(makePrediction(currentYear, currentMonth, yearsData));
    };

    fetchData();
  }, [currentYear, currentMonth, availableYears, generateYearConclusions, makePrediction]);

  const chartData = useMemo(() => formatChartData(), [formatChartData]);

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
            {/* Linea per i dati reali dell'anno corrente */}
            <Line
              type="monotone"
              dataKey={(dataPoint) => dataPoint[`${year}IsPrediction`] ? undefined : dataPoint[year]}
              stroke={colorPalette[index]}
              strokeWidth={3}
              dot={false}
              connectNulls={true}
            />
            {/* Linea tratteggiata per i dati previsionali dell'anno corrente */}
            <Line
              type="monotone"
              dataKey={(dataPoint) => {
                if (dataPoint[`${year}IsPrediction`]) {
                  return dataPoint[year];
                }
                // Restituisce il valore dell'ultimo mese reale per connettere le linee
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
          <AnalysisTitle>Conclusioni sull'anno in corso</AnalysisTitle>
          <AnalysisText>{yearConclusions}</AnalysisText>
        </AnalysisSection>
        <AnalysisSection>
          <AnalysisTitle>Previsione per i prossimi mesi</AnalysisTitle>
          <AnalysisText>{prediction}</AnalysisText>
        </AnalysisSection>
        <BackButton onClick={() => setView('main')}>Torna alla Dashboard</BackButton>
      </ViewContent>
    </ViewContainer>
  );
};

export default PerformanceTrendView;