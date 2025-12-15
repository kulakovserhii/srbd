import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import BookFullInfo from '../components/BookFullInfo';
import BookBorrowsTable from '../components/BookBorrowsTable';
import MaxBorrowPeriod from '../components/MaxBorrowPeriod';
import '../styles/components.css';

const BooksPage = () => {
  useNavigate();
  const [bookId, setBookId] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchedBook, setSearchedBook] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const id = parseInt(searchInput);
      if (!isNaN(id) && id > 0) {
        setBookId(id);
        setSearchedBook(id);
        setBookTitle('');
      } 
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <main style={styles.main}>
        <div className="container">
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <h1 style={styles.pageTitle}>Детальна інформація про книгу</h1>
            </div>
            <p style={styles.pageSubtitle}>
              Перегляд повної інформації, історії позичень та статистики
            </p>
          </div>
          <div className="card" style={styles.searchCard}>
            <h3 style={styles.searchTitle}>Введіть ID книги для пошуку</h3>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input
                type="number"
                className="input"
                placeholder="ID книги (наприклад: 1, 2, 3...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                min="1"
                style={styles.searchInput}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={styles.searchButton}
              >
                Пошук
              </button>
            </form>
          </div>
          <div style={styles.layout}>
            <div style={styles.leftColumn}>
              <BookFullInfo bookId={bookId} />
            </div>
            <div style={styles.rightColumn}>
              <div style={styles.topSection}>
                <BookBorrowsTable bookId={bookId} />
              </div>
              <div style={styles.bottomSection}>
                <MaxBorrowPeriod bookTitle={bookTitle} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    padding: '30px 0',
    backgroundColor: '#f8fafc',
  },
  header: {
    marginBottom: '30px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '10px',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  },
  backButtonHover: {
    backgroundColor: '#e2e8f0',
  },
  pageTitle: {
    fontSize: '2.5rem',
    color: '#1e293b',
    margin: 0,
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    maxWidth: '600px',
  },
  searchCard: {
    marginBottom: '30px',
    padding: '25px',
  },
  searchTitle: {
    marginBottom: '15px',
    color: '#1e293b',
    fontSize: '1.25rem',
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  searchInput: {
    flex: 1,
  },
  searchButton: {
    padding: '10px 30px',
    fontSize: '1rem',
  },
  currentSearch: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 15px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
    border: '1px solid #bae6fd',
  },
  currentSearchLabel: {
    fontSize: '0.95rem',
    color: '#0369a1',
  },
  currentSearchValue: {
    fontSize: '1.1rem',
    color: '#0369a1',
    fontWeight: '700',
    backgroundColor: 'white',
    padding: '4px 12px',
    borderRadius: '4px',
    border: '1px solid #7dd3fc',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    minHeight: '600px',
  },
  leftColumn: {
    height: '100%',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  topSection: {
    flex: 8, 
    marginBottom: '20px',
  },
  bottomSection: {
    flex: 2,
  },
};


export default BooksPage;