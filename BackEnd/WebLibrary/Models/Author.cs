namespace WebLibrary.Models
{
    public class Author
    {
        public int AuthorId { get; set; }
        public string AuthorName { get; set; }
        public int? BirthYear { get; set; }
        public int BooksCount { get; set; }
        public List<Book>? Books { get; set; }
    }
}
