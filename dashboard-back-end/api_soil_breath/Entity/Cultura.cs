using System.ComponentModel.DataAnnotations.Schema;

namespace api_soil_breath.Entity
{
    [Table("Cultura")]
    public class Cultura
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; }

        [Column("nitrogenio")]
        public double Nitrogenio { get; set; }

        [Column("fosforo")]
        public double Fosforo { get; set; }

        [Column("potassio")]
        public double Potassio { get; set; }

        [Column("umidade")]
        public double Umidade { get; set; }
    }
}
