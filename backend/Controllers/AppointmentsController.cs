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
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment(CreateAppointmentDto dto)
        {
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);

            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorName = dto.DoctorName,
                AppointmentDate = dto.AppointmentDate,
                Reason = dto.Reason,
                Status = dto.Status,
                Notes = dto.Notes
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment created successfully.", appointment });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, CreateAppointmentDto dto)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            appointment.PatientId = dto.PatientId;
            appointment.DoctorName = dto.DoctorName;
            appointment.AppointmentDate = dto.AppointmentDate;
            appointment.Reason = dto.Reason;
            appointment.Status = dto.Status;
            appointment.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment updated successfully.", appointment });
        }

        [HttpDelete("{id}")]
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