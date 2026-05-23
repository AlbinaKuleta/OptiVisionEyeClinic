using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Prescription
    {
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        public Patient? Patient { get; set; }

        [Required]
        public DateTime PrescriptionDate { get; set; }

        [Required]
        public string PrescriptionType { get; set; } = string.Empty;

        public string RightEyeSphere { get; set; } = string.Empty;
        public string LeftEyeSphere { get; set; } = string.Empty;

        public string RightEyeCylinder { get; set; } = string.Empty;
        public string LeftEyeCylinder { get; set; } = string.Empty;

        public string RightEyeAxis { get; set; } = string.Empty;
        public string LeftEyeAxis { get; set; } = string.Empty;

        public string PupillaryDistance { get; set; } = string.Empty;

        public string MedicationName { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}