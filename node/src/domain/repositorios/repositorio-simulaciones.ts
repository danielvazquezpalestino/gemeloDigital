import DtoConsultarSimulaciones = require('../entidades/dtos/simulaciones/consultar-simulaciones.dto');
import DtoCrearSimulacion = require('../entidades/dtos/simulaciones/crear-simulacion.dto');
import DtoRecalcularSimulacion = require('../entidades/dtos/simulaciones/recalcular-simulacion.dto');
import HistorialSimulaciones = require('../entidades/historial-simulaciones.entidad');
import Simulacion = require('../entidades/simulacion.entidad');

/**
 * Puerto (contrato) del módulo de simulaciones: casos de uso de negocio.
 * La implementación concreta vive en `infrastructure/repositorios`.
 */
abstract class RepositorioSimulaciones
{
    abstract crear(dto: DtoCrearSimulacion): Promise<Simulacion>;

    abstract obtenerPorId(id: number): Promise<Simulacion>;

    abstract obtenerHistorial(filtros: DtoConsultarSimulaciones): Promise<HistorialSimulaciones>;

    abstract eliminarPorId(id: number): Promise<void>;

    abstract recalcular(id: number, dto: DtoRecalcularSimulacion): Promise<Simulacion>;
}

export = RepositorioSimulaciones;
