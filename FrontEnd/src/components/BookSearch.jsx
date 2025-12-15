import React, { useState } from 'react';
import { bookApi } from '../services/api';
import '../styles/components.css';

const BookSearch = () => {
  const [bookId, setBookId] = useState('');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!bookId.trim()) {
      setError('Будь ласка, введіть ID книги');
      return;
    }
    setLoading(true);
    setError('');
    setBook(null);

    try {
      const response = await bookApi.getBookById(bookId);
      setBook(response);
    } catch (err) {
      setError('Книгу не знайдено');
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

  const getConditionColor = (percent) => {
    if (percent > 70) return '#10b981';
    if (percent > 30) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="card" style={styles.card}>
      <h2 style={styles.title}>Пошук книги за ID</h2>
      
      <div style={styles.searchContainer}>
        <input
          type="number"
          className="input"
          placeholder="Введіть ID книги..."
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
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

      {book ? (
        <div style={styles.bookInfo}>
          <div style={styles.bookHeader}>
            <h3 style={styles.bookTitle}>{book.title}</h3>
            <div style={{
              ...styles.conditionBadge,
              backgroundColor: getConditionColor(book.conditionPercent)
            }}>
              {book.conditionPercent}%
            </div>
          </div>
          
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>ID книги:</span>
              <span style={styles.detailValue}>{book.bookId}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Автор:</span>
              <span style={styles.detailValue}>{book.authorName || 'Невідомо'}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>ID автора:</span>
              <span style={styles.detailValue}>{book.authorId}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Рік видання:</span>
              <span style={styles.detailValue}>{book.yearPublished || 'Не вказано'}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Жанр:</span>
              <span style={styles.detailValue}>{book.genre || 'Не вказано'}</span>
            </div>
            
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Кількість сторінок:</span>
              <span style={styles.detailValue}>{book.pages || 'Не вказано'}</span>
            </div>
          </div>
        </div>
      ) : (
        !error && !loading && (
          <div style={styles.placeholder}>
            <p>Введіть ID книги для пошуку</p>
          </div>
        )
      )}

      {loading && (
        <div style={styles.loadingContainer}>
          <div className="loading-spinner"></div>
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
  bookInfo: {
    flex: 1,
  },
  bookHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e2e8f0',
  },
  bookTitle: {
    color: '#1e293b',
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0,
    flex: 1,
  },
  conditionBadge: {
    padding: '6px 12px',
    borderRadius: '16px',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '600',
    minWidth: '60px',
    textAlign: 'center',
    marginLeft: '15px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  detailItem: {
    backgroundColor: '#f8fafc',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  detailLabel: {
    display: 'block',
    fontSize: '0.875rem',
    color: '#64748b',
    marginBottom: '5px',
    fontWeight: '500',
  },
  detailValue: {
    display: 'block',
    fontSize: '1rem',
    color: '#1e293b',
    fontWeight: '600',
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

export default BookSearch;