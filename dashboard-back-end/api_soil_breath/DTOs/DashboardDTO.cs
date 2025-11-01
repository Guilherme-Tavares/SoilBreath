
namespace api_soil_breath.DTOs
{
    public class DashboardDTO
    {
        public int UsuarioId { get; set; }
        public List<DashboardSoloDTO> Solos { get; set; } = new();
    }

    public class DashboardSoloDTO
    {
        public int IdSolo { get; set; }
        public string Identificacao { get; set; } = string.Empty;
        public string CulturaNome { get; set; } = string.Empty;

        public double FosforoPct { get; set; }
        public double PotassioPct { get; set; }
        public double NitrogenioPct { get; set; }
        public double MediaPct { get; set; }
    }
}