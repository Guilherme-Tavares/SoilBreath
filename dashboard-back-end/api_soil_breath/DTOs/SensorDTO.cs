using System.ComponentModel.DataAnnotations;

namespace api_soil_breath.DTO
{
    public class SensorCreateDTO
    {
        [Required (ErrorMessage = "Id do Sensor é obrigatório!")]
        public string IdSensor { get; set; }

        [Required (ErrorMessage = "Id do Solo é obrigatório!")]
        public int SoloId { get; set; }
    }

    public class SensorUpdateDTO : SensorCreateDTO
    {

    }
}
