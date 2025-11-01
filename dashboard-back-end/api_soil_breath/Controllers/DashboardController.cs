using api_soil_breath.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetDashboard()
    {
        try
        {
            var idUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var dashboard = await _dashboardService.GetDashboard(idUser);
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao gerar dashboard: {ex.Message}");
        }
    }

    [HttpGet("cultura/{culturaId}")]
    [Authorize]
    public async Task<IActionResult> GetDashboardByCultura(int culturaId)
    {
        try
        {
            var idUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var dashboard = await _dashboardService.GetDashboardByCultura(idUser, culturaId);
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao gerar dashboard para a cultura: {ex.Message}");
        }
    }
}
