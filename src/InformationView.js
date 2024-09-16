import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

const InformationView = ({ setView }) => {
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
          marginBottom: '32px',
          color: '#1F2937',
        }}>
          Informazioni
        </h1>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#374151',
          }}>
            Informazioni sull'Applicazione
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#4B5563',
            marginBottom: '16px',
          }}>
            Questa applicazione è stata sviluppata per fornire statistiche e analisi dei turni per lo Studio Pumaisdue.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#4B5563',
            marginBottom: '16px',
          }}>
            Versione: 1.0.0
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#4B5563',
            marginBottom: '16px',
          }}>
            Sviluppato e creato da Marco Augusto Comba.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#4B5563',
            marginBottom: '16px',
          }}>
            Email: marco.comba.mc@gmail.com
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#4B5563',
            marginBottom: '16px',
          }}>
            Supporto: Per domande, suggerimenti o supporto tecnico, contatta l'indirizzo email sopra riportato.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#4B5563',
            marginBottom: '16px',
          }}>
            Legal Information: Questo tool è proprietà intellettuale di Marco Augusto Comba. Tutti i diritti sono riservati. Il software è concesso in licenza d'uso a Pumaisdue s.r.l. esclusivamente per il periodo in cui il developer è in servizio presso la società.
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginTop: '24px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#374151',
          }}>
            Come Utilizzare l'Applicazione
          </h2>
          <ul style={{
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#4B5563',
            paddingLeft: '20px',
          }}>
            <li style={{ marginBottom: '8px' }}>Ultimo Mese: Visualizza le statistiche del mese più recente.</li>
            <li style={{ marginBottom: '8px' }}>Ultimo Anno: Mostra un riepilogo dell'ultimo anno di attività.</li>
            <li style={{ marginBottom: '8px' }}>Confronta Mesi: Permette di confrontare le statistiche di due mesi diversi.</li>
            <li style={{ marginBottom: '8px' }}>Confronta Anni: Offre un confronto tra due anni selezionati.</li>
            <li>Inserisci Dati: Consente l'inserimento di nuovi dati nel sistema.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InformationView;