using System.ComponentModel.DataAnnotations;

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
        public int IdSensor { get; set; }
        public float Nitrogenio { get; set; }
        public float Fosforo { get; set; }
        public float Potassio { get; set; }
    }

}
