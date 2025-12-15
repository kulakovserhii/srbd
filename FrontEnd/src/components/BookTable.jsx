import React, { useState, useEffect } from 'react';
import { bookApi } from '../services/api';
import '../styles/components.css';

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookApi.getAllBooks();
      setBooks(response || []);
    } catch (err) {
      setError('Не вдалося завантажити список книг: ' + err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };
  const filteredBooks = Array.isArray(books) ? books.filter(book =>
    book && (
      (book.title || '').toLowerCase() ||
      (book.authorName || '').toLowerCase() ||
      (book.genre || '').toLowerCase().includes
    )
  ) : [];
  const indexOfLastBook = currentPage * rowsPerPage;
  const indexOfFirstBook = indexOfLastBook - rowsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / rowsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getConditionColor = (percent) => {
    if (percent > 70) return '#10b981';
    if (percent > 30) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Всі книги</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>Всі книги</h2>
        <div className="alert alert-error">
          {error}
          <button onClick={fetchBooks} style={{marginLeft: '10px'}}>
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={styles.header}>
        <h2 style={styles.title}>Всі книги</h2>
        <div style={styles.stats}>
          <span style={styles.statItem}>Всього: {filteredBooks.length}</span>
          <span style={styles.statItem}>Сторінка: {currentPage}/{totalPages}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Назва</th>
              <th>Автор</th>
              <th>Рік</th>
              <th style={{ textAlign: 'center' }}>Стан</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.length > 0 ? (
              currentBooks.map((book) => (
                <tr key={book.bookId}>
                  <td style={styles.cellId}>{book.bookId}</td>
                  <td>
                    <div style={styles.bookTitle}>{book.title}</div>
                    {book.genre && (
                      <div style={styles.genre}>{book.genre}</div>
                    )}
                  </td>
                  <td>{book.authorName || '-'}</td>
                  <td>{book.yearPublished || '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      ...styles.conditionBadge,
                      backgroundColor: getConditionColor(book.conditionPercent)
                    }}>
                      {book.conditionPercent}%
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

      {filteredBooks.length > rowsPerPage && (
        <div className="pagination">
          <div className="pagination-info">
            Показано {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} з {filteredBooks.length}
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
  bookTitle: {
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: '4px',
  },
  genre: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontStyle: 'italic',
  },
  conditionBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    minWidth: '50px',
  },
  emptyCell: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
    fontStyle: 'italic',
  },
};

export default BookTable;