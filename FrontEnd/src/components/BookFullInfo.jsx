import React, { useState, useEffect } from 'react';
import { bookApi } from '../services/api';
import '../styles/components.css';

const BookFullInfo = ({ bookId }) => {
  const [fullInfo, setFullInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookId && bookId > 0) { 
      fetchFullInfo();
    } else {
      setFullInfo(null);
      setLoading(false);
      setError('');
    }
  }, [bookId]);

  const fetchFullInfo = async () => {
    try {
      setLoading(true);
      const response = await bookApi.getBookFullInfo(bookId);
      setFullInfo(response);
      setError('');
    } catch (err) {
      console.error('Error fetching full info:', err);
      setError('Не вдалося завантажити повну інформацію про книгу');
      setFullInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (percent) => {
    if (percent > 70) return '#10b981';
    if (percent > 30) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Повна інформація про книгу</h2>
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
        <h2 style={styles.title}>Повна інформація про книгу</h2>
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  if (!fullInfo || !fullInfo.book) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Повна інформація про книгу</h2>
        <div style={styles.notFound}>
          <p>Книга не знайдена</p>
        </div>
      </div>
    );
  }

  const { book, borrows } = fullInfo;

  return (
    <div className="card" style={styles.card}>
      <h2 style={styles.title}>Повна інформація про книгу</h2>
      <div style={styles.bookSection}>
        <div style={styles.bookHeader}>
          <h3 style={styles.bookTitle}>{book.title}</h3>
          <div style={{
            ...styles.conditionBadge,
            backgroundColor: getConditionColor(book.conditionPercent)
          }}>
            {book.conditionPercent}%
          </div>
        </div>
        
        <div style={styles.bookDetails}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>ID книги:</span>
            <span style={styles.detailValue}>{book.bookId}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Автор:</span>
            <span style={styles.detailValue}>{book.authorName || 'Невідомо'}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>ID автора:</span>
            <span style={styles.detailValue}>{book.authorId}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Рік видання:</span>
            <span style={styles.detailValue}>{book.yearPublished || 'Не вказано'}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Жанр:</span>
            <span style={styles.detailValue}>{book.genre || 'Не вказано'}</span>
          </div>
          
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Сторінок:</span>
            <span style={styles.detailValue}>{book.pages || 'Не вказано'}</span>
          </div>
        </div>
      </div>
      <div style={styles.statsSection}>
        <h4 style={styles.statsTitle}>Статистика позичень</h4>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Всього позичень:</span>
            <span style={styles.statValue}>{borrows?.length || 0}</span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Унікальних читачів:</span>
            <span style={styles.statValue}>
              {borrows ? new Set(borrows.map(b => b.readerId)).size : 0}
            </span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Активних позичень:</span>
            <span style={styles.statValue}>
              {borrows ? borrows.filter(b => !b.returnDate).length : 0}
            </span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Повернено:</span>
            <span style={styles.statValue}>
              {borrows ? borrows.filter(b => b.returnDate).length : 0}
            </span>
          </div>
        </div>
      </div>
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
  bookSection: {
    marginBottom: '30px',
  },
  bookHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  bookTitle: {
    color: '#1e293b',
    fontSize: '1.75rem',
    fontWeight: '600',
    margin: 0,
    flex: 1,
  },
  conditionBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    minWidth: '70px',
    textAlign: 'center',
    marginLeft: '15px',
  },
  bookDetails: {
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
  detailRowLast: {
    borderBottom: 'none',
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

export default BookFullInfo;