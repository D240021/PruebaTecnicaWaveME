using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Datos.Contexto;
using Datos.Interfaces;
using Datos.Modelos;
using Dominio;
using Microsoft.EntityFrameworkCore;

namespace Datos.Acciones
{
    public class GestionarPelicula : IPeliculaServicio
    {

        private readonly PruebaContext _context;

        public GestionarPelicula(PruebaContext context)
        {
            this._context = context;
        }

        public async Task<Pelicula> Actualizar(Pelicula pelicula)
        {
            PeliculaDA peliculaExiste = await _context
                .Pelicula
                .FirstOrDefaultAsync(p => p.Id == pelicula.Id);

            if (peliculaExiste == null)
                return null;

            peliculaExiste.Nombre = pelicula.Nombre;
            peliculaExiste.Descripcion = pelicula.Descripcion;
            peliculaExiste.FechaSalida = pelicula.FechaSalida;
            peliculaExiste.EsBorrado = pelicula.EsBorrado;
            peliculaExiste.UrlImagen = pelicula.UrlImagen;

            await _context.SaveChangesAsync();

            return new Pelicula
            {
                Id = peliculaExiste.Id,
                Nombre = peliculaExiste.Nombre,
                Descripcion = peliculaExiste.Descripcion,
                FechaSalida = peliculaExiste.FechaSalida,
                EsBorrado = peliculaExiste.EsBorrado,
                UrlImagen = peliculaExiste.UrlImagen
            };
        }

        public async Task<bool> Agregar(Pelicula pelicula)
        {
            PeliculaDA peliculaDA = new PeliculaDA
            {
                Nombre = pelicula.Nombre,
                Descripcion = pelicula.Descripcion,
                FechaSalida = pelicula.FechaSalida,
                EsBorrado = pelicula.EsBorrado,
                UrlImagen = pelicula.UrlImagen
            };

            await _context.Pelicula.AddAsync(peliculaDA);

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> EliminarFisicamentePorId(int id)
        {
            PeliculaDA peliculaExiste = await _context.Pelicula
                .FirstOrDefaultAsync(p => p.Id == id);

            if (peliculaExiste == null)
                return false;

            _context.Pelicula.Remove(peliculaExiste);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> EliminarLogicamentePorId(int id)
        {
            PeliculaDA peliculaExiste = await _context.Pelicula
                .FirstOrDefaultAsync(p => p.Id == id);

            if (peliculaExiste == null)
                return false;

            peliculaExiste.EsBorrado = true;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Pelicula> ObtenerPorId(int id)
        {
            var resultado = await _context.Pelicula
                .Where(p => p.Id == id)
                .Select(p => new Pelicula
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    FechaSalida = p.FechaSalida,
                    EsBorrado = p.EsBorrado,
                    UrlImagen = p.UrlImagen
                })
                .FirstOrDefaultAsync();

            return resultado;
        }

        public async Task<IEnumerable<Pelicula>> ObtenerTodos()
        {
            return await _context.Pelicula
                .Where(peli => peli.EsBorrado == false)
                .Select(p => new Pelicula
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    FechaSalida = p.FechaSalida,
                    EsBorrado = p.EsBorrado,
                    UrlImagen = p.UrlImagen
                })
                .ToListAsync();
        }
    }
}
