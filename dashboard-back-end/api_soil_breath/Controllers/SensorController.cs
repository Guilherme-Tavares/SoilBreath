using api_soil_breath.DTO;
using api_soil_breath.DTOs;
using api_soil_breath.Entity;
using api_soil_breath.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_soil_breath.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorController : ControllerBase
    {
        private readonly SensorService _sensorService;

        public SensorController(SensorService sensorService)
        {
            _sensorService = sensorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int idPropriedade)
        {
            try
            {
                var sensores = await _sensorService.GetAll(idPropriedade);
                return Ok(sensores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar sensores: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var sensor = await _sensorService.GetById(id);
                return Ok(sensor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar sensor: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SensorUpdateDTO dto)
        {
            try
            {
                var sensor = new Sensor
                {
                    Id = id,
                    IdSensor = dto.IdSensor,
                    SoloId = dto.SoloId,
                };

                var sensorResult = await _sensorService.Update(sensor);
                return Ok(sensorResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar sensor: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SensorCreateDTO dto)
        {
            try
            {
                var sensor = new Sensor
                {
                    IdSensor = dto.IdSensor,
                    SoloId = dto.SoloId,
                };

                var sensorResult = _sensorService.Create(sensor);
                return Created();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao cadastrar sensor: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _sensorService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao deletar sensor: {ex.Message}");
            }
        }
    }
}
