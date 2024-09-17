import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { getFoniciData } from './data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Styled components
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
  max-width: 1200px;
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

const BackButton = styled.button`
  background: #4B5563;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #374151;
  }

  @media (min-width: 768px) {
    padding: 10px 20px;
    font-size: 16px;
    margin-bottom: 24px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 32px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #4B5563;
  margin-bottom: 12px;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

const ClassificaList = styled.ol`
  list-style-position: inside;
  padding: 0;
`;

const ClassificaItem = styled.li`
  font-size: 14px;
  margin-bottom: 6px;
  display: grid;
  grid-template-columns: 24px 1fr 70px 70px;
  align-items: center;

  &:nth-child(1) { font-weight: bold; color: #FFA500; }
  &:nth-child(2) { font-weight: bold; color: #A9A9A9; }
  &:nth-child(3) { font-weight: bold; color: #CD7F32; }

  @media (min-width: 768px) {
    font-size: 16px;
    margin-bottom: 8px;
    grid-template-columns: 30px 1fr 80px 80px;
  }
`;

const TurniSpan = styled.span`
  text-align: right;
`;

const DifferenzialeSpan = styled.span`
  font-size: 12px;
  color: #EF4444;
  text-align: right;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const IndicatorWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 4px;

  @media (min-width: 768px) {
    margin-right: 8px;
  }
`;

// Componenti
const Classifica = ({ data, title }) => (
  <Card>
    <CardTitle>{title}</CardTitle>
    <ClassificaList>
      {data.map((fonico, index) => {
        const differenziale = index > 0 ? data[0].turni - fonico.turni : null;
        const showDifferenziale = (title === "Utilizzo Ultimo Quadrimestre" || title === "Utilizzo Ultimo Anno") && index > 0;
        return (
          <ClassificaItem key={fonico.nome}>
            <span>{index + 1}.</span>
            <span>{fonico.nome}</span>
            <TurniSpan>{fonico.turni} turni</TurniSpan>
            {showDifferenziale && (
              <DifferenzialeSpan>-{differenziale}</DifferenzialeSpan>
            )}
            {!showDifferenziale && <span></span>}
          </ClassificaItem>
        );
      })}
    </ClassificaList>
  </Card>
);

const Chart = ({ data, title }) => (
  <Card style={{ height: '400px' }}>
    <CardTitle>{title}</CardTitle>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="nome" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="turni" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

const BilanciamentoSuggerito = ({ foniciData }) => {
  const calcolaBilanciamento = () => {
    const totaleAnnuo = foniciData.ultimoAnno.reduce((acc, f) => acc + f.turni, 0);
    const mediaIdeale = totaleAnnuo / foniciData.ultimoAnno.length;
    
    return foniciData.ultimoAnno.map(fonico => {
      const differenza = mediaIdeale - fonico.turni;
      return {
        nome: fonico.nome,
        turniAttuali: fonico.turni,
        turniSuggeriti: Math.round(mediaIdeale),
        variazione: Math.round(differenza)
      };
    }).sort((a, b) => Math.abs(b.variazione) - Math.abs(a.variazione));
  };

  const suggerimenti = calcolaBilanciamento();

  return (
    <Card>
      <CardTitle>Suggerimenti per Bilanciamento</CardTitle>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px' }}>Fonico</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Turni Attuali</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Turni Suggeriti</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Variazione</th>
            </tr>
          </thead>
          <tbody>
            {suggerimenti.map(s => (
              <tr key={s.nome}>
                <td style={{ padding: '8px' }}>
                  <IndicatorWrapper>
                    {s.variazione > 0 ? (
                      <ArrowUpCircle size={16} color="green" />
                    ) : (
                      <ArrowDownCircle size={16} color="red" />
                    )}
                  </IndicatorWrapper>
                  {s.nome}
                </td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{s.turniAttuali}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{s.turniSuggeriti}</td>
                <td style={{ textAlign: 'right', padding: '8px', color: s.variazione > 0 ? 'green' : 'red' }}>
                  {s.variazione > 0 ? '+' : ''}{s.variazione}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Componente principale
const StatisticheFonici = ({ setView }) => {
  const [foniciData, setFoniciData] = useState(null);

  useEffect(() => {
    const data = getFoniciData();
    setFoniciData(data);
  }, []);

  if (!foniciData) {
    return <div>Caricamento...</div>;
  }

  return (
    <Container>
      <Content>
        <BackButton onClick={() => setView('main')}>
          <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Torna alla Dashboard
        </BackButton>
        
        <Title>Statistiche Fonici</Title>

        <Grid>
          <Classifica data={foniciData.ultimoMese} title="Utilizzo Ultimo Mese" />
          <Classifica data={foniciData.ultimoQuadrimestre} title="Utilizzo Ultimo Quadrimestre" />
          <Classifica data={foniciData.ultimoAnno} title="Utilizzo Ultimo Anno" />
        </Grid>

        <Grid>
          <Chart data={foniciData.ultimoMese} title="Grafico Ultimo Mese" />
          <Chart data={foniciData.ultimoQuadrimestre} title="Grafico Ultimo Quadrimestre" />
          <Chart data={foniciData.ultimoAnno} title="Grafico Ultimo Anno" />
        </Grid>

        <BilanciamentoSuggerito foniciData={foniciData} />
      </Content>
    </Container>
  );
};

export default StatisticheFonici;