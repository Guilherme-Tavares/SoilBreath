using System.ComponentModel.DataAnnotations;

namespace api_soil_breath.DTOs
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
        public int IdSensor { get; set; }
        public float Nitrogenio { get; set; }
        public float Fosforo { get; set; }
        public float Potassio { get; set; }
    }

}
