using Microsoft.Data.SqlClient;
using WebLibrary.Models;

namespace WebLibrary.Services
{
    public class DatabaseService : IDatabaseService
    {
        private readonly string _connectionString;
        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("LibraryDb") ??
                throw new ArgumentNullException("Wrong string");
        }
        public async Task<int> ExecuteAsync(string sql, object? parameters = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(sql, connection))
                {
                    AddParameters(command, parameters);
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }
        public async Task<List<Book>> GetAllBooksWithAuthorsAsync()
        {
            var sql = @"
                SELECT 
                    b.Book_id AS BookId,
                    b.Title,
                    b.Author_id AS AuthorId,
                    b.Year_published AS YearPublished,
                    b.Pages,
                    b.Genre,
                    b.Condition_percent AS ConditionPercent,
                    a.Author_name AS AuthorName
                FROM Books b
                LEFT JOIN Authors a ON b.Author_id = a.Author_id
            ORDER BY b.Title
            ";
            return await QueryAsync<Book>(sql);
        }
        public async Task<List<Reader>> GetAllReadersAsync()
        {
            var sql = @"
                SELECT 
                    r.Reader_id AS ReaderId,
                    r.Reader_name AS ReaderName,
                    r.Phone_number AS PhoneNumber,
                    r.Email AS ReaderEmail,
                    r.ReaderInfo,
                    ISNULL(b.ReturnedBooks, 0) AS BooksRead
                FROM Readers r
                LEFT JOIN (
                    SELECT 
                        Reader_id,
                        COUNT(*) as ReturnedBooks
                    FROM Borrows 
                    WHERE Return_date IS NOT NULL
                    GROUP BY Reader_id
                ) b ON r.Reader_id = b.Reader_id
                ORDER BY r.Reader_name";

            return await QueryAsync<Reader>(sql);
        }
        public async Task<Author?> GetAuthorWithBooksAsync(int authorId)
        {
            var authorSql = @"
                SELECT
                    Author_id AS AuthorId,
                    Author_name AS AuthorName,
                    Bitrh_year AS BirthYear
                    FROM Authors
                    WHERE Author_id = @AuthorId;
            ";
            var author = await QuerySingleAsync<Author>(authorSql, new { AuthorId = authorId });
            if (author == null)
                return null;
            var booksSql = @"
                SELECT 
                    Book_id AS BookId,
                    Title,
                    Year_published AS YearPublished,
                    Pages,
                    Genre,
                    Condition_percent AS ConditionPercent,
                    Author_if AS AuthorId
                FROM Books
                WHERE Author_id = @AuthorId
                ORDER BY Title
            ";
            var books =  await QueryAsync<Book>(booksSql, new { AuthorId = authorId });
            author.BooksCount = books.Count;
            return author;
        }
        public async Task<List<Borrow>> GetBookBorrowsWithReaderAsync(int bookId)
        {
            var sql = @"
                SELECT 
                    br.Borrow_id AS BorrowId,
                    br.Book_id AS BookId,
                    br.Reader_id AS ReaderId,
                    br.Borrow_date AS BorrowDate,
                    br.Return_date AS ReturnDate,
                    b.Title AS BookTitle,
                    r.Reader_name AS ReaderName,
                    r.Phone_number AS PhoneNumber,
                    r.Email AS ReaderEmail
                FROM Borrows br
                LEFT JOIN Books b ON br.Book_id = b.Book_id
                LEFT JOIN Readers r ON br.Reader_id = r.Reader_id
                WHERE br.Book_id = @BookId
                ORDER BY br.Borrow_date DESC
            ";
            return await QueryAsync<Borrow>(sql, new { BookId = bookId });
        }
        public async Task<int> GetBooksReadCountAsync(int readerId)
        {
            var sql = @"
                SELECT COUNT(*) 
                FROM Borrows 
                WHERE Reader_id = @ReaderId 
                AND Return_date IS NOT NULL";

            return await ExecuteScalarAsync<int>(sql, new { ReaderId = readerId });
        }
        public async Task<Book?> GetBookWithDetailsAsync(int bookId)
        {
            var sql = @"
                SELECT b.Book_Id AS BookId,
                b.Title,
                b.Author_id AS AuthorId,
                b.Year_published AS YearPublished,
                b.Pages,
                b.Genre,
                b.Condition_percent AS ConditionPercent,
                a.Author_name AS AuthorName,
                a.Birth_year AS BirthYear
                FROM Books b
                LEFT JOIN Authors a ON b.Author_id = a.Author_id
                WHERE b.Book_id = @BookId;
            ";
            return await QuerySingleAsync<Book>(sql, new { BookId = bookId });
        }
        public async Task<List<Borrow>> GetReaderBorrowsAsync(int readerId)
        {
            var sql = @"
                SELECT 
                    br.Borrow_id AS BorrowId,
                    br.Book_id AS BookId,   
                    br.Reader_id AS ReaderId,      
                    br.Borrow_date AS BorrowDate,
                    br.Return_date AS ReturnDate,  
                    b.Title AS BookTitle,
                    r.Reader_name AS ReaderName,
                    r.Phone_number AS PhoneNumber,
                    r.Email AS ReaderEmail,
                    DATEDIFF(DAY, br.Borrow_date, COALESCE(br.Return_date, GETDATE())) AS BorrowDays
                FROM Borrows br
                LEFT JOIN Books b ON br.Book_id = b.Book_id
                LEFT JOIN Readers r ON br.Reader_id = r.Reader_id
                WHERE br.Reader_id = @ReaderId
                ORDER BY br.Borrow_date DESC";

            return await QueryAsync<Borrow>(sql, new { ReaderId = readerId });
        }
        public async Task<ReaderStatistics> GetReaderStatisticsAsync(int readerId)
        {
            var sql = @"
                SELECT 
                    COUNT(*) as TotalBorrows,
                    SUM(CASE WHEN Return_date IS NULL THEN 1 ELSE 0 END) as ActiveBorrows,
                    AVG(CAST(DATEDIFF(DAY, Borrow_date, COALESCE(Return_date, GETDATE())) AS FLOAT)) as AverageBorrowDays
                FROM Borrows
                WHERE Reader_id = @ReaderId
                GROUP BY Reader_id";

            var result = await QuerySingleAsync<ReaderStatistics>(sql, new { ReaderId = readerId });
            return result ?? new ReaderStatistics
            {
                TotalBorrows = 0,
                ActiveBorrows = 0,
                AverageBorrowDays = 0
            };
        }
        public async Task<List<T>> QueryAsync<T>(string sql, object? parameters = null)
        {
            var results = new List<T>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(sql, connection))
                {
                    AddParameters(command, parameters);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while(await reader.ReadAsync())
                        {
                            var item = MapToObject<T>(reader);
                            if (item != null)
                                results.Add(item);
                        }
                    }
                }
            }
            return results;
        }
        public async Task<Reader?> GetReaderWithBorrowAsync(int readerId)
        {
            var readerSql = @"
                SELECT 
                    Reader_id AS ReaderId,
                    Reader_name AS ReaderName,
                    Phone_number AS PhoneNumber,
                    Email AS ReaderEmail,
                    ReaderInfo
                FROM Readers
                WHERE Reader_id = @ReaderId";

            var reader = await QuerySingleAsync<Reader>(readerSql, new { ReaderId = readerId });

            if (reader == null)
                return null;

            reader.BooksRead = await GetBooksReadCountAsync(readerId);
            reader.Borrows = await GetReaderBorrowsAsync(readerId);
            return reader;
        }
        public async Task<T?> QuerySingleAsync<T>(string sql, object? parameters = null)
        {
            var results = await QueryAsync<T>(sql, parameters);
            return results.FirstOrDefault();
        }
        public async Task<string> UpdateReaderInfoAsync(int readerId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var checkSql = @"
                    IF NOT EXISTS (SELECT 1 FROM Readers WHERE Reader_id = @ReaderId)
                    BEGIN
                    THROW 51003, 'Не можна оновити інформацію - читача не існує.', 1;
                        END
                    ";
                try
                {
                    using (var checkCommand = new SqlCommand(checkSql, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@ReaderId", readerId);
                        await checkCommand.ExecuteNonQueryAsync();
                    }
                    using var command = new SqlCommand("dbo.update_user_info", connection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ReaderId", readerId);
                    await command.ExecuteNonQueryAsync();

                    var getInfoCommand = new SqlCommand(
                        "SELECT ReaderInfo FROM Readers WHERE Reader_id = @ReaderId", connection);
                    getInfoCommand.Parameters.AddWithValue("@ReaderId", readerId);
                    var result = await getInfoCommand.ExecuteScalarAsync();
                    return result?.ToString() ?? "Інформація додана";
                }
                catch (SqlException ex) when (ex.Number == 51003)
                {
                    Console.WriteLine($"Помилка при оновленні читача: {ex.Message}");
                    throw new Exception($"Неможливо оновити інформацію: {ex.Message}");
                }
            }
        }
        private void AddParameters(SqlCommand command, object? parameters) {
            if (parameters == null)
                return;
            var properties = parameters.GetType().GetProperties();
            foreach (var prop in properties)
            {
                var value = prop.GetValue(parameters);
                command.Parameters.AddWithValue($"@{prop.Name}", value ?? DBNull.Value);
            }
        }
        private T? MapToObject<T>(SqlDataReader reader)
        {
            var obj = Activator.CreateInstance<T>();
            var properties = typeof(T).GetProperties();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                var columnName = reader.GetName(i);
                var property = properties.FirstOrDefault(p =>
                    string.Equals(p.Name, columnName, StringComparison.OrdinalIgnoreCase));

                if (property != null && !reader.IsDBNull(i))
                {
                    var value = reader.GetValue(i);
                    try
                    {
                        if (property.PropertyType.IsGenericType &&
                            property.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                        {
                            var underlyingType = Nullable.GetUnderlyingType(property.PropertyType);
                            if (underlyingType != null)
                            {
                                var convertedValue = Convert.ChangeType(value, underlyingType);
                                property.SetValue(obj, convertedValue);
                            }
                        }
                        else
                        {
                            var convertedValue = Convert.ChangeType(value, property.PropertyType);
                            property.SetValue(obj, convertedValue);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error converting column '{columnName}' value '{value}' to type {property.PropertyType}: {ex.Message}");
                    }
                }
                else if (property != null && reader.IsDBNull(i))
                {
                    if (property.PropertyType.IsClass ||
                        (property.PropertyType.IsGenericType &&
                         property.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>)))
                    {
                        property.SetValue(obj, null);
                    }
                }
            }

            return obj;
        }
        public async Task<T> ExecuteScalarAsync<T>(string sql, object? parameters = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(sql, connection))
                {
                    AddParameters(command, parameters);
                    var result = await command.ExecuteScalarAsync();

                    if (result == null || result == DBNull.Value)
                    {
                        return default(T);
                    }

                    return (T)Convert.ChangeType(result, typeof(T));
                }
            }
        }

        public async Task<List<string>> GetUpperCaseEmailsAsync()
        {
            var sql = @"
                SELECT UPPER(Email) AS Email
                FROM Readers
                WHERE Email IS NOT NULL AND LEN(TRIM(Email)) > 0
                ORDER BY Email
            ";
            var emails = await QueryAsync<EmailResult>(sql);
            return emails.Select(e => e.Email).ToList();
        }

        public async Task<List<string>> GetLowerCaseEmailsAsync()
        {
            var sql = @"
                SELECT LOWER(Email) AS Email
                FROM Readers
                WHERE Email IS NOT NULL AND LEN(TRIM(Email)) > 0
                ORDER BY Email
            ";
            var emails = await QueryAsync<EmailResult>(sql);
            return emails.Select(e => e.Email).ToList();
        }

        public async Task<List<string>> GetMaxBookBorrowPeriodAsync(string bookName)
        {
            var results = new List<string>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using var command = new SqlCommand("SELECT * FROM dbo.get_max_bope(@BookName)", connection);
                command.Parameters.AddWithValue("@BookName", bookName);
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while(await reader.ReadAsync())
                    {
                        if (!reader.IsDBNull(0))
                        {
                            results.Add(reader.GetString(0));
                        }
                    }
                }
            }
            return results;
        }
    }  
}
