using api_soil_breath.DTO;
using api_soil_breath.Entity;
using api_soil_breath.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

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

        [HttpPatch()]
        [Authorize]
        public async Task<IActionResult> Update(UsuarioUpdateDTO usuarioUpdateDTO)
        {
            try
            {
                var id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var usuario = new Usuario
                {
                    Id = id,
                    Nome = usuarioUpdateDTO.Nome,
                    Email = usuarioUpdateDTO.Email,
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioUpdateDTO.Senha)
                };

                var usuarioResult = await _usuarioService.Update(usuario);
                return Ok(usuarioResult);
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
