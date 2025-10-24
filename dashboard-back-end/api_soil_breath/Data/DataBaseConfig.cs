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
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cultura> Culturas { get; set; }
        public DbSet<Propriedade> Propriedades { get; set; }
        public DbSet<Sensor> Sensores { get; set; }
    }
}
