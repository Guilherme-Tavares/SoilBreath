using api_soil_brief.DTOs;
using api_soil_brief.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_soil_brief.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CulturaController : ControllerBase
    {
        private readonly CulturaService _culturaService;

        public CulturaController(CulturaService culturaService)
        {
            _culturaService = culturaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var culturas = await _culturaService.GetAll();
                var culturasDTO = culturas.Select(c => new CulturaDTO
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    Nitrogenio = c.Nitrogenio,
                    Fosforo = c.Fosforo,
                    Potassio = c.Potassio,
                    Umidade = c.Umidade,
                    Temperatura = c.Temperatura
                }).ToList();

                return Ok(culturasDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar culturas: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var cultura = await _culturaService.GetById(id);
                var culturaDTO = new CulturaDTO
                {
                    Id = cultura.Id,
                    Nome = cultura.Nome,
                    Nitrogenio = cultura.Nitrogenio,
                    Fosforo = cultura.Fosforo,
                    Potassio = cultura.Potassio,
                    Umidade = cultura.Umidade,
                    Temperatura = cultura.Temperatura
                };

                return Ok(culturaDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar cultura: {ex.Message}");
            }
        }

        [HttpGet("aptidao/solo/{soloId}")]
        public async Task<IActionResult> GetAptidoesPorSolo(int soloId)
        {
            try
            {
                var aptidoes = await _culturaService.CalcularAptidoesSolo(soloId);
                return Ok(aptidoes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao calcular aptidões: {ex.Message}");
            }
        }
    }
}
