using api_soil_brief.Data;
using api_soil_brief.DTOs;
using api_soil_brief.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace api_soil_brief.Services
{
    public class HistoricoService
    {
        private readonly DataBaseConfig _context;
        private readonly ILogger<HistoricoService> _logger;

        public HistoricoService(DataBaseConfig context, ILogger<HistoricoService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Buscar último registro para um solo
        public async Task<UltimoRegistroDTO> GetUltimoRegistro(int soloId)
        {
            var ultimo = await _context.Historicos
                .Where(h => h.SoloId == soloId)
                .OrderByDescending(h => h.Data)
                .FirstOrDefaultAsync();

            return new UltimoRegistroDTO
            {
                Data = ultimo?.Data,
                TemRegistros = ultimo != null
            };
        }

        // Buscar dados de um dia específico
        public async Task<HistoricoDiarioDTO> GetDadosDiarios(int soloId, DateTime data)
        {
            var historico = await _context.Historicos
                .Where(h => h.SoloId == soloId && h.Data.Date == data.Date)
                .FirstOrDefaultAsync();

            if (historico == null)
            {
                return new HistoricoDiarioDTO
                {
                    Data = data,
                    Nitrogenio = 0,
                    Fosforo = 0,
                    Potassio = 0,
                    Umidade = 0,
                    Temperatura = 0,
                    TemDados = false
                };
            }

            return new HistoricoDiarioDTO
            {
                Data = historico.Data,
                Nitrogenio = Math.Round(historico.NitrogenioMedio),
                Fosforo = Math.Round(historico.FosforoMedio),
                Potassio = Math.Round(historico.PotassioMedio),
                Umidade = Math.Round(historico.UmidadeMedia),
                Temperatura = Math.Round(historico.TemperaturaMedia),
                TemDados = true
            };
        }

        // Buscar média mensal
        public async Task<HistoricoMensalDTO> GetDadosMensais(int soloId, int mes, int ano)
        {
            var historicos = await _context.Historicos
                .Where(h => h.SoloId == soloId && h.Data.Month == mes && h.Data.Year == ano)
                .ToListAsync();

            if (!historicos.Any())
            {
                return new HistoricoMensalDTO
                {
                    Mes = mes,
                    Ano = ano,
                    MesNome = ObterNomeMes(mes),
                    NitrogenioMedio = 0,
                    FosforoMedio = 0,
                    PotassioMedio = 0,
                    UmidadeMedia = 0,
                    TemperaturaMedia = 0,
                    TotalDias = 0,
                    TemDados = false
                };
            }

            return new HistoricoMensalDTO
            {
                Mes = mes,
                Ano = ano,
                MesNome = ObterNomeMes(mes),
                NitrogenioMedio = Math.Round(historicos.Average(h => h.NitrogenioMedio)),
                FosforoMedio = Math.Round(historicos.Average(h => h.FosforoMedio)),
                PotassioMedio = Math.Round(historicos.Average(h => h.PotassioMedio)),
                UmidadeMedia = Math.Round(historicos.Average(h => h.UmidadeMedia)),
                TemperaturaMedia = Math.Round(historicos.Average(h => h.TemperaturaMedia)),
                TotalDias = historicos.Count,
                TemDados = true
            };
        }

        // Buscar média anual
        public async Task<HistoricoAnualDTO> GetDadosAnuais(int soloId, int ano)
        {
            var historicos = await _context.Historicos
                .Where(h => h.SoloId == soloId && h.Data.Year == ano)
                .ToListAsync();

            if (!historicos.Any())
            {
                return new HistoricoAnualDTO
                {
                    Ano = ano,
                    NitrogenioMedio = 0,
                    FosforoMedio = 0,
                    PotassioMedio = 0,
                    UmidadeMedia = 0,
                    TemperaturaMedia = 0,
                    TotalDias = 0,
                    TemDados = false
                };
            }

            return new HistoricoAnualDTO
            {
                Ano = ano,
                NitrogenioMedio = Math.Round(historicos.Average(h => h.NitrogenioMedio)),
                FosforoMedio = Math.Round(historicos.Average(h => h.FosforoMedio)),
                PotassioMedio = Math.Round(historicos.Average(h => h.PotassioMedio)),
                UmidadeMedia = Math.Round(historicos.Average(h => h.UmidadeMedia)),
                TemperaturaMedia = Math.Round(historicos.Average(h => h.TemperaturaMedia)),
                TotalDias = historicos.Count,
                TemDados = true
            };
        }

        // Salvar ou atualizar registro diário
        public async Task SalvarRegistroDiario(int soloId, DateTime data, double nitrogenio, double fosforo, double potassio, double umidade, double temperatura, int quantidadeLeituras)
        {
            _logger.LogInformation($"[SalvarRegistroDiario] Iniciando salvamento - SoloId: {soloId}, Data: {data:dd/MM/yyyy}");

            var registroExistente = await _context.Historicos
                .FirstOrDefaultAsync(h => h.SoloId == soloId && h.Data.Date == data.Date);

            if (registroExistente != null)
            {
                _logger.LogInformation($"[SalvarRegistroDiario] Registro existente encontrado (ID: {registroExistente.Id}). Atualizando...");
                // Atualizar registro existente
                registroExistente.NitrogenioMedio = nitrogenio;
                registroExistente.FosforoMedio = fosforo;
                registroExistente.PotassioMedio = potassio;
                registroExistente.UmidadeMedia = umidade;
                registroExistente.TemperaturaMedia = temperatura;
                registroExistente.QuantidadeLeituras = quantidadeLeituras;
                _context.Historicos.Update(registroExistente);
            }
            else
            {
                _logger.LogInformation($"[SalvarRegistroDiario] Nenhum registro existente. Criando novo registro...");
                // Criar novo registro
                var novoRegistro = new Historico
                {
                    Data = data.Date,
                    SoloId = soloId,
                    NitrogenioMedio = nitrogenio,
                    FosforoMedio = fosforo,
                    PotassioMedio = potassio,
                    UmidadeMedia = umidade,
                    TemperaturaMedia = temperatura,
                    QuantidadeLeituras = quantidadeLeituras
                };
                await _context.Historicos.AddAsync(novoRegistro);
            }

            var resultado = await _context.SaveChangesAsync();
            _logger.LogInformation($"[SalvarRegistroDiario] SaveChanges executado. Linhas afetadas: {resultado}");
        }

        // Helper: obter nome do mês em português
        private string ObterNomeMes(int mes)
        {
            var cultura = new CultureInfo("pt-BR");
            return cultura.DateTimeFormat.GetMonthName(mes);
        }
    }
}
