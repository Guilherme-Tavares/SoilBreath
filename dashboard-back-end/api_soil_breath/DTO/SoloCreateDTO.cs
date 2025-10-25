namespace api_soil_breath.DTOs
{
    public class SoloCreateDTO
    {
        public string Identificacao { get; set; }
        public double Nitrogenio { get; set; }
        public double Fosforo { get; set; }
        public double Potassio { get; set; }

        public int IdCultura { get; set; }
        public int IdPropriedade { get; set; }
    }
}
