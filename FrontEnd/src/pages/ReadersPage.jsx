import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import ReaderFullInfo from '../components/ReaderFullInfo';
import ReaderBorrowsTable from '../components/ReaderBorrowsTable';
import UpdateReaderInfo from '../components/UpdateReaderInfo';
import ReaderEmails from '../components/ReaderEmails';
import '../styles/components.css';

const ReadersPage = () => {
  useNavigate();
  const [readerId, setReaderId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchedReader, setSearchedReader] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const id = parseInt(searchInput);
      if (!isNaN(id) && id > 0) {
        setLoadingSearch(true);
        setReaderId(id);
        setSearchedReader(id);
        setLoadingSearch(false);
      } else {
        alert('Будь ласка, введіть коректний ID читача (число більше 0)');
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
              <h1 style={styles.pageTitle}>Детальна інформація про читачів</h1>
            </div>
            <p style={styles.pageSubtitle}>
              Перегляд повної інформації, історії позичень та керування читачами
            </p>
          </div>

          <div className="card" style={styles.searchCard}>
            <h3 style={styles.searchTitle}> Введіть ID читача для пошуку</h3>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input
                type="number"
                className="input"
                placeholder="ID читача (наприклад: 1, 2, 3...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                min="1"
                style={styles.searchInput}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={styles.searchButton}
                disabled={loadingSearch}
              >
                {loadingSearch ? 'Пошук...' : 'Пошук'}
              </button>
            </form>
            {searchedReader && (
              <div style={styles.currentSearch}>
                <span style={styles.currentSearchLabel}>Переглядаємо читача з ID:</span>
                <span style={styles.currentSearchValue}>{searchedReader}</span>
              </div>
            )}
          </div>
          <div style={styles.layout}>
            <div style={styles.leftColumn}>
              <div style={styles.leftTop}>
                <ReaderFullInfo readerId={readerId} />
              </div>
              <div style={styles.leftBottom}>
                <ReaderBorrowsTable readerId={readerId} />
              </div>
            </div>
            <div style={styles.rightColumn}>
              <div style={styles.rightTop}>
                <UpdateReaderInfo readerId={readerId} />
              </div>
              <div style={styles.rightMiddle}>
                <ReaderEmails />
              </div>
              <div style={styles.rightBottom}>
                <div className="card" style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <div style={{fontSize: '3rem', opacity: 0.5}}></div>
                  
                </div>
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
    gap: '15px',
    marginBottom: '10px',
    flexWrap: 'wrap',
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
    whiteSpace: 'nowrap',
  },
  booksButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
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
    flexWrap: 'wrap',
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
    minHeight: '800px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  leftTop: {
    flex: 5, 
    marginBottom: '20px',
  },
  leftBottom: {
    flex: 5, 
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  rightTop: {
    flex: 3, 
    marginBottom: '20px',
  },
  rightMiddle: {
    flex: 7, 
  },
  rightBottom: {
    display: 'none', 
  },
};


export default ReadersPage;