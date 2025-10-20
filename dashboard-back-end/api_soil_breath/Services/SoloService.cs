using api_soil_breath.Data;
using api_soil_breath.Entity;

namespace api_soil_breath.Services
{
    public class SoloService
    {
        private readonly DataBaseConfig _context;

        public SoloService(DataBaseConfig context)
        {
            _context = context;
        }

        public List<Solo> GetAllSolos()
        {
            return _context.Solos.ToList();
        }
    }
}
