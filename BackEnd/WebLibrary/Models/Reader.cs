namespace WebLibrary.Models
{
    public class Reader
    {
        public int ReaderId { get; set; }
        public string? ReaderName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ReaderEmail { get; set; }
        public string? ReaderInfo { get; set; }
        public int BooksRead { get; set; }
        public List<Borrow>? Borrows { get; set; }
    }
}
