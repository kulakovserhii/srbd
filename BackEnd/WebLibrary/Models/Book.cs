namespace WebLibrary.Models
{
    public class Book
    {
        public int BookId { get; set; }
        public string Title { get; set; }
        public int AuthorId { get; set; }
        public int? YearPublished { get; set; }
        public int? Pages { get; set; }
        public string? Genre { get; set; }
        public decimal ConditionPercent { get; set; }
        public string? AuthorName { get; set; }
    }
}
