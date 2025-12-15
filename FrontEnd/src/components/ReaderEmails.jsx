import React, { useState, useEffect } from 'react';
import { readerApi } from '../services/api';
import '../styles/components.css';

const ReaderEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [caseType, setCaseType] = useState('uppercase');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      let response;
      
      if (caseType === 'uppercase') {
        response = await readerApi.getUppercaseEmails();
      } else {
        response = await readerApi.getLowercaseEmails();
      }
      
      setEmails(response || []);
      setError('');
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Не вдалося завантажити список email');
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emails.length > 0) {
      fetchEmails();
    }
  }, [caseType]);

  const handleCaseToggle = () => {
    setCaseType(prev => prev === 'uppercase' ? 'lowercase' : 'uppercase');
  };

  if (loading) {
    return (
      <div className="card" style={styles.card}>
        <h2 style={styles.title}>Email читачів</h2>
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
        <h2 style={styles.title}>Email читачів</h2>
        <div className="alert alert-error">
          {error}
          <button onClick={fetchEmails} style={styles.retryButton}>
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Email читачів</h2>
        <button
          onClick={handleCaseToggle}
          style={styles.toggleButton}
          title={caseType === 'uppercase' ? 'Перейти до малих літер' : 'Перейти до великих літер'}
        >
          {caseType === 'uppercase' ? 'ВЕЛИКІ' : 'малі'} літери
        </button>
      </div>

      <div style={styles.infoSection}>
        <p style={styles.infoText}>
          {caseType === 'uppercase' 
            ? 'Email адреси у верхньому регістрі:'
            : 'Email адреси у нижньому регістрі:'}
        </p>
        
        <div style={styles.counter}>
          <span style={styles.counterLabel}>Всього email:</span>
          <span style={styles.counterValue}>{emails.length}</span>
        </div>
      </div>

      {emails.length > 0 ? (
        <div className="table-container" style={styles.emailsContainer}>
          <table className="table" style={styles.emailsTable}>
            <thead>
              <tr>
                <th>№</th>
                <th>Email адреса</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email, index) => (
                <tr key={index}>
                  <td style={styles.numberCell}>{index + 1}</td>
                  <td style={styles.emailCell}>
                    <div style={styles.emailContent}>
                      <span style={{
                        ...styles.emailText,
                        textTransform: caseType === 'uppercase' ? 'uppercase' : 'lowercase'
                      }}>
                        {email}
                      </span>
                      <span style={styles.emailDomain}>
                        @{email.split('@')[1]}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}></div>
          <p>Email адреси відсутні</p>
          <p style={styles.emptyHint}>Читачі не мають email</p>
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
  toggleButton: {
    padding: '6px 12px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  toggleButtonHover: {
    backgroundColor: '#e2e8f0',
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
  infoSection: {
    marginBottom: '20px',
  },
  infoText: {
    color: '#475569',
    marginBottom: '10px',
  },
  counter: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f1f5f9',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
  },
  counterLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  counterValue: {
    fontSize: '1.1rem',
    color: '#3b82f6',
    fontWeight: '700',
  },
  emailsContainer: {
    flex: 1,
  },
  emailsTable: {
    width: '100%',
  },
  numberCell: {
    width: '50px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#475569',
  },
  emailCell: {
    padding: '12px',
  },
  emailContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  emailText: {
    fontWeight: '500',
    color: '#1e293b',
    wordBreak: 'break-all',
  },
  emailDomain: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontStyle: 'italic',
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

export default ReaderEmails;