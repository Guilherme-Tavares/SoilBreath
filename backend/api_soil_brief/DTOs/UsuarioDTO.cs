using System.ComponentModel.DataAnnotations;

namespace api_soil_brief.DTO
{
    public class UsuarioCreateDTO
    {
        [Required(ErrorMessage = "Nome é obrigatório!")]
        [MaxLength(255)]
        [MinLength(3)]
        public string Nome { get; set; }

        [MaxLength(255)]
        [EmailAddress(ErrorMessage = "Email inválido!")]
        public string Email { get; set; }

        [MaxLength(255)]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$",
        ErrorMessage = "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.")]
        public string Senha { get; set; }
    }

    public class UsuarioUpdateDTO : UsuarioCreateDTO { }

    public class UsuarioLoginDTO
    {
        [EmailAddress(ErrorMessage = "Email inválido!")]
        public string Email { get; set; }

        [Required (ErrorMessage = "Senha é obrigatória!")]
        public string Senha { get; set; }
    }

}
