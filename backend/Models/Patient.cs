using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Patient
    {
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Gender { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string MedicalNotes { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int? DoctorId { get; set; }

        public Doctor? Doctor { get; set; }
    }
}