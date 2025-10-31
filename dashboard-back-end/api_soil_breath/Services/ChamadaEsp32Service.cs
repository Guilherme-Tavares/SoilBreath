using api_soil_breath.Data;
using api_soil_breath.DTOs;
using api_soil_breath.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace api_soil_breath.Services
{
    public class ChamadaEsp32Service : BackgroundService
    {
        private readonly ILogger<ChamadaEsp32Service> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _interval = TimeSpan.FromSeconds(10);

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
                    _logger.LogInformation("Função executada em: {time}", DateTimeOffset.Now);
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
                // Criar client seguro
                var client = _httpClientFactory.CreateClient();

                // Exemplo de requisição (descomente se quiser chamar o ESP32)
                var response = await client.GetAsync("http://10.171.229.94/");
                response.EnsureSuccessStatusCode();
                var contentString = await response.Content.ReadAsStringAsync();
                var content = JsonSerializer.Deserialize<SoloResponseEspDTO>(contentString);

                _logger.LogInformation("Resposta do ESP: {content}", content);


                // Aqui ao inves de select, fazer update nos solos
                using var scope = _scopeFactory.CreateScope();
                var soloService = scope.ServiceProvider.GetRequiredService<SoloService>();

                var soloUpdate = soloService.UpdatePeriodic(content);

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na atualização de dados: {ex.Message}");
            }
        }
    }
}
