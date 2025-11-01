using api_soil_breath.Data;
using api_soil_breath.DTOs;
using api_soil_breath.Entity;
using Microsoft.EntityFrameworkCore;

namespace api_soil_breath.Services
{
    public class DashboardService
    {
        private readonly DataBaseConfig _context;

        public DashboardService(DataBaseConfig context)
        {
            _context = context;
        }

        public async Task<DashboardDTO> GetDashboard(int idUser)
        {
            // Busca os solos do usuário com suas culturas associadas
            var solos = await _context.Solos
                .Include(s => s.Cultura)
                .Include(s => s.Propriedade)
                .Where(s => s.Propriedade.UsuarioId == idUser)
                .ToListAsync();

            if (solos == null || !solos.Any())
                throw new Exception("Nenhum solo encontrado.");

            var resultado = new List<DashboardSoloDTO>();

            foreach (var solo in solos)
            {
                if (solo.Cultura == null)
                {
                    resultado.Add(new DashboardSoloDTO
                    {
                        IdSolo = solo.Id,
                        Identificacao = solo.Identificacao,
                        CulturaNome = "Sem cultura associada",
                        FosforoPct = 0,
                        PotassioPct = 0,
                        NitrogenioPct = 0,
                        MediaPct = 0
                    });
                    continue;
                }

                double fosforoPct = CalcularPercentual(solo.Fosforo, solo.Cultura.Fosforo);
                double potassioPct = CalcularPercentual(solo.Potassio, solo.Cultura.Potassio);
                double nitrogenioPct = CalcularPercentual(solo.Nitrogenio, solo.Cultura.Nitrogenio);

                double media = (fosforoPct + potassioPct + nitrogenioPct) / 3;

                resultado.Add(new DashboardSoloDTO
                {
                    IdSolo = solo.Id,
                    Identificacao = solo.Identificacao,
                    CulturaNome = solo.Cultura.Nome,
                    FosforoPct = fosforoPct,
                    PotassioPct = potassioPct,
                    NitrogenioPct = nitrogenioPct,
                    MediaPct = media
                });
            }

            return new DashboardDTO
            {
                UsuarioId = idUser,
                Solos = resultado
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

        public async Task<DashboardDTO> GetDashboardByCultura(int idUser, int culturaId)
        {
            // Busca os solos do usuário que possuem a cultura escolhida
            var solos = await _context.Solos
                .Include(s => s.Cultura)
                .Include(s => s.Propriedade)
                .Where(s => s.Propriedade.UsuarioId == idUser
                            && s.Cultura != null
                            && s.Cultura.Id == culturaId)
                .ToListAsync();

            if (solos == null || !solos.Any())
                throw new Exception("Nenhum solo encontrado para essa cultura.");

            var resultado = new List<DashboardSoloDTO>();

            foreach (var solo in solos)
            {
                double fosforoPct = CalcularPercentual(solo.Fosforo, solo.Cultura.Fosforo);
                double potassioPct = CalcularPercentual(solo.Potassio, solo.Cultura.Potassio);
                double nitrogenioPct = CalcularPercentual(solo.Nitrogenio, solo.Cultura.Nitrogenio);

                double media = (fosforoPct + potassioPct + nitrogenioPct) / 3;

                resultado.Add(new DashboardSoloDTO
                {
                    IdSolo = solo.Id,
                    Identificacao = solo.Identificacao,
                    CulturaNome = solo.Cultura.Nome,
                    FosforoPct = fosforoPct,
                    PotassioPct = potassioPct,
                    NitrogenioPct = nitrogenioPct,
                    MediaPct = media
                });
            }

            return new DashboardDTO
            {
                UsuarioId = idUser,
                Solos = resultado
            };
        }

    }
}