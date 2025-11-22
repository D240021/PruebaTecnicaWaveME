using Datos.Interfaces;
using Dominio;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using PruebaTecnicaWaveME.DTOs.Pelicula;



namespace PruebaTecnicaWaveME.Controllers
{

    [ApiController]
    [Route("/pelicula")]
    public class PeliculaController : ControllerBase
    {
        private readonly IPeliculaServicio peliculaServicio;

        public PeliculaController(IPeliculaServicio peliculaServicio)
        {
            this.peliculaServicio = peliculaServicio;
        }

        [HttpPost]
        public async Task<ActionResult<Boolean>> Agregar( [FromBody] CrearPeliculaDTO crearPeliculaDTO)
        {
            Pelicula peliculaAIngresar = PeliculaDTOMapper.ObtenerPeliculaDeCrearPeliculaDTO(crearPeliculaDTO);

            return  StatusCode(201,await  this.peliculaServicio.Agregar(peliculaAIngresar));

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PeliculaLecturaDTO>>> ObtenerTodos()
        {
            IEnumerable<Pelicula> peliculasBD = await  this.peliculaServicio.ObtenerTodos();

            return StatusCode(200, PeliculaDTOMapper.ObtenerPeliculasLecturaDTODePeliculas(peliculasBD));
        }

        [HttpGet("/{id}")]
        public async Task<ActionResult<PeliculaLecturaDTO>> ObtenerPorId( [FromRoute] int id)
        {
            return StatusCode(200, PeliculaDTOMapper.ObtenerPeliculaLecturaDTOdePelicula(await this.peliculaServicio.ObtenerPorId(id)));
        }

        [HttpPut]
        public async Task<ActionResult<PeliculaLecturaDTO>> Actualizar( [FromBody] PeliculaActualizacionDTO peliculaActualizacionDTO) { 
            Pelicula pelicula = PeliculaDTOMapper.ObtenerPeliculaDePeliculaActualizacionDTO(peliculaActualizacionDTO);

            Pelicula peliculaActualizada = await this.peliculaServicio.Actualizar(pelicula);

            return StatusCode(200, PeliculaDTOMapper.ObtenerPeliculaLecturaDTOdePelicula(peliculaActualizada));

        }

        [HttpDelete("{id:int}/fisico")]
        public async Task<ActionResult> EliminarFisico([FromRoute] int id)
        {
            bool eliminado = await this.peliculaServicio.EliminarFisicamentePorId(id);

            if (!eliminado)
                return NotFound($"No se encontró la película con id {id}");

            return NoContent(); // 204
        }

        [HttpDelete("{id:int}/logico")]
        public async Task<ActionResult> EliminarLogico([FromRoute] int id)
        {
            bool eliminado = await this.peliculaServicio.EliminarLogicamentePorId(id);

            if (!eliminado)
                return NotFound($"No se encontró la película con id {id}");

            return Ok($"Película con id {id} eliminada lógicamente");
        }


    }
}
