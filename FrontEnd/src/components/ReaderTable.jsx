import React, { useState, useEffect } from 'react';
import { readerApi } from '../services/api';
import '../styles/components.css';

const ReaderTable = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); 

  useEffect(() => {
    fetchReaders();
  }, []);

  const fetchReaders = async () => {
    try {
      setLoading(true);
      const response = await readerApi.getAllReaders();
      setReaders(response || []);
    } catch (err) {
      setError('Не вдалося завантажити список читачів: ' + err.message);
      setReaders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReaders = Array.isArray(readers) ? readers.filter(reader =>
    reader && (
      (reader.readerName || '').toLowerCase() ||
      (reader.readerEmail || '').toLowerCase() ||
      (reader.phoneNumber || '')
    )
  ) : [];

  const indexOfLastReader = currentPage * rowsPerPage;
  const indexOfFirstReader = indexOfLastReader - rowsPerPage;
  const currentReaders = filteredReaders.slice(indexOfFirstReader, indexOfLastReader);
  const totalPages = Math.ceil(filteredReaders.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  if (loading) {
    return (
      <div className="card">
        <h2>Всі читачі</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>Всі читачі</h2>
        <div className="alert alert-error">
          {error}
          <button onClick={fetchReaders} style={{marginLeft: '10px'}}>
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={styles.header}>
        <h2 style={styles.title}>Всі читачі</h2>
        <div style={styles.stats}>
          <span style={styles.statItem}>Всього: {filteredReaders.length}</span>
          <span style={styles.statItem}>Сторінка: {currentPage}/{totalPages}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ім'я</th>
              <th>Email</th>
              <th>Телефон</th>
              <th style={{ textAlign: 'center' }}>Прочитано</th>
            </tr>
          </thead>
          <tbody>
            {currentReaders.length > 0 ? (
              currentReaders.map((reader) => (
                <tr key={reader.readerId}>
                  <td style={styles.cellId}>{reader.readerId}</td>
                  <td>
                    <div style={styles.readerName}>{reader.readerName}</div>
                  </td>
                  <td>
                    <div style={styles.email}>{reader.readerEmail || '-'}</div>
                  </td>
                  <td>
                    <div style={styles.phone}>{reader.phoneNumber || '-'}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      ...styles.booksBadge,
                      backgroundColor: reader.booksRead > 0 ? '#3b82f6' : '#94a3b8'
                    }}>
                      {reader.booksRead}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
               
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredReaders.length > rowsPerPage && (
        <div className="pagination">
          <div className="pagination-info">
            Показано {indexOfFirstReader + 1}-{Math.min(indexOfLastReader, filteredReaders.length)} з {filteredReaders.length}
          </div>
          
          <div className="pagination-buttons">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  title: {
    margin: 0,
    color: '#1e293b',
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
  searchContainer: {
    marginBottom: '15px',
  },
  searchInput: {
    width: '100%',
  },
  cellId: {
    fontWeight: '600',
    color: '#475569',
  },
  readerName: {
    fontWeight: '500',
    color: '#1e293b',
  },
  email: {
    fontSize: '0.875rem',
    color: '#475569',
  },
  phone: {
    fontSize: '0.875rem',
    color: '#475569',
  },
  booksBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '600',
    minWidth: '40px',
  },
  emptyCell: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
    fontStyle: 'italic',
  },
};

export default ReaderTable;