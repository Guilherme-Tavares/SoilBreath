using api_soil_brief.Data;
using api_soil_brief.DTOs;
using api_soil_brief.Entity;
using Microsoft.EntityFrameworkCore;

namespace api_soil_brief.Services
{
    public class SoloService
    {
        private readonly DataBaseConfig _context;

        public SoloService(DataBaseConfig context)
        {
            _context = context;
        }

        public async Task<List<Solo>> GetAll(int idUser)
        {
            return await _context.Solos
                .Include(s => s.Propriedade)
                    .ThenInclude(p => p.Usuario)
                .Include(s => s.Cultura)
                .Where(s => s.Propriedade.UsuarioId == idUser)
                .ToListAsync();
        }

        public async Task<Solo> GetById(int id, int idUser)
        {
            var solo = await _context.Solos
                .Include(s => s.Propriedade)
                .Where(s => s.Id == id && s.Propriedade.UsuarioId == idUser)
                .FirstOrDefaultAsync();

            if (solo == null)
                throw new Exception("Solo não encontrado.");

            return solo;
        }

        public async Task<Solo> Update(Solo solo, int idUser)
        {
            var existingSolo = await _context.Solos
                .Include(s => s.Propriedade)
                .Where(s => s.Id == solo.Id && s.Propriedade.UsuarioId == idUser)
                .FirstOrDefaultAsync();

            if (existingSolo == null)
                throw new Exception("Solo não encontrado.");

            existingSolo.Fosforo = solo.Fosforo;
            existingSolo.Potassio = solo.Potassio;
            existingSolo.Nitrogenio = solo.Nitrogenio;
            existingSolo.Identificacao = solo.Identificacao;
            existingSolo.Umidade = solo.Umidade;
            existingSolo.Temperatura = solo.Temperatura;
            existingSolo.CulturaId = solo.CulturaId;

            await _context.SaveChangesAsync();
            return existingSolo;
        }

        public Solo Create(Solo solo)
        {
            _context.Solos.Add(solo);
            _context.SaveChanges();
            return solo;
        }

        public async Task Delete(int id, int idUser)
        {
            var solo = await GetById(id, idUser);
            _context.Solos.Remove(solo);
            await _context.SaveChangesAsync();
        }

        public async Task<SoloResponseEspDTO> UpdatePeriodic(SoloResponseEspDTO solo)
        {
            var existingSensor = await _context.Sensores
                .Include(s => s.Solo)
                    .ThenInclude(solo => solo.Propriedade)
                .Where(s => s.Id == solo.IdSensor)
                .FirstOrDefaultAsync();

            if (existingSensor == null || existingSensor.Solo == null)
                throw new Exception("Sensor não encontrado.");

            existingSensor.Solo.Fosforo = solo.Fosforo;
            existingSensor.Solo.Potassio = solo.Potassio;
            existingSensor.Solo.Nitrogenio = solo.Nitrogenio;
            existingSensor.Solo.Umidade = solo.UmidadeSolo;
            existingSensor.Solo.Temperatura = solo.Temperatura;

            await _context.SaveChangesAsync();
            return solo;
        }
    }
}
