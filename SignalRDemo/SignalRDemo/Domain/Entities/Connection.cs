namespace SignalRDemo.Domain.Entities
{
    public class Connection
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string SignalrId { get; set; }

        public DateTime? Timestamp { get; set; }
    }
}
