using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dominio;

namespace Datos.Interfaces
{
    public interface IPeliculaServicio
    {

        Task<Boolean> Agregar(Pelicula pelicula);

        Task<IEnumerable<Pelicula>> ObtenerTodos();

        Task<Pelicula> ObtenerPorId(int id);

        Task<Pelicula> Actualizar(Pelicula pelicula);

        Task<Boolean> EliminarFisicamentePorId(int id);

        Task<Boolean> EliminarLogicamentePorId(int id);

    }
}
