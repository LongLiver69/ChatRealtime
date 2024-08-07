using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SignalRDemo.Domain.Entities;

namespace SignalRDemo
{
    public class ConnectionConfiguration : IEntityTypeConfiguration<Connection>
    {
        public ConnectionConfiguration(EntityTypeBuilder<Connection> builder)
        {            
        }

        public virtual void Configure(EntityTypeBuilder<Connection> builder)
        {
            builder.Property(e => e.Id).HasColumnName("id").IsRequired();
            builder.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
            builder.Property(e => e.SignalrId).HasColumnName("signalr_id").IsRequired();
            builder.Property(e => e.Timestamp).HasColumnName("timestamp").IsRequired().HasColumnType("timestamp without time zone");
        }
    }
}
