using api_soil_breath.DTOs;
using api_soil_breath.Entity;
using api_soil_breath.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var solos = await _soloService.GetAll(id);
                return Ok(solos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar solos: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var idUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var solo = await _soloService.GetById(id, idUser);
                return Ok(solo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar solo: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] SoloUpdateDTO dto)
        {
            try
            {
                var idUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var solo = new Solo
                {
                    Id = id,
                    Identificacao = dto.Identificacao,
                    Nitrogenio = dto.Nitrogenio,
                    Fosforo = dto.Fosforo,
                    Potassio = dto.Potassio
                };
                var soloResult = await _soloService.Update(solo, idUser);
                return Ok(soloResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar solo: {ex.Message}");
            }
        }

        /*
            [HttpPost]
            [Authorize]
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
        */
        
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var idUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                await _soloService.Delete(id, idUser);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao deletar solo: {ex.Message}");
            }
        }
    }
}
