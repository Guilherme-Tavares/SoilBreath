using api_soil_breath.DTOs;
using api_soil_breath.Entity;
using api_soil_breath.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_soil_breath.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SoloController : ControllerBase
    {
        private readonly SoloService _soloService;

        public SoloController(SoloService soloService)
        {
            _soloService = soloService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int idPropriedade)
        {
            try
            {
                var solos = await _soloService.GetAll(idPropriedade);
                return Ok(solos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar solos: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var solo = await _soloService.GetById(id);
                return Ok(solo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar solo: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SoloUpdateDTO dto)
        {
            try
            {
                var solo = new Solo
                {
                    Id = id,
                    Identificacao = dto.Identificacao,
                    Nitrogenio = dto.Nitrogenio,
                    Fosforo = dto.Fosforo,
                    Potassio = dto.Potassio
                };

                var soloResult = await _soloService.Update(solo);
                return Ok(soloResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar solo: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SoloCreateDTO dto)
        {
            try
            {
                var solo = new Solo
                {
                    Identificacao = dto.Identificacao,
                    Nitrogenio = dto.Nitrogenio,
                    Fosforo = dto.Fosforo,
                    Potassio = dto.Potassio,
                    CulturaId = dto.IdCultura,
                    PropriedadeId = dto.IdPropriedade
                };

                var soloResult = _soloService.Create(solo);
                return Created();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao cadastrar solo: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deleete(int id)
        {
            try
            {
                await _soloService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao deletar solo: {ex.Message}");
            }
        }
    }
}
