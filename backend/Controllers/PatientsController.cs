using backend.Constants;
using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Doctor},{UserRoles.Receptionist}")]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var query = _context.Patients
                .Include(p => p.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .AsQueryable();

            if (User.IsInRole(UserRoles.Doctor))
            {
                query = query.Where(p => p.Doctor!.ApplicationUserId == userId);
            }

            var patients = await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var patient = await _context.Patients
                .Include(p => p.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            if (User.IsInRole(UserRoles.Doctor) &&
                patient.Doctor?.ApplicationUserId != userId)
            {
                return Forbid();
            }

            return Ok(patient);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient(CreatePatientDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int? doctorId = dto.DoctorId;

            if (User.IsInRole(UserRoles.Doctor))
            {
                var doctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.ApplicationUserId == userId);

                if (doctor == null)
                    return Forbid();

                doctorId = doctor.Id;
            }
            else
            {
                if (doctorId == null)
                    return BadRequest(new { message = "Assigned doctor is required." });

                var doctorExists = await _context.Doctors
                    .AnyAsync(d => d.Id == doctorId.Value);

                if (!doctorExists)
                    return BadRequest(new { message = "Doctor not found." });
            }

            var patient = new Patient
            {
                FullName = dto.FullName,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Address = dto.Address,
                MedicalNotes = dto.MedicalNotes,
                DoctorId = doctorId
            };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Patient created successfully.",
                patient
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, UpdatePatientDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var patient = await _context.Patients
                .Include(p => p.Doctor)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            if (User.IsInRole(UserRoles.Doctor))
            {
                var doctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.ApplicationUserId == userId);

                if (doctor == null)
                    return Forbid();

                if (patient.DoctorId != doctor.Id)
                    return Forbid();

                patient.DoctorId = doctor.Id;
            }
            else
            {
                if (dto.DoctorId == null)
                    return BadRequest(new { message = "Assigned doctor is required." });

                var doctorExists = await _context.Doctors
                    .AnyAsync(d => d.Id == dto.DoctorId.Value);

                if (!doctorExists)
                    return BadRequest(new { message = "Doctor not found." });

                patient.DoctorId = dto.DoctorId;
            }

            patient.FullName = dto.FullName;
            patient.Gender = dto.Gender;
            patient.DateOfBirth = dto.DateOfBirth;
            patient.PhoneNumber = dto.PhoneNumber;
            patient.Email = dto.Email;
            patient.Address = dto.Address;
            patient.MedicalNotes = dto.MedicalNotes;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Patient updated successfully.",
                patient
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Receptionist}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Patient deleted successfully." });
        }
    }
}