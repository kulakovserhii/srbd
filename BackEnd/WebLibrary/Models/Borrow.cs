namespace WebLibrary.Models
{
    public class Borrow
    {
        public int BorrowId { get; set; }
        public int BookId { get; set; }
        public int ReaderId { get; set; }
        public DateTime BorrowDate { get; set; } 
        public DateTime? ReturnDate { get; set; }
        public string? BookTitle { get; set; }
        public string? ReaderName { get; set; }
    }
}
