namespace api_soil_brief.DTOs
{
    // DTO para retornar um registro histórico individual
    public class HistoricoDTO
    {
        public int Id { get; set; }
        public DateTime Data { get; set; }
        public double NitrogenioMedio { get; set; }
        public double FosforoMedio { get; set; }
        public double PotassioMedio { get; set; }
        public double UmidadeMedia { get; set; }
        public double TemperaturaMedia { get; set; }
        public int QuantidadeLeituras { get; set; }
        public int SoloId { get; set; }
    }

    // DTO para retornar dados diários
    public class HistoricoDiarioDTO
    {
        public DateTime Data { get; set; }
        public double Nitrogenio { get; set; }
        public double Fosforo { get; set; }
        public double Potassio { get; set; }
        public double Umidade { get; set; }
        public double Temperatura { get; set; }
        public bool TemDados { get; set; }
    }

    // DTO para retornar dados mensais
    public class HistoricoMensalDTO
    {
        public int Mes { get; set; }
        public int Ano { get; set; }
        public string? MesNome { get; set; }
        public double NitrogenioMedio { get; set; }
        public double FosforoMedio { get; set; }
        public double PotassioMedio { get; set; }
        public double UmidadeMedia { get; set; }
        public double TemperaturaMedia { get; set; }
        public int TotalDias { get; set; }
        public bool TemDados { get; set; }
    }

    // DTO para retornar dados anuais
    public class HistoricoAnualDTO
    {
        public int Ano { get; set; }
        public double NitrogenioMedio { get; set; }
        public double FosforoMedio { get; set; }
        public double PotassioMedio { get; set; }
        public double UmidadeMedia { get; set; }
        public double TemperaturaMedia { get; set; }
        public int TotalDias { get; set; }
        public bool TemDados { get; set; }
    }

    // DTO para retornar último registro
    public class UltimoRegistroDTO
    {
        public DateTime? Data { get; set; }
        public bool TemRegistros { get; set; }
    }
}
