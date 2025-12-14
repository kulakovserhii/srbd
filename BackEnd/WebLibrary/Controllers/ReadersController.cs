using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebLibrary.Services;

namespace WebLibrary.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReadersController : ControllerBase
    {
        private readonly IDatabaseService _dbService;
        public ReadersController(IDatabaseService dbService)
        {
            _dbService = dbService;
        }
        [HttpPost]
        public async Task<IActionResult> UpdateReaderInfo(int id)
        {
            try
            {
                var result = await _dbService.UpdateReaderInfoAsync(id);
                return Ok(new
                {
                    Success = true,
                    Message = "Info Updated",
                    ReaderId = id,
                });
            }
            catch (Exception ex){
                return BadRequest(new
                {
                    Success = false,
                    Message = $"Error: {ex.Message}",
                    ReaderId = id
                });
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetReaders()
        {
            var readers = await _dbService.GetAllReadersAsync();
            return Ok(readers);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReader(int id)
        {
            var reader = await _dbService.GetReaderWithBorrowAsync(id);
            if (reader == null)
                return NotFound("Reader is not found");
            return Ok(reader);
        }
        [HttpGet("{id}/borrows")]
        public async Task<IActionResult> GetReaderBorrows(int id)
        {
            var borrows = await _dbService.GetReaderBorrowsAsync(id);
            return Ok(borrows);
        }
       [HttpGet("{id}/full")]
        public async Task<IActionResult> GetReaderFullInfo(int id)
        {
            try
            {
                var reader = await _dbService.GetReaderWithBorrowAsync(id);
                if (reader == null)
                    return NotFound($"Читач з ID {id} не знайдений");

                var statistics = await _dbService.GetReaderStatisticsAsync(id);
        
                return Ok(new
                {
                    Reader = new
                    {
                        reader.ReaderId,
                        reader.ReaderName,
                        reader.PhoneNumber,
                        reader.ReaderEmail,
                        reader.ReaderInfo,
                        reader.BooksRead
                    },
                    Borrows = reader.Borrows,
                    Statistics = statistics
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Помилка сервера: {ex.Message}");
            }
        }
        [HttpGet("uppercase-emails")]
        public async Task<IActionResult> GetUppercaseEmails()
        {
            var emails = await _dbService.GetUpperCaseEmailsAsync();
            if (emails == null || emails.Count == 0)
                return NotFound("No emails");
            return Ok(emails);
        }
        [HttpGet("lowercase-emails")]
        public async Task<IActionResult> GetLowercaseEmails()
        {
            var emails = await _dbService.GetLowerCaseEmailsAsync();
            if (emails == null || emails.Count == 0)
                return NotFound("No emails");
            return Ok(emails);
        }
    }
}
