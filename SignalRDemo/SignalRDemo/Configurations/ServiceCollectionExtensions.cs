using Microsoft.EntityFrameworkCore;

namespace SignalRDemo
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddConnectionString(this IServiceCollection services, IConfiguration configuration)
        {
            //// get default connection
            var strDDConnect = configuration.GetConnectionString("DefaultConnection");

            services.AddMvc();
            services.AddEntityFrameworkNpgsql().AddDbContext<DatabaseContext>(opt =>
                opt.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            return services;
        }
    }
}