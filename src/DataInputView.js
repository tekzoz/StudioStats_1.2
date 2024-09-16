import React from 'react';
import { ArrowLeft } from 'lucide-react';

const DataInputView = ({ setView }) => {
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
          Inserimento Dati
        </h1>
        
        <p style={{
          fontSize: '18px',
          textAlign: 'center',
          color: '#4B5563',
        }}>
          Funzionalità di inserimento dati in fase di sviluppo.
        </p>
      </div>
    </div>
  );
};

export default DataInputView;