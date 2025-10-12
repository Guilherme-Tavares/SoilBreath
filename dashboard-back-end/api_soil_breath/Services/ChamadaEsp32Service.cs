
namespace api_soil_breath.Services
{
    public class ChamadaEsp32Service : BackgroundService
    {
        private readonly ILogger<ChamadaEsp32Service> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromSeconds(10);

        public ChamadaEsp32Service(ILogger<ChamadaEsp32Service> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Serviço de execução periódica iniciado.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Aqui você coloca sua função que será executada
                    await MinhaFuncaoPeriodica();

                    _logger.LogInformation("Função executada em: {time}", DateTimeOffset.Now);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao executar a função periódica");
                }

                // Espera o intervalo antes da próxima execução
                await Task.Delay(_interval, stoppingToken);
            }
        }

        private Task MinhaFuncaoPeriodica()
        {
            // Exemplo: apenas logando
            _logger.LogInformation("Executando tarefa periódica...");
            return Task.CompletedTask;
        }
    }
}
