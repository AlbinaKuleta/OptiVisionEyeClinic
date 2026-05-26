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
    public class EyeExamsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EyeExamsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetEyeExams()
        {
            var exams = await _context.EyeExams
                .Include(e => e.Patient)
                .OrderByDescending(e => e.ExamDate)
                .ToListAsync();

            return Ok(exams);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEyeExam(CreateEyeExamDto dto)
        {
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);

            if (!patientExists)
                return BadRequest(new { message = "Patient not found." });

            var exam = new EyeExam
            {
                PatientId = dto.PatientId,
                ExamDate = dto.ExamDate,
                RightEyeVision = dto.RightEyeVision,
                LeftEyeVision = dto.LeftEyeVision,
                EyePressureRight = dto.EyePressureRight,
                EyePressureLeft = dto.EyePressureLeft,
                Diagnosis = dto.Diagnosis,
                TreatmentPlan = dto.TreatmentPlan,
                Notes = dto.Notes
            };

            _context.EyeExams.Add(exam);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Eye exam created successfully.", exam });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEyeExam(int id, CreateEyeExamDto dto)
        {
            var exam = await _context.EyeExams.FindAsync(id);

            if (exam == null)
                return NotFound(new { message = "Eye exam not found." });

            exam.PatientId = dto.PatientId;
            exam.ExamDate = dto.ExamDate;
            exam.RightEyeVision = dto.RightEyeVision;
            exam.LeftEyeVision = dto.LeftEyeVision;
            exam.EyePressureRight = dto.EyePressureRight;
            exam.EyePressureLeft = dto.EyePressureLeft;
            exam.Diagnosis = dto.Diagnosis;
            exam.TreatmentPlan = dto.TreatmentPlan;
            exam.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Eye exam updated successfully.", exam });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> DeleteEyeExam(int id)
        {
            var exam = await _context.EyeExams.FindAsync(id);

            if (exam == null)
                return NotFound(new { message = "Eye exam not found." });

            _context.EyeExams.Remove(exam);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Eye exam deleted successfully." });
        }
    }
}