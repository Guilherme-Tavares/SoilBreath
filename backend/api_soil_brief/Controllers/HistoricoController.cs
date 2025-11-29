using api_soil_brief.DTOs;
using api_soil_brief.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace api_soil_brief.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HistoricoController : ControllerBase
    {
        private readonly HistoricoService _historicoService;
        private readonly SoloService _soloService;

        public HistoricoController(HistoricoService historicoService, SoloService soloService)
        {
            _historicoService = historicoService;
            _soloService = soloService;
        }

        // GET api/Historico/ultimo
        [HttpGet("ultimo")]
        public async Task<IActionResult> GetUltimoRegistro()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var solos = await _soloService.GetAll(userId);

                if (!solos.Any())
                    return NotFound("Nenhum solo encontrado para o usuário.");

                var soloId = solos.First().Id;
                var resultado = await _historicoService.GetUltimoRegistro(soloId);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar último registro: {ex.Message}");
            }
        }

        // GET api/Historico/diario?data=2025-11-27
        [HttpGet("diario")]
        public async Task<IActionResult> GetDadosDiarios([FromQuery] DateTime data)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var solos = await _soloService.GetAll(userId);

                if (!solos.Any())
                    return NotFound("Nenhum solo encontrado para o usuário.");

                var soloId = solos.First().Id;
                var resultado = await _historicoService.GetDadosDiarios(soloId, data);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar dados diários: {ex.Message}");
            }
        }

        // GET api/Historico/mensal?mes=11&ano=2025
        [HttpGet("mensal")]
        public async Task<IActionResult> GetDadosMensais([FromQuery] int mes, [FromQuery] int ano)
        {
            try
            {
                if (mes < 1 || mes > 12)
                    return BadRequest("Mês inválido. Deve estar entre 1 e 12.");

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var solos = await _soloService.GetAll(userId);

                if (!solos.Any())
                    return NotFound("Nenhum solo encontrado para o usuário.");

                var soloId = solos.First().Id;
                var resultado = await _historicoService.GetDadosMensais(soloId, mes, ano);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar dados mensais: {ex.Message}");
            }
        }

        // GET api/Historico/anual?ano=2025
        [HttpGet("anual")]
        public async Task<IActionResult> GetDadosAnuais([FromQuery] int ano)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var solos = await _soloService.GetAll(userId);

                if (!solos.Any())
                    return NotFound("Nenhum solo encontrado para o usuário.");

                var soloId = solos.First().Id;
                var resultado = await _historicoService.GetDadosAnuais(soloId, ano);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar dados anuais: {ex.Message}");
            }
        }
    }
}
