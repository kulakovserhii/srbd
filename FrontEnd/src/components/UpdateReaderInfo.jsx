import React, { useState } from 'react';
import { readerApi } from '../services/api';
import '../styles/components.css';

const UpdateReaderInfo = () => {
  const [readerIdInput, setReaderIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e?.preventDefault();
    
    const id = parseInt(readerIdInput);
    if (!id || id <= 0) {
      setError('Будь ласка, введіть коректний ID читача (число більше 0)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await readerApi.updateReaderInfo(id);
      setResult(response);
    } catch (err) {
      console.error('Error updating reader info:', err);
      setError(err.message || 'Не вдалося оновити інформацію про читача');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdate(e);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setReaderIdInput(value);
      setError('');
      setResult(null);
    }
  };

  return (
    <div className="card" style={styles.card}>
      <h2 style={styles.title}>Оновити інформацію про читача</h2>
      
      <form onSubmit={handleUpdate} style={styles.form}>
        <input
          type="text"
          className="input"
          placeholder="Введіть ID читача..."
          value={readerIdInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          style={styles.input}
          disabled={loading}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !readerIdInput.trim()}
          style={styles.button}
        >
          {loading ? 'Оновлення...' : 'Оновити'}
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
          <p>Оновлення інформації для читача з ID {readerIdInput}...</p>
        </div>
      )}

      {result && !loading && (
        <div style={{
          ...styles.resultContainer,
          backgroundColor: result.success ? '#f0fdf4' : '#fef2f2',
          borderColor: result.success ? '#bbf7d0' : '#fecaca',
        }}>
          <div style={styles.resultHeader}>
            <span style={{
              ...styles.resultTitle,
              color: result.success ? '#15803d' : '#dc2626'
            }}>
              {result.success ? 'Успішно' : 'Помилка'}
            </span>
          </div>
          
          <div style={styles.resultDetails}>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Статус:</span>
              <span style={{
                ...styles.resultValue,
                color: result.success ? '#15803d' : '#dc2626',
                fontWeight: '600'
              }}>
                {result.success ? 'Інформацію оновлено' : 'Не вдалося оновити'}
              </span>
            </div>
            
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>ID читача:</span>
              <span style={styles.resultValue}>{result.readerId}</span>
            </div>
            
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Повідомлення:</span>
              <span style={styles.resultValue}>{result.message}</span>
            </div>
          </div>
        </div>
      )}

      {!result && !error && !loading && (
        <div style={styles.placeholder}>
          <div style={styles.placeholderIcon}></div>
          <p>Введіть ID читача та натисніть "Оновити"</p>
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
  loadingContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    padding: '20px',
  },
  resultContainer: {
    flex: 1,
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid',
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
    fontWeight: '600',
  },
  resultDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },
  resultRowLast: {
    borderBottom: 'none',
  },
  resultLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: '0.95rem',
    color: '#1e293b',
    textAlign: 'right',
    maxWidth: '70%',
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
  placeholderDescription: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginTop: '15px',
    maxWidth: '300px',
    lineHeight: '1.4',
  },
};

export default UpdateReaderInfo;