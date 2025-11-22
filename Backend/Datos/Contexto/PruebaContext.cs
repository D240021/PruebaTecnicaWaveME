using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Datos.Modelos;
using Microsoft.EntityFrameworkCore;

namespace Datos.Contexto
{
    public class PruebaContext : DbContext
    {

        public PruebaContext(DbContextOptions<PruebaContext> options) : base(options) { }

        public DbSet<PeliculaDA> Pelicula { get; set; }


    }
}
