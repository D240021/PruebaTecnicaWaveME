namespace PruebaTecnicaWaveME.DTOs.Pelicula
{
    public class PeliculaLecturaDTO
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string Descripcion { get; set; }

        public DateTime FechaSalida { get; set; }

        public bool EsBorrado { get; set; }

        public string UrlImagen { get; set; }


    }
}
