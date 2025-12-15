import React, { useState } from 'react';
import { bookApi } from '../services/api';
import '../styles/components.css';

const MaxBorrowPeriod = () => {
  const [bookTitle, setBookTitle] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!bookTitle.trim()) {
      setError('Будь ласка, введіть назву книги');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await bookApi.getMaxBorrowPeriod(bookTitle);
      setResult(response?.[0] || 'Не знайдено результатів');
    } catch (err) {
      console.error('Error fetching max period:', err);
      setError('Не вдалося отримати інформацію про максимальну видачу');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="card" style={styles.card}>
      <h2 style={styles.title}>Найдовша видача книги</h2>
      
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          className="input"
          placeholder="Введіть назву книги..."
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !bookTitle.trim()}
          style={styles.button}
        >
          {loading ? 'Пошук...' : 'Знайти'}
        </button>
      </form>

      {error && (
        <div className="alert alert-error" style={styles.alert}>
          {error}
        </div>
      )}

      {loading && (
        <div style={styles.loadingContainer}>
          <div className="loading-spinner"></div>
          <p>Пошук найдовшої видачі для "{bookTitle}"...</p>
        </div>
      )}

      {result && !loading && (
        <div style={styles.resultContainer}>
          <div style={styles.resultHeader}>
            <span style={styles.resultIcon}></span>
            <span style={styles.resultTitle}>Результат:</span>
          </div>
          <div style={styles.resultText}>
            {result}
          </div>
        </div>
      )}

      {!result && !error && !loading && (
        <div style={styles.placeholder}>
          <div style={styles.placeholderIcon}></div>
          <p>Введіть назву книги та натисніть "Знайти"</p>
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
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
  },
  button: {
    whiteSpace: 'nowrap',
    padding: '10px 20px',
  },
  alert: {
    marginBottom: '20px',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '20px',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  resultIcon: {
    fontSize: '1.5rem',
  },
  resultTitle: {
    fontSize: '1.1rem',
    color: '#15803d',
    fontWeight: '600',
  },
  resultText: {
    color: '#15803d',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },
  placeholder: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '20px',
  },
  placeholderIcon: {
    fontSize: '2.5rem',
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

export default MaxBorrowPeriod;