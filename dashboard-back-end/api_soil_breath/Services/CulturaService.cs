using api_soil_breath.Data;
using api_soil_breath.DTOs;
using api_soil_breath.Entity;
using Microsoft.EntityFrameworkCore;

namespace api_soil_breath.Services
{
    public class CulturaService
    {
        private readonly DataBaseConfig _context;

        public CulturaService(DataBaseConfig context)
        {
            _context = context;
        }

        public async Task<List<Cultura>> GetAll()
        {
            return await _context.Culturas.ToListAsync();
        }

        public async Task<Cultura> GetById(int id)
        {
            var cultura = await _context.Culturas.FindAsync(id);

            if (cultura == null)
                throw new Exception("Cultura não encontrada.");

            return cultura;
        }

        public async Task<AptidaoSoloDTO> CalcularAptidoesSolo(int soloId)
        {
            var solo = await _context.Solos.FindAsync(soloId);
            if (solo == null)
                throw new Exception("Solo não encontrado.");

            var culturas = await _context.Culturas.ToListAsync();
            var aptidoes = new List<AptidaoDTO>();

            foreach (var cultura in culturas)
            {
                double nitrogenioPct = CalcularPercentual(solo.Nitrogenio, cultura.Nitrogenio);
                double fosforoPct = CalcularPercentual(solo.Fosforo, cultura.Fosforo);
                double potassioPct = CalcularPercentual(solo.Potassio, cultura.Potassio);
                double mediaPct = (nitrogenioPct + fosforoPct + potassioPct) / 3;

                aptidoes.Add(new AptidaoDTO
                {
                    CulturaId = cultura.Id,
                    CulturaNome = cultura.Nome,
                    NitrogenioPct = nitrogenioPct,
                    FosforoPct = fosforoPct,
                    PotassioPct = potassioPct,
                    MediaPct = Math.Round(mediaPct, 2)
                });
            }

            return new AptidaoSoloDTO
            {
                SoloId = solo.Id,
                SoloIdentificacao = solo.Identificacao,
                Nitrogenio = solo.Nitrogenio,
                Fosforo = solo.Fosforo,
                Potassio = solo.Potassio,
                Aptidoes = aptidoes.OrderByDescending(a => a.MediaPct).ToList()
            };
        }

        private double CalcularPercentual(double valorSolo, double valorIdeal)
        {
            if (valorIdeal <= 0)
                return 0;

            double pct = (valorSolo / valorIdeal) * 100;
            if (pct > 100) pct = 100;
            if (pct < 0) pct = 0;

            return Math.Round(pct, 2);
        }
    }
}
