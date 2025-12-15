import React, { useState, useEffect } from 'react';
import { readerApi } from '../services/api';
import '../styles/components.css';

const ReaderFullInfo = ({ readerId }) => {
  const [fullInfo, setFullInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (readerId && readerId > 0) {
      fetchFullInfo();
    } else {
      setFullInfo(null);
      setLoading(false);
      setError('');
    }
  }, [readerId]);

  const fetchFullInfo = async () => {
    try {
      setLoading(true);


      const response = await readerApi.getReaderFullInfo(readerId);
      setFullInfo(response);
      setError('');
    } catch (err) {
      console.error('Error fetching full info:', err);
      setError('Не вдалося завантажити повну інформацію про читача');
      setFullInfo(null);
    } finally {
      setLoading(false);
    }
  };

  if (!readerId || readerId <= 0) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Повна інформація про читача</h2>
        <div style={styles.placeholder}>
          <div style={styles.placeholderIcon}></div>
          <p>Введіть ID читача у форму пошуку</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Повна інформація про читача</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p style={styles.loadingText}>Завантаження...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Повна інформація про читача</h2>
        <div className="alert alert-error">
          {error}
          <button onClick={fetchFullInfo} style={styles.retryButton}>
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  if (!fullInfo || !fullInfo.reader) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Повна інформація про читача</h2>
        <div style={styles.notFound}>
          <p>Читача не знайдено</p>
          <p style={styles.notFoundHint}>Введіть коректний ID читача</p>
        </div>
      </div>
    );
  }

  const { reader, statistics } = fullInfo;

  return (
    <div className="card" style={styles.card}>
      <h2 style={styles.title}>Повна інформація про читача</h2>
      <div style={styles.readerSection}>
        <div style={styles.readerHeader}>
          <h3 style={styles.readerName}>{reader.readerName}</h3>
          <div style={styles.booksBadge}>
            {reader.booksRead} книг
          </div>
        </div>
        
        <div style={styles.readerDetails}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>ID читача:</span>
            <span style={styles.detailValue}>{reader.readerId}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Email:</span>
            <span style={styles.detailValue}>{reader.readerEmail || 'Не вказано'}</span>
          </div>
          
          <div style={styles.detailRow}>
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
      
      {statistics && (
        <div style={styles.statsSection}>
          <h4 style={styles.statsTitle}>Статистика читача</h4>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Всього позичень:</span>
              <span style={styles.statValue}>{statistics.totalBorrows || 0}</span>
            </div>
            
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Активних позичень:</span>
              <span style={styles.statValue}>{statistics.activeBorrows || 0}</span>
            </div>
            
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Середня тривалість:</span>
              <span style={styles.statValue}>
                {statistics.averageBorrowDays ? statistics.averageBorrowDays.toFixed(1) : 0} днів
              </span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Прочитано книг:</span>
              <span style={styles.statValue}>{reader.booksRead || 0}</span>
            </div>
          </div>
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
    marginBottom: '25px',
    color: '#1e293b',
    fontSize: '1.5rem',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '10px',
  },
  loadingText: {
    marginTop: '15px',
    color: '#64748b',
  },
  retryButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
  notFound: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '40px 20px',
  },
  notFoundIcon: {
    fontSize: '4rem',
    marginBottom: '15px',
    opacity: 0.5,
  },
  notFoundHint: {
    fontSize: '0.875rem',
    color: '#cbd5e1',
    marginTop: '5px',
  },
  readerSection: {
    marginBottom: '30px',
  },
  readerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  readerName: {
    color: '#1e293b',
    fontSize: '1.75rem',
    fontWeight: '600',
    margin: 0,
    flex: 1,
  },
  booksBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    minWidth: '90px',
    textAlign: 'center',
    marginLeft: '15px',
  },
  readerDetails: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  detailLabel: {
    fontSize: '0.95rem',
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '1.05rem',
    color: '#1e293b',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '20px',
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
  statsSection: {
    marginTop: 'auto',
  },
  statsTitle: {
    fontSize: '1.2rem',
    color: '#1e293b',
    marginBottom: '15px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  statItem: {
    backgroundColor: '#f1f5f9',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statLabel: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#64748b',
    marginBottom: '5px',
  },
  statValue: {
    display: 'block',
    fontSize: '1.5rem',
    color: '#3b82f6',
    fontWeight: '700',
  },
};

export default ReaderFullInfo;