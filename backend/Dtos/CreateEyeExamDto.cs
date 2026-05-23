namespace backend.Dtos
{
    public class CreateEyeExamDto
    {
        public int PatientId { get; set; }
        public DateTime ExamDate { get; set; }

        public string RightEyeVision { get; set; } = string.Empty;
        public string LeftEyeVision { get; set; } = string.Empty;

        public string EyePressureRight { get; set; } = string.Empty;
        public string EyePressureLeft { get; set; } = string.Empty;

        public string Diagnosis { get; set; } = string.Empty;
        public string TreatmentPlan { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}