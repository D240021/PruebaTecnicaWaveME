export const validarImagen = (imagen) => {
    return imagen.type.startsWith("image/");
};

export const formatearFecha = (fecha) => {
    return fecha.split('T')[0];
}