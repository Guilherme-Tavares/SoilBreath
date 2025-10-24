using api_soil_breath.DTO;
using api_soil_breath.Entity;
using api_soil_breath.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_soil_breath.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public UsuarioController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(UsuarioCreateDTO usuarioCreateDTO)
        {
            try
            {
                var usuario = new Usuario
                {
                    Nome = usuarioCreateDTO.Nome,
                    Email = usuarioCreateDTO.Email,
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioCreateDTO.Senha)
                };

                var usuarioResult = _usuarioService.Create(usuario);
                return Created();
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Erro ao cadastrar usuario: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(int id, UsuarioUpdateDTO usuarioUpdateDTO)
        {
            try
            {
                var usuario = new Usuario
                {
                    Id = id,
                    Nome = usuarioUpdateDTO.Nome,
                    Email = usuarioUpdateDTO.Email,
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioUpdateDTO.Senha)
                };

                var usuarioResult = _usuarioService.Update(usuario);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao cadastrar usuario: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UsuarioLoginDTO usuarioLoginDTO)
        {
            try
            {
                var loginResult = await _usuarioService.Login(usuarioLoginDTO.Email, usuarioLoginDTO.Senha);
                return Ok(loginResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao realizar login: {ex.Message}");
            }
        }
    }
}
