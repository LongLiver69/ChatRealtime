﻿namespace SignalRDemo.Domain.Entities
{
    public class UserDto
    {
        public int UserId { get; set; }

        public string? FullName { get; set; }

        public string SignalrId {  get; set; } = string.Empty;
    }
}
