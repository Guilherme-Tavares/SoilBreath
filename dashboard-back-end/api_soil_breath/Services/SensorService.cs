using api_soil_breath.Data;
using api_soil_breath.Entity;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace api_soil_breath.Services
{
    public class SensorService
    {
        private readonly DataBaseConfig _context;

        public SensorService(DataBaseConfig context)
        {
            _context = context;
        }

        public async Task<List<Solo>> GetAll()
        {
            return  await _context.Solos.ToListAsync();
        }

        public async Task<Solo> Update(Solo solo)
        {
            var existingSolo = await _context.Solos.FindAsync(solo.Id);
            if (existingSolo != null)
            {
                existingSolo.Fosforo = solo.Fosforo;
                existingSolo.Potassio = solo.Potassio;
                existingSolo.Nitrogenio = solo.Nitrogenio;
                existingSolo.Identificacao = solo.Identificacao;
                _context.SaveChangesAsync();
            }

            return solo;
        }

        public Solo Create(Solo solo)
        {
            _context.Solos.Add(solo);
            _context.SaveChanges();
            return solo;
        }

        public async Task<Solo> GetById(int id)
        {
            var solo = await _context.Solos.FindAsync(id);
            if (solo == null) throw new Exception("Solo não encontrado!");
            return solo;
        }

        public async Task Delete(int id)
        {
            var solo = await GetById(id);

            _context.Solos.Remove(solo);
            await _context.SaveChangesAsync();
        }

        public async Task<SoloResponseEspDTO> UpdatePeriodic(SoloResponseEspDTO solo)
        {
            
            var existingSensor = await _context.Sensores.FindAsync(solo.IdSensor);
            if (existingSensor.Solo != null)
            {
                existingSensor.Solo.Fosforo = solo.Fosforo;
                existingSensor.Solo.Potassio = solo.Potassio;
                existingSensor.Solo.Nitrogenio = solo.Nitrogenio;
                _context.SaveChangesAsync();
            }
            
            return solo;
        }
    }
}
