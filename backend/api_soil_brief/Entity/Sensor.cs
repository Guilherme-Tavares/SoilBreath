using System.ComponentModel.DataAnnotations.Schema;

namespace api_soil_brief.Entity
{
    [Table("Sensor")]
    public class Sensor
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("id_sensor")]
        public string IdSensor { get; set; }

        [Column("solo_id")]
        public int SoloId { get; set; }

        public Solo Solo { get; set; }
    }
}
