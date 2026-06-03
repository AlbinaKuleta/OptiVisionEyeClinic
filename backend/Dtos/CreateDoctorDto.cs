using System.ComponentModel.DataAnnotations;

namespace backend.Dtos
{
    public class CreateDoctorDto
    {
        [Required]
        public string ApplicationUserId { get; set; } = string.Empty;

        [Required]
        public string Specialization { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Availability { get; set; } = string.Empty;

        public string Notes { get; set; } = string.Empty;
    }
}