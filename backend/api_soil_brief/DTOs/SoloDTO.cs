using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api_soil_brief.DTOs
{
    public class SoloCreateDTO
    {
        [Required (ErrorMessage = "Identifica��o � obrigat�ria!")]
        [MaxLength(50)]
        [MinLength(1)]
        public string Identificacao { get; set; }

        [Required(ErrorMessage = "N�vel de Nitrog�nio � obrigat�rio!")]
        public double Nitrogenio { get; set; }

        [Required(ErrorMessage = "N�vel de F�sforo � obrigat�rio!")]
        public double Fosforo { get; set; }

        [Required(ErrorMessage = "N�vel de Pot�ssio � obrigat�rio!")]
        public double Potassio { get; set; }

        [Required(ErrorMessage = "N�vel de Umidade � obrigat�rio!")]
        public double Umidade { get; set; }

        [Required(ErrorMessage = "Id da Cultura � obrigat�rio!")]
        public int IdCultura { get; set; }

        [Required(ErrorMessage = "Id da Propriedade � obrigat�rio!")]
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

        [JsonPropertyName("temperatura")]
        public float Temperatura { get; set; }

        [JsonPropertyName("unidadeUmidade")]
        public string UnidadeUmidade { get; set; }

        [JsonPropertyName("lastUpdateUmidade")]
        public long LastUpdateUmidade { get; set; }

        [JsonPropertyName("uptime")]
        public int Uptime { get; set; }
    }


}
