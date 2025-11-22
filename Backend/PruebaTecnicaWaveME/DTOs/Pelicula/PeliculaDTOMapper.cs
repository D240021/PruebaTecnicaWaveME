namespace PruebaTecnicaWaveME.DTOs.Pelicula
{
    using Datos.Modelos;
    using Dominio;
    public class PeliculaDTOMapper
    {

        public static Pelicula ObtenerPeliculaDeCrearPeliculaDTO(CrearPeliculaDTO crearPeliculaDTO)
        {
            return new Pelicula()
            {
                Nombre = crearPeliculaDTO.Nombre,
                Descripcion = crearPeliculaDTO.Descripcion,
                FechaSalida = crearPeliculaDTO.FechaSalida,
                EsBorrado = false,
                UrlImagen = crearPeliculaDTO.UrlImagen
            };
        }

        public static IEnumerable<PeliculaLecturaDTO> ObtenerPeliculasLecturaDTODePeliculas(IEnumerable<Pelicula> peliculas)
        {
            return peliculas.Select(pelicula => new PeliculaLecturaDTO()
            {
                Id = pelicula.Id,
                Nombre = pelicula.Nombre,
                Descripcion = pelicula.Descripcion,
                FechaSalida = pelicula.FechaSalida,
                EsBorrado = false,
                UrlImagen = pelicula.UrlImagen
            });
        }

        public static PeliculaLecturaDTO ObtenerPeliculaLecturaDTOdePelicula(Pelicula pelicula)
        {
            return new PeliculaLecturaDTO()
            {
                Id = pelicula.Id,
                Nombre = pelicula.Nombre,
                Descripcion = pelicula.Descripcion,
                FechaSalida = pelicula.FechaSalida,
                EsBorrado = false,
                UrlImagen = pelicula.UrlImagen
            };
        }

        public static Pelicula ObtenerPeliculaDePeliculaActualizacionDTO(PeliculaActualizacionDTO peliculaActualizacionDTO)
        {
            return new Pelicula()
            {
                Id = peliculaActualizacionDTO.Id,
                Nombre = peliculaActualizacionDTO.Nombre,
                Descripcion = peliculaActualizacionDTO.Descripcion,
                FechaSalida = peliculaActualizacionDTO.FechaSalida,
                UrlImagen = peliculaActualizacionDTO.UrlImagen
            };
        }



    }
}
