import express = require('express');
import RepositorioUbicaciones = require('../../domain/repositories/repositorio-ubicaciones');

class ControladorUbicaciones {
    constructor(
        private readonly repositorioUbicaciones: RepositorioUbicaciones,
    ) {}

    obtenerMunicipios = async (req: express.Request, res: express.Response) => {
        try {
            const municipios = await this.repositorioUbicaciones.obtenerMunicipios();
            return res.json({ mensaje: 'Municipios de Puebla obtenidos correctamente', municipios });
        }
        catch (error) {
            // El detalle real solo se registra en el servidor; el cliente recibe un mensaje genérico.
            console.error('Error al obtener los municipios de Puebla:', error);
            return res.status(500).json({ mensaje: 'No se pudieron obtener los municipios' });
        }
    };
}

export = ControladorUbicaciones;
