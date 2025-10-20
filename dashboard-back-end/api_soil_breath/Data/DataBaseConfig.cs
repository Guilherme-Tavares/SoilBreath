using Microsoft.EntityFrameworkCore;
using api_soil_breath.Entity;

namespace api_soil_breath.Data
{
    public class DataBaseConfig : DbContext
    {
        public DataBaseConfig(DbContextOptions<DataBaseConfig> options)
            : base(options)
        {
        }

        public DbSet<Solo> Solos { get; set; }
    }
}
