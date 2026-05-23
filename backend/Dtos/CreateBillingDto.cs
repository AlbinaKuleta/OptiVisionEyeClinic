namespace backend.Dtos
{
    public class CreateBillingDto
    {
        public int PatientId { get; set; }
        public DateTime BillingDate { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public string PaymentMethod { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}