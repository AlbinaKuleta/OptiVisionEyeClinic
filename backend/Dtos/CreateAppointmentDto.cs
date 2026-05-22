namespace backend.Dtos
{
    public class CreateAppointmentDto
    {
        public int PatientId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "Scheduled";
        public string Notes { get; set; } = string.Empty;
    }
}