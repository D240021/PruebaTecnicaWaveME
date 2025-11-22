using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio
{
    public class Pelicula
    {

        public int Id { get; set; }

        public string Nombre { get; set;}

        public string Descripcion { get; set;}

        public DateTime FechaSalida { get; set;}

        public bool EsBorrado { get; set;}

        public string UrlImagen { get; set;}

    }
}
