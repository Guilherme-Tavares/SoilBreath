using api_soil_brief.Data;
using api_soil_brief.DTOs;
using api_soil_brief.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace api_soil_brief.Services
{
    public class ChamadaEsp32Service : BackgroundService
    {
        private readonly ILogger<ChamadaEsp32Service> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _interval = TimeSpan.FromSeconds(3);

        // Acumuladores para histórico
        private DateTime _diaAtual = DateTime.Today;
        private TimeSpan _tempoAcumulado = TimeSpan.Zero;
        private List<double> _nitrogenioDia = new List<double>();
        private List<double> _fosforoDia = new List<double>();
        private List<double> _potassioDia = new List<double>();
        private List<double> _umidadeDia = new List<double>();
        private List<double> _temperaturaDia = new List<double>();
        private readonly TimeSpan _tempoMinimoRegistro = TimeSpan.FromMinutes(10);
        private bool _registroSalvoHoje = false; // Flag para evitar salvamentos repetidos

        public ChamadaEsp32Service(
            ILogger<ChamadaEsp32Service> logger,
            IHttpClientFactory httpClientFactory,
            IServiceScopeFactory scopeFactory
            )
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Serviço de execução periódica iniciado.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await SolicitaDadosEsp();
                    //_logger.LogInformation("Função executada em: {time}", DateTimeOffset.Now);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao executar a função periódica");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }

        private async Task SolicitaDadosEsp()
        {
            try
            {
                // Verificar mudança de dia e salvar histórico se necessário
                if (DateTime.Today != _diaAtual)
                {
                    _logger.LogInformation($"Mudança de dia detectada: {_diaAtual:dd/MM/yyyy} -> {DateTime.Today:dd/MM/yyyy}");
                    await TentarSalvarHistorico();
                    _diaAtual = DateTime.Today;
                    ResetarAcumuladores();
                    _registroSalvoHoje = false; // Resetar flag para o novo dia
                }

                // Criar client seguro
                var client = _httpClientFactory.CreateClient();

                // Exemplo de requisição (descomente se quiser chamar o ESP32)
                //var response = await client.GetAsync("http://192.168.4.1/json");
                var response = await client.GetAsync("http://localhost:80/json");
                response.EnsureSuccessStatusCode();
                var contentString = await response.Content.ReadAsStringAsync();
                var content = JsonSerializer.Deserialize<SoloResponseEspDTO>(contentString);

                //_logger.LogInformation("Resposta do ESP: {content}", content.Nitrogenio);

                // Aqui ao invés de select, fazer update nos solos
                using var scope = _scopeFactory.CreateScope();
                var soloService = scope.ServiceProvider.GetRequiredService<SoloService>();

                var soloUpdate = await soloService.UpdatePeriodic(content);

                // Acumular leituras para histórico (apenas se NPK forem válidos)
                if (content.Nitrogenio > 0 && content.Fosforo > 0 && content.Potassio > 0)
                {
                    _nitrogenioDia.Add(content.Nitrogenio);
                    _fosforoDia.Add(content.Fosforo);
                    _potassioDia.Add(content.Potassio);
                    _umidadeDia.Add(content.UmidadeSolo);
                    _temperaturaDia.Add(content.Temperatura);
                    _tempoAcumulado += _interval;

                    _logger.LogInformation($"Leituras acumuladas: {_nitrogenioDia.Count}, Tempo: {_tempoAcumulado.TotalMinutes:F2} min");

                    // Salvar/atualizar histórico assim que atingir 10 minutos
                    if (_tempoAcumulado >= _tempoMinimoRegistro && !_registroSalvoHoje)
                    {
                        _logger.LogInformation("Tempo mínimo atingido. Salvando histórico pela primeira vez hoje...");
                        await TentarSalvarHistorico();
                        _registroSalvoHoje = true;
                    }
                    // Atualizar histórico a cada 5 minutos após o primeiro salvamento
                    else if (_registroSalvoHoje && _tempoAcumulado.TotalMinutes % 5 < 0.1) // Aproximadamente a cada 5 min
                    {
                        _logger.LogInformation("Atualizando histórico do dia...");
                        await TentarSalvarHistorico();
                    }
                }
                else
                {
                    _logger.LogWarning("Leitura NPK inválida (valores zerados). Tempo pausado.");
                }

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na atualização de dados: {ex.Message}");
            }
        }

        private async Task TentarSalvarHistorico()
        {
            try
            {
                _logger.LogInformation($"Tentando salvar histórico para {_diaAtual:dd/MM/yyyy}. Tempo acumulado: {_tempoAcumulado.TotalMinutes:F2} min, Leituras: {_nitrogenioDia.Count}");

                // Verificar se atingimos o tempo mínimo de 10 minutos
                if (_tempoAcumulado >= _tempoMinimoRegistro && _nitrogenioDia.Any())
                {
                    using var scope = _scopeFactory.CreateScope();
                    var historicoService = scope.ServiceProvider.GetRequiredService<HistoricoService>();

                    // Obter primeiro solo (assumindo que há ao menos um)
                    var dbContext = scope.ServiceProvider.GetRequiredService<DataBaseConfig>();
                    var primeiroSolo = await dbContext.Solos.FirstOrDefaultAsync();

                    if (primeiroSolo != null)
                    {
                        // Calcular médias e arredondar para inteiros
                        var nitrogenioMedio = Math.Round(_nitrogenioDia.Average());
                        var fosforoMedio = Math.Round(_fosforoDia.Average());
                        var potassioMedio = Math.Round(_potassioDia.Average());
                        var umidadeMedia = Math.Round(_umidadeDia.Average());
                        var temperaturaMedia = Math.Round(_temperaturaDia.Average());
                        var quantidadeLeituras = _nitrogenioDia.Count;

                        _logger.LogInformation($"Salvando histórico: N={nitrogenioMedio}, P={fosforoMedio}, K={potassioMedio}, U={umidadeMedia}, T={temperaturaMedia}");

                        await historicoService.SalvarRegistroDiario(
                            primeiroSolo.Id,
                            _diaAtual,
                            nitrogenioMedio,
                            fosforoMedio,
                            potassioMedio,
                            umidadeMedia,
                            temperaturaMedia,
                            quantidadeLeituras
                        );

                        _logger.LogInformation($"✓ Histórico salvo com sucesso para {_diaAtual:dd/MM/yyyy} - {quantidadeLeituras} leituras, {_tempoAcumulado.TotalMinutes:F2} minutos");
                    }
                    else
                    {
                        _logger.LogWarning("Nenhum solo encontrado no banco de dados para salvar histórico");
                    }
                }
                else
                {
                    _logger.LogWarning($"✗ Não foi possível salvar histórico para {_diaAtual:dd/MM/yyyy}. Tempo acumulado: {_tempoAcumulado.TotalMinutes:F2} min (mínimo: 10 min), Leituras: {_nitrogenioDia.Count}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao salvar histórico para {_diaAtual:dd/MM/yyyy}");
            }
        }

        private void ResetarAcumuladores()
        {
            _tempoAcumulado = TimeSpan.Zero;
            _nitrogenioDia.Clear();
            _fosforoDia.Clear();
            _potassioDia.Clear();
            _umidadeDia.Clear();
            _temperaturaDia.Clear();
            _registroSalvoHoje = false;
        }
    }
}
