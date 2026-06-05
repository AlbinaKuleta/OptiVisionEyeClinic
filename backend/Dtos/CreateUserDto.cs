namespace backend.Dtos
{
    public class CreateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;

        public string? Specialization { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Availability { get; set; }
        public string? Notes { get; set; }
    }
}