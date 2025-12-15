import React, { useState, useEffect } from 'react';
import { readerApi } from '../services/api';
import '../styles/components.css';

const ReaderBorrowsTable = ({ readerId }) => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (readerId && readerId > 0) {
      fetchBorrows();
    } else {
      setBorrows([]);
      setLoading(false);
      setError('');
    }
  }, [readerId]);

  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const response = await readerApi.getReaderBorrows(readerId);
      setBorrows(response || []);
      setError('');
    } catch (err) {
      console.error('Error fetching reader borrows:', err);
      setError('Не вдалося завантажити історію позичень читача');
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не повернена';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
  };

  const calculateDays = (borrowDate, returnDate) => {
    if (!returnDate) return 'Активна';
    const start = new Date(borrowDate);
    const end = new Date(returnDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} днів`;
  };

  if (!readerId || readerId <= 0) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Позичені книги</h2>
        <div style={styles.placeholder}>
          <p>Введіть ID читача для перегляду позичених книг</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Позичені книги</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Позичені книги</h2>
        <div className="alert alert-error">
          {error}
          <button onClick={fetchBorrows} style={styles.retryButton}>
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Позичені книги</h2>
        <div style={styles.stats}>
          <span style={styles.statItem}>Всього: {borrows.length}</span>
          <span style={styles.statItem}>
            Активних: {borrows.filter(b => !b.returnDate).length}
          </span>
        </div>
      </div>

      {borrows.length > 0 ? (
        <div className="table-container" style={styles.tableContainer}>
          <table className="table">
            <thead>
              <tr>
                <th>ID позичення</th>
                <th>Книга</th>
                <th>Дата позичення</th>
                <th>Дата повернення</th>
                <th style={{ textAlign: 'center' }}>Тривалість</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow.borrowId}>
                  <td style={styles.cellId}>{borrow.borrowId}</td>
                  <td>
                    <div style={styles.bookInfo}>
                      <div style={styles.bookTitle}>{borrow.bookTitle}</div>
                      <div style={styles.bookId}>ID: {borrow.bookId}</div>
                    </div>
                  </td>
                  <td>{formatDate(borrow.borrowDate)}</td>
                  <td>{formatDate(borrow.returnDate)}</td>
                  <td style={{ textAlign: 'center' }}>
                    {calculateDays(borrow.borrowDate, borrow.returnDate)}
                  </td>
                  <td>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: borrow.returnDate ? '#10b981' : '#3b82f6'
                    }}>
                      {borrow.returnDate ? 'Повернена' : 'Активна'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>Читач ще не позичав книг</p>
          <p style={styles.emptyHint}>Історія позичень відсутня</p>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    color: '#1e293b',
    fontSize: '1.25rem',
  },
  stats: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.875rem',
    color: '#64748b',
  },
  statItem: {
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  tableContainer: {
    flex: 1,
  },
  cellId: {
    fontWeight: '600',
    color: '#475569',
  },
  bookInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  bookTitle: {
    fontWeight: '500',
    color: '#1e293b',
  },
  bookId: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    minWidth: '80px',
    textAlign: 'center',
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
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
    opacity: 0.5,
  },
  emptyHint: {
    fontSize: '0.875rem',
    color: '#cbd5e1',
    marginTop: '5px',
  },
};

export default ReaderBorrowsTable;