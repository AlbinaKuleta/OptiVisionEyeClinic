namespace backend.Dtos
{
    public class CreateDoctorDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Availability { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}