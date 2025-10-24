using System.ComponentModel.DataAnnotations.Schema;

namespace api_soil_breath.Entity
{
    [Table("Solo")]
    public class Solo
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("identificacao")]
        public string Identificacao { get; set; }
        [Column("nitrogenio")]
        public double Nitrogenio { get; set; }
        [Column("fosforo")]
        public double Fosforo { get; set; }
        [Column("potassio")]
        public double Potassio { get; set; }
    }
}
