using backend.Constants;
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
    [Authorize(Roles = UserRoles.Admin)]
    public class DoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _context.Doctors
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return Ok(doctors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDoctor(CreateDoctorDto dto)
        {
            var doctor = new Doctor
            {
                FullName = dto.FullName,
                Specialization = dto.Specialization,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Availability = dto.Availability,
                Notes = dto.Notes
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor created successfully.", doctor });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, CreateDoctorDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            doctor.FullName = dto.FullName;
            doctor.Specialization = dto.Specialization;
            doctor.PhoneNumber = dto.PhoneNumber;
            doctor.Email = dto.Email;
            doctor.Availability = dto.Availability;
            doctor.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor updated successfully.", doctor });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor deleted successfully." });
        }
    }
}