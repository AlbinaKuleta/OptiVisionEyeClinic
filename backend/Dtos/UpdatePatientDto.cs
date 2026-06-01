namespace backend.Dtos
{
    public class UpdatePatientDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string MedicalNotes { get; set; } = string.Empty;
        public int? DoctorId { get; set; }
    }
}