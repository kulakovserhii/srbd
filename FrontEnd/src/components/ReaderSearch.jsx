import React, { useState } from 'react';
import { readerApi } from '../services/api';
import '../styles/components.css';

const ReaderSearch = () => {
  const [readerId, setReaderId] = useState('');
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!readerId.trim()) {
      setError('Будь ласка, введіть ID читача');
      return;
    }
    setLoading(true);
    setError('');
    setReader(null);

    try {
      const response = await readerApi.getReaderById(readerId);
      setReader(response);
    } catch (err) {
      setError('Читача не знайдено');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="card" style={styles.card}>
      <h2 style={styles.title}>Пошук читача за ID</h2>
      
      <div style={styles.searchContainer}>
        <input
          type="number"
          className="input"
          placeholder="Введіть ID читача..."
          value={readerId}
          onChange={(e) => setReaderId(e.target.value)}
          onKeyPress={handleKeyPress}
          min="1"
          style={styles.input}
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Пошук...' : 'Знайти'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={styles.alert}>
          {error}
        </div>
      )}

      {reader ? (
        <div style={styles.readerInfo}>
          <div style={styles.readerHeader}>
            <h3 style={styles.readerName}>{reader.readerName}</h3>
            <div style={styles.booksBadge}>
              {reader.booksRead} книг
            </div>
          </div>
          
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>ID читача:</span>
              <span style={styles.detailValue}>{reader.readerId}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Прочитано книг:</span>
              <span style={{
                ...styles.booksCount,
                color: reader.booksRead > 0 ? '#3b82f6' : '#64748b'
              }}>
                {reader.booksRead}
              </span>
            </div>
            
            <div style={styles.detailItemWide}>
              <span style={styles.detailLabel}>Email:</span>
              <span style={styles.detailValue}>{reader.readerEmail || 'Не вказано'}</span>
            </div>
            
            <div style={styles.detailItemWide}>
              <span style={styles.detailLabel}>Телефон:</span>
              <span style={styles.detailValue}>{reader.phoneNumber || 'Не вказано'}</span>
            </div>
            
            {reader.readerInfo && reader.readerInfo !== "Немає видач" && (
              <div style={styles.infoCard}>
                <div style={styles.infoHeader}>
                  <span style={styles.infoLabel}>Інформація про читача:</span>
                </div>
                <div style={styles.infoContent}>
                  {reader.readerInfo}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (

        !error && !loading && (
          <div style={styles.placeholder}>
            <p>Введіть ID читача для пошуку</p>
            <p style={styles.placeholderHint}>Наприклад: 1, 2, 3...</p>
          </div>
        )
      )}

      {loading && (
        <div style={styles.loadingContainer}>
          <div className="loading-spinner"></div>
          <p>Завантаження даних...</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: '20px',
    color: '#1e293b',
    fontSize: '1.25rem',
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
  },
  button: {
    whiteSpace: 'nowrap',
    padding: '8px 20px',
  },
  alert: {
    marginBottom: '20px',
  },
  readerInfo: {
    flex: 1,
  },
  readerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e2e8f0',
  },
  readerName: {
    color: '#1e293b',
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0,
    flex: 1,
  },
  booksBadge: {
    padding: '6px 12px',
    borderRadius: '16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '600',
    minWidth: '80px',
    textAlign: 'center',
    marginLeft: '15px',
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  detailItem: {
    backgroundColor: '#f8fafc',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItemWide: {
    backgroundColor: '#f8fafc',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  detailLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '1rem',
    color: '#1e293b',
    fontWeight: '600',
  },
  booksCount: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '10px',
  },
  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  infoIcon: {
    fontSize: '1.2rem',
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: '#0369a1',
    fontWeight: '600',
  },
  infoContent: {
    color: '#0369a1',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  placeholder: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '40px 20px',
  },
  placeholderIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
    opacity: 0.5,
  },
  placeholderHint: {
    fontSize: '0.875rem',
    color: '#cbd5e1',
    marginTop: '5px',
  },
  loadingContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
};

export default ReaderSearch;