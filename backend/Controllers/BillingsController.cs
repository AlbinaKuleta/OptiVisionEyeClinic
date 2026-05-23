using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BillingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BillingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBillings()
        {
            var billings = await _context.Billings
                .Include(b => b.Patient)
                .OrderByDescending(b => b.BillingDate)
                .ToListAsync();

            return Ok(billings);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBilling(CreateBillingDto dto)
        {
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);

            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            var billing = new Billing
            {
                PatientId = dto.PatientId,
                BillingDate = dto.BillingDate,
                ServiceName = dto.ServiceName,
                Amount = dto.Amount,
                PaymentStatus = dto.PaymentStatus,
                PaymentMethod = dto.PaymentMethod,
                Notes = dto.Notes
            };

            _context.Billings.Add(billing);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Billing created successfully.", billing });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBilling(int id, CreateBillingDto dto)
        {
            var billing = await _context.Billings.FindAsync(id);

            if (billing == null)
                return NotFound(new { message = "Billing not found." });

            billing.PatientId = dto.PatientId;
            billing.BillingDate = dto.BillingDate;
            billing.ServiceName = dto.ServiceName;
            billing.Amount = dto.Amount;
            billing.PaymentStatus = dto.PaymentStatus;
            billing.PaymentMethod = dto.PaymentMethod;
            billing.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Billing updated successfully.", billing });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBilling(int id)
        {
            var billing = await _context.Billings.FindAsync(id);

            if (billing == null)
                return NotFound(new { message = "Billing not found." });

            _context.Billings.Remove(billing);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Billing deleted successfully." });
        }
    }
}