import React from 'react';

const MainView = ({ setView }) => {
  const cards = [
    { label: "Ultimo Mese", onClick: () => setView('lastMonth') },
    { label: "Ultimo Anno", onClick: () => setView('lastYear') },
    { label: "Confronta mesi", onClick: () => setView('compareMonths') },
    { label: "Confronta Anni", onClick: () => setView('compareYears') },
    { label: "Statistiche Fonici", onClick: () => setView('statisticheFonici') },
    { label: "Performance Trend", onClick: () => setView('performanceTrend') },
    { label: "Informazioni", onClick: () => setView('information') },
    { label: "Inserisci Dati", onClick: () => setView('dataInput') },
  ];

  return (
    <div>
      <h1>DASHBOARD</h1>
      {cards.map((card, index) => (
        <div key={index} onClick={card.onClick}>
          {card.label}
        </div>
      ))}
      <p>Version 1.2.2 - © 2024 Marco Augusto Comba</p>
    </div>
  );
};

export default MainView;