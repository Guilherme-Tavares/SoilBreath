using System.ComponentModel.DataAnnotations.Schema;

namespace api_soil_brief.Entity
{
    [Table("Historico")]
    public class Historico
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("data")]
        public DateTime Data { get; set; }

        [Column("nitrogenio_medio")]
        public double NitrogenioMedio { get; set; }

        [Column("fosforo_medio")]
        public double FosforoMedio { get; set; }

        [Column("potassio_medio")]
        public double PotassioMedio { get; set; }

        [Column("umidade_media")]
        public double UmidadeMedia { get; set; }

        [Column("temperatura_media")]
        public double TemperaturaMedia { get; set; }

        [Column("quantidade_leituras")]
        public int QuantidadeLeituras { get; set; }

        [Column("solo_id")]
        public int SoloId { get; set; }
        public Solo Solo { get; set; }
    }
}
