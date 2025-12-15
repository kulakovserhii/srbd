import React from 'react';
import Navbar from '../components/Layout/Navbar';
import BookTable from '../components/BookTable';
import ReaderTable from '../components/ReaderTable';
import BookSearch from '../components/BookSearch';
import ReaderSearch from '../components/ReaderSearch';

const HomePage = () => {
  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <div className="container">  
          <div style={styles.layout}>

            <div style={styles.leftColumn}>
              <div style={styles.tableSection}>
                <BookTable />
              </div>
              <div style={styles.tableSection}>
                <ReaderTable />
              </div>
            </div>
            <div style={styles.rightColumn}>
              <div style={styles.searchSection}>
                <BookSearch />
              </div>
              <div style={styles.searchSection}>
                <ReaderSearch />
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
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  pageTitle: {
    fontSize: '2.5rem',
    color: '#1e293b',
    marginBottom: '10px',
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  tableSection: {
    flex: 1,
  },
  searchSection: {
    flex: 1,
  },
};
export default HomePage;