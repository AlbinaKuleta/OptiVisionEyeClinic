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
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Doctor},{UserRoles.Receptionist}")]
        public async Task<IActionResult> GetPatients()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            var query = _context.Patients
                .Include(p => p.Doctor)
                .AsQueryable();

            if (User.IsInRole(UserRoles.Doctor))
            {
                var doctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.ApplicationUser.Email == userEmail);

                if (doctor == null)
                {
                    return Ok(new List<Patient>());
                }

                query = query.Where(p => p.DoctorId == doctor.Id);
            }

            var patients = await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(patients);
        }


        [HttpGet("{id}")]
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Doctor},{UserRoles.Receptionist}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            return Ok(patient);
        }

        [HttpPost]
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Receptionist}")]
        public async Task<IActionResult> CreatePatient(CreatePatientDto dto)
        {
            var patient = new Patient
            {
                FullName = dto.FullName,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Address = dto.Address,
                MedicalNotes = dto.MedicalNotes,
                DoctorId = dto.DoctorId

            };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Patient created successfully.", patient });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Receptionist}")]
        public async Task<IActionResult> UpdatePatient(int id, UpdatePatientDto dto)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound(new { message = "Patient not found." });

            patient.FullName = dto.FullName;
            patient.Gender = dto.Gender;
            patient.DateOfBirth = dto.DateOfBirth;
            patient.PhoneNumber = dto.PhoneNumber;
            patient.Email = dto.Email;
            patient.Address = dto.Address;
            patient.MedicalNotes = dto.MedicalNotes;
            patient.DoctorId = dto.DoctorId;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Patient updated successfully.", patient });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
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