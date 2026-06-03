using backend.Constants;
using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> _userManager;

        public DoctorsController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Include(d => d.ApplicationUser)
                .OrderByDescending(d => d.CreatedAt)
                .Select(d => new
                {
                    d.Id,
                    d.ApplicationUserId,
                    ApplicationUser = new
                    {
                        d.ApplicationUser!.Id,
                        d.ApplicationUser.FullName,
                        d.ApplicationUser.Email
                    },
                    d.Specialization,
                    d.PhoneNumber,
                    d.Availability,
                    d.Notes,
                    d.CreatedAt
                })
                .ToListAsync();

            return Ok(doctors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDoctor(CreateDoctorDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.ApplicationUserId);

            if (user == null)
                return BadRequest(new { message = "Selected user was not found." });

            var roles = await _userManager.GetRolesAsync(user);

            if (!roles.Contains(UserRoles.Doctor))
                return BadRequest(new { message = "Selected user is not assigned to Doctor role." });

            var doctorProfileExists = await _context.Doctors
                .AnyAsync(d => d.ApplicationUserId == dto.ApplicationUserId);

            if (doctorProfileExists)
                return BadRequest(new { message = "This doctor already has a profile." });

            var doctor = new Doctor
            {
                ApplicationUserId = dto.ApplicationUserId,
                Specialization = dto.Specialization,
                PhoneNumber = dto.PhoneNumber,
                Availability = dto.Availability,
                Notes = dto.Notes
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor profile created successfully.", doctor });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, CreateDoctorDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound(new { message = "Doctor profile not found." });

            var user = await _userManager.FindByIdAsync(dto.ApplicationUserId);

            if (user == null)
                return BadRequest(new { message = "Selected user was not found." });

            var roles = await _userManager.GetRolesAsync(user);

            if (!roles.Contains(UserRoles.Doctor))
                return BadRequest(new { message = "Selected user is not assigned to Doctor role." });

            var doctorProfileExists = await _context.Doctors
                .AnyAsync(d => d.ApplicationUserId == dto.ApplicationUserId && d.Id != id);

            if (doctorProfileExists)
                return BadRequest(new { message = "This doctor user already has another profile." });

            doctor.ApplicationUserId = dto.ApplicationUserId;
            doctor.Specialization = dto.Specialization;
            doctor.PhoneNumber = dto.PhoneNumber;
            doctor.Availability = dto.Availability;
            doctor.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor profile updated successfully.", doctor });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound(new { message = "Doctor profile not found." });

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor profile deleted successfully." });
        }
    }
}