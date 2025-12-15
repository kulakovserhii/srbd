// src/services/api.js
// src/services/api.js
const API_BASE_URL = "https://localhost:7194/api"; // ЗМІНІТЬ НА HTTPS
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  try {
    console.log(`Fetching: ${url}`); // Для відладки
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}

export const bookApi = {
  getAllBooks: () => fetchAPI('/Books'),
  getBookById: (id) => fetchAPI(`/Books/${id}`),
  getBookBorrows: (id) => fetchAPI(`/Books/${id}/borrows`),
  getBookFullInfo: (id) => fetchAPI(`/Books/${id}/full`),
  getMaxBorrowPeriod: (bookName) => fetchAPI(`/Books/max-borrow-beriod/${encodeURIComponent(bookName)}`),
};

export const readerApi = {
  getAllReaders: () => fetchAPI('/Readers'),
  getReaderById: (id) => fetchAPI(`/Readers/${id}`),
  getReaderBorrows: (id) => fetchAPI(`/Readers/${id}/borrows`),
  getReaderFullInfo: (id) => fetchAPI(`/Readers/${id}/full`),
  updateReaderInfo: (id) => {
  return fetchAPI(`/Readers?id=${id}`, {
    method: 'POST'
  });
},
  getUppercaseEmails: () => fetchAPI('/Readers/uppercase-emails'),
  getLowercaseEmails: () => fetchAPI('/Readers/lowercase-emails'),
};

// Тест з'єднання
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Books`);
    return response.ok;
  } catch  {
    return false;
  }
};