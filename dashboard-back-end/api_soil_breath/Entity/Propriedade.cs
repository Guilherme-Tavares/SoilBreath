using System.ComponentModel.DataAnnotations.Schema;

namespace api_soil_breath.Entity
{
    [Table("Propriedade")]
    public class Propriedade
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("nome")]
        public string Nome { get; set; }
        [Column("usuario_id")]
        public int UsuarioId { get; set; }

        public Usuario Usuario { get; set; }
    }
}
