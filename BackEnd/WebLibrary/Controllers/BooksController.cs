using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using WebLibrary.Models;
using WebLibrary.Services;

namespace WebLibrary.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IDatabaseService _dbService;
        public BooksController(IDatabaseService dbService)
        {
            _dbService = dbService;
        }
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            var books = await _dbService.GetAllBooksWithAuthorsAsync();
            return Ok(books);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            var book = await _dbService.GetBookWithDetailsAsync(id);
            if (book == null)
                return NotFound();
            return Ok(book);
        }
        [HttpGet("{id}/borrows")]
        public async Task<IActionResult> GetBookBorrows(int id)
        {
            var borrows = await _dbService.GetBookBorrowsWithReaderAsync(id);
            return Ok(borrows);
        }
        [HttpGet("{id}/full")]
        public async Task<IActionResult> GetBookFullInfo(int id)
        {
            var book = await _dbService.GetBookWithDetailsAsync(id);
            if (book == null)
                return NotFound();
            var borrows = await _dbService.GetBookBorrowsWithReaderAsync(id);
            var result = new
            {
                Book = book,
                Borrows = borrows
            };
            return Ok(result);
        }
        [HttpGet("max-borrow-beriod/{bookName}")]
        public async Task<IActionResult> GetMaxBorrowPeriod(string bookName)
        {
            if (string.IsNullOrEmpty(bookName))
                return BadRequest(new { Message = "Введіть назву книги" });
            var results = await _dbService.GetMaxBookBorrowPeriodAsync(bookName);
            return Ok(results);
        }
    }
}
