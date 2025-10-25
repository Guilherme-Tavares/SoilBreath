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

        [Column("cultura_id")]
        public int CulturaId { get; set; }
        public Cultura Cultura { get; set; }

        [Column("propriedade_id")]
        public int PropriedadeId { get; set; }
        public Propriedade Propriedade { get; set; }

        public ICollection<Sensor> Sensores { get; set; }
        public ICollection<Propriedade> Propriedades { get; set; }
    }
}
