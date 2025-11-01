using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api_soil_breath.DTOs
{
    public class SoloCreateDTO
    {
        [Required (ErrorMessage = "Identificação é obrigatória!")]
        [MaxLength(50)]
        [MinLength(1)]
        public string Identificacao { get; set; }

        [Required(ErrorMessage = "Nível de Nitrogênio é obrigatório!")]
        public double Nitrogenio { get; set; }

        [Required(ErrorMessage = "Nível de Fósforo é obrigatório!")]
        public double Fosforo { get; set; }

        [Required(ErrorMessage = "Nível de Potássio é obrigatório!")]
        public double Potassio { get; set; }

        [Required(ErrorMessage = "Nível de Umidade é obrigatório!")]
        public double Umidade { get; set; }

        [Required(ErrorMessage = "Id da Cultura é obrigatório!")]
        public int IdCultura { get; set; }

        [Required(ErrorMessage = "Id da Propriedade é obrigatório!")]
        public int IdPropriedade { get; set; }
    }

    public class SoloUpdateDTO : SoloCreateDTO
    {

    }

    public class SoloResponseEspDTO
    {
        [JsonPropertyName("npkSensorId")]
        public int IdSensor { get; set; }

        [JsonPropertyName("nitrogenio")]
        public float Nitrogenio { get; set; }

        [JsonPropertyName("fosforo")]
        public float Fosforo { get; set; }

        [JsonPropertyName("potassio")]
        public float Potassio { get; set; }

        [JsonPropertyName("unidadeNpk")]
        public string UnidadeNpk { get; set; }

        [JsonPropertyName("lastUpdate")]
        public long LastUpdate { get; set; }

        [JsonPropertyName("moistureSensorId")]
        public int MoistureSensorId { get; set; }

        [JsonPropertyName("umidadeSolo")]
        public float UmidadeSolo { get; set; }

        [JsonPropertyName("unidadeUmidade")]
        public string UnidadeUmidade { get; set; }

        [JsonPropertyName("lastUpdateUmidade")]
        public long LastUpdateUmidade { get; set; }

        [JsonPropertyName("uptime")]
        public int Uptime { get; set; }
    }


}
