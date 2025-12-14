using WebLibrary.Models;

namespace WebLibrary.Services
{
    public interface IDatabaseService
    {
        Task<List<T>> QueryAsync<T>(string sql, object? parameters = null);
        Task<T?> QuerySingleAsync<T>(string sql, object? parameters = null);
        Task<int> ExecuteAsync(string sql, object? parameters = null);
        Task<List<Book>> GetAllBooksWithAuthorsAsync();
        Task<Book?> GetBookWithDetailsAsync(int bookId);
        Task<List<Borrow>> GetBookBorrowsWithReaderAsync(int bookId);
        Task<Author?> GetAuthorWithBooksAsync(int authorId);
        Task<List<Reader>> GetAllReadersAsync();
        Task<List<Borrow>> GetReaderBorrowsAsync(int readerId);
        Task<int> GetBooksReadCountAsync(int readerId);
        Task<Reader?> GetReaderWithBorrowAsync(int readerId);
        Task<string> UpdateReaderInfoAsync(int readerId);
        Task<ReaderStatistics> GetReaderStatisticsAsync(int readerId);
        Task<List<string>> GetUpperCaseEmailsAsync();
        Task<List<string>> GetLowerCaseEmailsAsync();
        Task<List<string>> GetMaxBookBorrowPeriodAsync(string bookName);
    }
}
