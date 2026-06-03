using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Doctor
    {
        public int Id { get; set; }

        [Required]
        public string ApplicationUserId { get; set; } = string.Empty;

        public ApplicationUser? ApplicationUser { get; set; }

        [Required]
        public string Specialization { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Availability { get; set; } = string.Empty;

        public string Notes { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}