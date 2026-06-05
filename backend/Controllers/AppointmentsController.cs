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
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var query = _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .AsQueryable();

            if (User.IsInRole(UserRoles.Doctor))
            {
                query = query.Where(a => a.Doctor!.ApplicationUserId == userId);
            }

            var appointments = await query
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            if (User.IsInRole(UserRoles.Doctor) &&
                appointment.Doctor?.ApplicationUserId != userId)
            {
                return Forbid();
            }

            return Ok(appointment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment(CreateAppointmentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == dto.PatientId);

            if (patient == null)
                return BadRequest(new { message = "Patient not found." });

            int doctorId;

            if (User.IsInRole(UserRoles.Doctor))
            {
                var doctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.ApplicationUserId == userId);

                if (doctor == null)
                    return Forbid();

                if (patient.DoctorId != doctor.Id)
                    return Forbid();

                doctorId = doctor.Id;
            }
            else
            {
                if (dto.DoctorId == null)
                    return BadRequest(new { message = "Doctor is required." });

                var doctorExists = await _context.Doctors
                    .AnyAsync(d => d.Id == dto.DoctorId.Value);

                if (!doctorExists)
                    return BadRequest(new { message = "Doctor not found." });

                doctorId = dto.DoctorId.Value;
            }

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = doctorId,
                AppointmentDate = dto.AppointmentDate,
                Reason = dto.Reason,
                Status = dto.Status,
                Notes = dto.Notes
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Appointment created successfully.",
                appointment
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, CreateAppointmentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            if (User.IsInRole(UserRoles.Doctor))
            {
                var doctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.ApplicationUserId == userId);

                if (doctor == null)
                    return Forbid();

                if (appointment.DoctorId != doctor.Id)
                    return Forbid();

                appointment.PatientId = dto.PatientId;
                appointment.DoctorId = doctor.Id;
            }
            else
            {
                if (dto.DoctorId == null)
                    return BadRequest(new { message = "Doctor is required." });

                appointment.PatientId = dto.PatientId;
                appointment.DoctorId = dto.DoctorId.Value;
            }

            appointment.AppointmentDate = dto.AppointmentDate;
            appointment.Reason = dto.Reason;
            appointment.Status = dto.Status;
            appointment.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Appointment updated successfully.",
                appointment
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment deleted successfully." });
        }
    }
}