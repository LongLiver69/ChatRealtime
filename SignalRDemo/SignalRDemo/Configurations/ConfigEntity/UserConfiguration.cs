using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SignalRDemo.Domain.Entities;

namespace SignalRDemo
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public UserConfiguration(EntityTypeBuilder<User> builder)
        {            
        }

        public virtual void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(e => e.Id).HasColumnName("id").IsRequired();
            builder.Property(e => e.Name).HasColumnName("name").IsRequired();
            builder.Property(e => e.Username).HasColumnName("username").IsRequired();
            builder.Property(e => e.Password).HasColumnName("password").IsRequired();
        }
    }
}
