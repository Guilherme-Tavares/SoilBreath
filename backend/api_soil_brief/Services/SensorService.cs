using api_soil_brief.Data;
using api_soil_brief.Entity;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace api_soil_brief.Services
{
    public class SensorService
    {
        private readonly DataBaseConfig _context;

        public SensorService(DataBaseConfig context)
        {
            _context = context;
        }

        public async Task<List<Sensor>> GetAll(int idPropriedade)
        {
            return await _context.Sensores.Where(s => s.Solo.Propriedade.Id == idPropriedade).Include(s => s.Solo).ToListAsync();
        }

        public async Task<Sensor> Update(Sensor sensor)
        {
            var existingSensor = await _context.Sensores.FindAsync(sensor.Id);
            if (existingSensor != null)
            {
                existingSensor.IdSensor = sensor.IdSensor;
                existingSensor.SoloId = sensor.SoloId;
                _context.SaveChangesAsync();
            }

            return sensor;
        }

        public Sensor Create(Sensor sensor)
        {
            _context.Sensores.Add(sensor);
            _context.SaveChanges();
            return sensor;
        }

        public async Task<Sensor> GetById(int id)
        {
            var sensor = await _context.Sensores.FindAsync(id);
            if (sensor == null) throw new Exception("Sensor não encontrado!");
            return sensor;
        }

        public async Task Delete(int id)
        {
            var sensor = await GetById(id);

            _context.Sensores.Remove(sensor);
            await _context.SaveChangesAsync();
        }
    }
}
