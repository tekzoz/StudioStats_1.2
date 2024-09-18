import React from 'react';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Activity, List, Clock } from 'lucide-react';
import { getYearlyData } from './data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const monthNamesShort = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

const processYearlyData = (data) => {
  if (!data || Object.keys(data).length === 0) return null;
  
  const months = Object.keys(data);
  const lastAvailableMonth = Math.max(...months.map(Number));
  
  const totalTurni = months
    .filter(month => Number(month) <= lastAvailableMonth)
    .reduce((sum, month) => sum + (data[month]?.totaleTurni || 0), 0);
  
  const avgTurni = totalTurni / (lastAvailableMonth + 1);
  const avgDailyTurni = totalTurni / ((lastAvailableMonth + 1) * 22); // Assuming 22 working days per month

  const [monthWithMostTurni, monthWithLeastTurni] = months
    .filter(month => Number(month) <= lastAvailableMonth)
    .reduce(([max, min], month) => {
      const turni = data[month]?.totaleTurni || 0;
      return [
        turni > (data[max]?.totaleTurni || 0) ? month : max,
        (turni < (data[min]?.totaleTurni || 0) && turni > 0) ? month : min
      ];
    }, [months[0], months[0]]);

  return {
    totalTurni,
    avgTurni,
    avgDailyTurni,
    lastAvailableMonth,
    monthWithMostTurni: {
      month: parseInt(monthWithMostTurni) + 1,
      value: data[monthWithMostTurni]?.totaleTurni || 0
    },
    monthWithLeastTurni: {
      month: parseInt(monthWithLeastTurni) + 1,
      value: data[monthWithLeastTurni]?.totaleTurni || 0
    },
    data
  };
};

const calculateComparisons = (currentYear, currentData, previousYears, type) => {
  const comparisons = [];
  const currentValue = type === 'total' ? currentData.totalTurni : 
                       type === 'average' ? currentData.avgTurni :
                       currentData.avgDailyTurni;
  const lastMonth = currentData.lastAvailableMonth;

  for (let i = 1; i <= 3; i++) {
    const year = currentYear - i;
    const previousYearData = processYearlyData(getYearlyData(year));
    if (previousYearData) {
      const relevantMonths = Object.keys(previousYearData.data)
        .filter(month => Number(month) <= lastMonth);
      
      let previousValue;
      if (type === 'total') {
        previousValue = relevantMonths.reduce((sum, month) => sum + (previousYearData.data[month]?.totaleTurni || 0), 0);
      } else if (type === 'average') {
        const previousTotal = relevantMonths.reduce((sum, month) => sum + (previousYearData.data[month]?.totaleTurni || 0), 0);
        previousValue = previousTotal / (lastMonth + 1);
      } else { // 'daily average'
        const previousTotal = relevantMonths.reduce((sum, month) => sum + (previousYearData.data[month]?.totaleTurni || 0), 0);
        previousValue = previousTotal / ((lastMonth + 1) * 22);
      }
      
      const diff = currentValue - previousValue;
      const percentage = (diff / previousValue) * 100;
      const comparison = percentage > 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
      
      comparisons.push({
        year,
        comparison,
        previousValue: previousValue.toFixed(2),
        period: `Gen-${monthNames[lastMonth]}`
      });
    }
  }

  return comparisons;
};

const roundToHalf = (num) => {
  return Math.round(num * 2) / 2;
};

const StatCard = ({ icon, label, value, comparisons, backgroundColor }) => (
  <div style={{
    backgroundColor,
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 calc(50% - 10px)',
    marginBottom: '20px',
  }}
  role="region"
  aria-label={label}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      {React.cloneElement(icon, { size: 24, color: '#4B5563', 'aria-hidden': 'true' })}
      <span style={{ marginLeft: '12px', fontSize: '16px', fontWeight: '500', color: '#4B5563' }}>{label}</span>
    </div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>{value}</div>
    {comparisons && comparisons.map((comp, index) => (
      <div key={index} style={{ fontSize: '14px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          color: comp.comparison === 'N/A' ? 'gray' : (parseFloat(comp.comparison) > 0 ? 'green' : 'red'),
          fontWeight: 'bold' 
        }}>
          {comp.comparison} rispetto all'anno {comp.year} ({comp.period})
        </span>
        <span style={{ fontWeight: 'bold' }}>
          <b>{comp.previousValue}</b>
        </span>
      </div>
    ))}
  </div>
);

const YearlyChart = ({ data, averageTurni, lastAvailableMonth }) => {
  const chartData = Object.entries(data)
    .filter(([month]) => Number(month) <= lastAvailableMonth)
    .map(([month, { totaleTurni }]) => ({
      name: monthNamesShort[parseInt(month)],
      turniDoppiaggio: totaleTurni
    }));

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginBottom: '20px',
    }}>
      <h3 style={{ marginBottom: '20px', color: '#4B5563' }}>Andamento Annuale dei Turni di Doppiaggio</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="turniDoppiaggio" name="Turni di Doppiaggio" stroke="#8884d8" strokeWidth={2} />
          <ReferenceLine y={averageTurni} stroke="red" strokeDasharray="3 3">
            <Label value="Media Annuale" position="insideTopLeft" fill="red" />
          </ReferenceLine>
        </LineChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#4B5563' }}>
        Media Annuale: {averageTurni.toFixed(2)} turni
      </div>
    </div>
  );
};

const MonthlyListCard = ({ data, lastAvailableMonth }) => {
  const monthlyData = Object.entries(data)
    .filter(([month]) => Number(month) <= lastAvailableMonth)
    .map(([month, { totaleTurni }]) => ({ month: parseInt(month), totaleTurni }));

  const maxTurni = Math.max(...monthlyData.map(m => m.totaleTurni));
  const minTurni = Math.min(...monthlyData.map(m => m.totaleTurni));

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginBottom: '20px',
    }}
    role="region"
    aria-label="Lista Mensile dei Turni di Doppiaggio">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <List size={24} color='#4B5563' aria-hidden="true" />
        <span style={{ marginLeft: '12px', fontSize: '18px', fontWeight: '500', color: '#4B5563' }}>Lista Mensile dei Turni di Doppiaggio</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {monthlyData.map(({ month, totaleTurni }) => (
          <div key={month} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px', 
            borderBottom: '1px solid #E5E7EB', 
            paddingBottom: '8px',
            color: totaleTurni === maxTurni ? 'green' : totaleTurni === minTurni ? 'red' : 'inherit'
          }}>
            <span>{monthNames[month]}</span>
            <span style={{ fontWeight: 'bold' }}>{totaleTurni}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LastYearView = ({ setView, year = new Date().getFullYear() }) => {
  const yearlyData = getYearlyData(year);
  const processedData = processYearlyData(yearlyData);

  if (!processedData) {
    return (
      <div style={{
        backgroundColor: '#F0F9FF',
        minHeight: '100vh',
        padding: '24px',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1>Dati non disponibili</h1>
          <p>Ci scusiamo, ma i dati per l'anno {year} non sono disponibili al momento.</p>
          <button 
            onClick={() => setView('main')} 
            style={{
              background: '#4B5563',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px',
            }}
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalComparisons = calculateComparisons(year, processedData, [year-1, year-2, year-3], 'total');
  const avgComparisons = calculateComparisons(year, processedData, [year-1, year-2, year-3], 'average');
  const dailyAvgComparisons = calculateComparisons(year, processedData, [year-1, year-2, year-3], 'daily');

  const lastMonth = monthNames[processedData.lastAvailableMonth];

  const stats = [
    { 
      icon: <Calendar />, 
      label: `Totale Turni di Doppiaggio Annuali (fino al mese di ${lastMonth})`, 
      value: processedData.totalTurni,
      comparisons: totalComparisons,
      backgroundColor: '#E6F3FF'
    },
    { 
      icon: <Activity />, 
      label: 'Media Turni di Doppiaggio Mensile', 
      value: processedData.avgTurni.toFixed(1),
      comparisons: avgComparisons,
      backgroundColor: '#FFF0E6'
    },
    { 
      icon: <Clock />, 
      label: 'Media Turni di Doppiaggio Giornalieri', 
      value: roundToHalf(processedData.avgDailyTurni).toFixed(1),
      comparisons: dailyAvgComparisons,
      backgroundColor: '#F0FFF0'
    },
    { 
      icon: <TrendingUp />, 
      label: 'Mese con Più Turni di Doppiaggio', 
      value: `${processedData.monthWithMostTurni.value} (${monthNames[processedData.monthWithMostTurni.month - 1]})`,
      backgroundColor: '#FFF0F0'
    },
    { 
      icon: <TrendingDown />, 
      label: 'Mese con Meno Turni di Doppiaggio', 
      value: `${processedData.monthWithLeastTurni.value} (${monthNames[processedData.monthWithLeastTurni.month - 1]})`,
      backgroundColor: '#F0F0FF'
    },
  ];

  return (
    <div style={{
      backgroundColor: '#F0F9FF',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => setView('main')} 
          style={{
            background: '#4B5563',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            marginBottom: '24px',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4B5563'}
        >
          <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Torna alla Dashboard
        </button>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '4px',
          color: '#1F2937',
        }}>
          Statistiche Anno
        </h1>
        <h2 style={{
          fontSize: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '32px',
          color: '#4B5563',
        }}>
          {year}
        </h2>
        
        <YearlyChart 
          data={processedData.data} 
          averageTurni={processedData.avgTurni} 
          lastAvailableMonth={processedData.lastAvailableMonth}
        />
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        <MonthlyListCard 
          data={processedData.data} 
          lastAvailableMonth={processedData.lastAvailableMonth}
        />
      </div>
    </div>
  );
};

export default LastYearView;