import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      <div className="container">
        <div style={styles.navContent}>
          <div style={styles.logoSection} onClick={() => navigate('/')}>
            <h1 style={styles.logo}>WebLibrary</h1>
          </div>
          <div style={styles.navLinks}>
            <button 
              onClick={() => navigate('/')}
              style={styles.navButton}
            >
              Головна
            </button>
            <button 
              onClick={() => navigate('/books')}
              style={styles.navButton}
            >
              Книги
            </button>
            <button 
              onClick={() => navigate('/readers')}
              style={styles.navButton}
            >
              Читачі
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    cursor: 'pointer',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
  },
  navButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  navButtonHover: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
};

export default Navbar;