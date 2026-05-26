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
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Doctor}")]
    public class PrescriptionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrescriptionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPrescriptions()
        {
            var prescriptions = await _context.Prescriptions
                .Include(p => p.Patient)
                .OrderByDescending(p => p.PrescriptionDate)
                .ToListAsync();

            return Ok(prescriptions);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePrescription(CreatePrescriptionDto dto)
        {
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);

            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            var prescription = new Prescription
            {
                PatientId = dto.PatientId,
                PrescriptionDate = dto.PrescriptionDate,
                PrescriptionType = dto.PrescriptionType,
                RightEyeSphere = dto.RightEyeSphere,
                LeftEyeSphere = dto.LeftEyeSphere,
                RightEyeCylinder = dto.RightEyeCylinder,
                LeftEyeCylinder = dto.LeftEyeCylinder,
                RightEyeAxis = dto.RightEyeAxis,
                LeftEyeAxis = dto.LeftEyeAxis,
                PupillaryDistance = dto.PupillaryDistance,
                MedicationName = dto.MedicationName,
                Dosage = dto.Dosage,
                Instructions = dto.Instructions
            };

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Prescription created successfully.", prescription });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrescription(int id, CreatePrescriptionDto dto)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);

            if (prescription == null)
                return NotFound(new { message = "Prescription not found." });

            prescription.PatientId = dto.PatientId;
            prescription.PrescriptionDate = dto.PrescriptionDate;
            prescription.PrescriptionType = dto.PrescriptionType;
            prescription.RightEyeSphere = dto.RightEyeSphere;
            prescription.LeftEyeSphere = dto.LeftEyeSphere;
            prescription.RightEyeCylinder = dto.RightEyeCylinder;
            prescription.LeftEyeCylinder = dto.LeftEyeCylinder;
            prescription.RightEyeAxis = dto.RightEyeAxis;
            prescription.LeftEyeAxis = dto.LeftEyeAxis;
            prescription.PupillaryDistance = dto.PupillaryDistance;
            prescription.MedicationName = dto.MedicationName;
            prescription.Dosage = dto.Dosage;
            prescription.Instructions = dto.Instructions;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Prescription updated successfully.", prescription });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> DeletePrescription(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);

            if (prescription == null)
                return NotFound(new { message = "Prescription not found." });

            _context.Prescriptions.Remove(prescription);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Prescription deleted successfully." });
        }
    }
}