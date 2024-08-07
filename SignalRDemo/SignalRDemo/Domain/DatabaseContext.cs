using Microsoft.EntityFrameworkCore;
using SignalRDemo.Domain.Entities;

namespace SignalRDemo;

public class DatabaseContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Connection> Connections { get; set; }


    public DatabaseContext(DbContextOptions<DatabaseContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfiguration(new UserConfiguration(builder.Entity<User>()));
        builder.ApplyConfiguration(new ConnectionConfiguration(builder.Entity<Connection>()));
    }
}
