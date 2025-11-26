namespace api_soil_breath.DTOs
{
    public class AptidaoDTO
    {
        public int CulturaId { get; set; }
        public string CulturaNome { get; set; } = string.Empty;
        public double NitrogenioPct { get; set; }
        public double FosforoPct { get; set; }
        public double PotassioPct { get; set; }
        public double MediaPct { get; set; }
    }

    public class AptidaoSoloDTO
    {
        public int SoloId { get; set; }
        public string SoloIdentificacao { get; set; } = string.Empty;
        public double Nitrogenio { get; set; }
        public double Fosforo { get; set; }
        public double Potassio { get; set; }
        public List<AptidaoDTO> Aptidoes { get; set; } = new();
    }
}
