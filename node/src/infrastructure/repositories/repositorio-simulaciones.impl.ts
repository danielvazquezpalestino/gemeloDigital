import CalculadoraSimulacionSolar = require('../../domain/servicios/calculadora-simulacion-solar');
import DtoConsultarSimulaciones = require('../../domain/entities/dtos/simulaciones/consultar-simulaciones.dto');
import DtoCrearSimulacion = require('../../domain/entities/dtos/simulaciones/crear-simulacion.dto');
import DtoRecalcularSimulacion = require('../../domain/entities/dtos/simulaciones/recalcular-simulacion.dto');
import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import FuenteDatosSimulaciones = require('../../domain/datasources/fuente-datos-simulaciones');
import HistorialSimulaciones = require('../../domain/entities/historial-simulaciones.entidad');
import RepositorioSimulaciones = require('../../domain/repositories/repositorio-simulaciones');
import Simulacion = require('../../domain/entities/simulacion.entidad');

/**
 * Implementación de los casos de uso de simulaciones.
 *
 * Aquí se decide qué se guarda: el modelo de cálculo del dominio determina
 * los valores derivados y esta capa los persiste a través del puerto de
 * fuente de datos.
 */
class RepositorioSimulacionesImpl implements RepositorioSimulaciones
{
    constructor
    (
        private readonly fuenteDatos: FuenteDatosSimulaciones,
        private readonly calculadora: CalculadoraSimulacionSolar,
    )
    {
    }

    async crear(dto: DtoCrearSimulacion): Promise<Simulacion>
    {
        const resultado = this.calculadora.calcular(dto.consumoKwh, dto.tarifaCfe, dto.areaDisponibleM2, dto.incluyeBaterias, dto.tipoTarifa);
        const ahora = new Date();

        const simulacion = new Simulacion(
            0,
            dto.municipioId,
            dto.consumoKwh,
            dto.tarifaCfe,
            dto.areaDisponibleM2,
            dto.tipoTarifa,
            dto.incluyeBaterias,
            resultado.panelesNecesarios,
            resultado.produccionAnual,
            resultado.ahorroEstimado,
            resultado.costoInversionTotal,
            resultado.retornoInversionAnios,
            resultado.advertencias,
            ahora,
            ahora,
        );

        return this.fuenteDatos.insertar(simulacion);
    }

    async obtenerPorId(id: number): Promise<Simulacion>
    {
        const simulacion = await this.fuenteDatos.buscarPorId(id);

        if (!simulacion)
        {
            throw ErrorPersonalizado.noEncontrado('La simulación solicitada no existe');
        }

        return simulacion;
    }

    async obtenerHistorial(filtros: DtoConsultarSimulaciones): Promise<HistorialSimulaciones>
    {
        const municipioId = filtros.municipioId ?? null;
        const total = await this.fuenteDatos.contar(municipioId);
        const desplazamiento = (filtros.pagina - 1) * filtros.limite;
        const simulaciones = await this.fuenteDatos.listar(municipioId, filtros.limite, desplazamiento);

        return new HistorialSimulaciones(total, filtros.pagina, filtros.limite, simulaciones);
    }

    async eliminarPorId(id: number): Promise<void>
    {
        const eliminada = await this.fuenteDatos.eliminarPorId(id);

        if (!eliminada)
        {
            throw ErrorPersonalizado.noEncontrado('La simulación solicitada no existe');
        }
    }

    async recalcular(id: number, dto: DtoRecalcularSimulacion): Promise<Simulacion>
    {
        const actual = await this.fuenteDatos.buscarPorId(id);

        if (!actual)
        {
            throw ErrorPersonalizado.noEncontrado('La simulación solicitada no existe');
        }

        const municipioId = dto.municipioId ?? actual.municipioId;
        const consumoKwh = dto.consumoKwh ?? actual.consumoKwh;
        const tarifaCfe = dto.tarifaCfe ?? actual.tarifaCfe;
        const areaDisponibleM2 = dto.areaDisponibleM2 === undefined ? actual.areaDisponibleM2 : dto.areaDisponibleM2;
        const tipoTarifa = dto.tipoTarifa ?? actual.tipoTarifa;
        const incluyeBaterias = dto.incluyeBaterias ?? actual.incluyeBaterias;

        const resultado = this.calculadora.calcular(consumoKwh, tarifaCfe, areaDisponibleM2, incluyeBaterias, tipoTarifa);

        const actualizada = new Simulacion(
            actual.id,
            municipioId,
            consumoKwh,
            tarifaCfe,
            areaDisponibleM2,
            tipoTarifa,
            incluyeBaterias,
            resultado.panelesNecesarios,
            resultado.produccionAnual,
            resultado.ahorroEstimado,
            resultado.costoInversionTotal,
            resultado.retornoInversionAnios,
            resultado.advertencias,
            actual.fechaCreacion,
            new Date(),
        );

        return this.fuenteDatos.actualizar(actualizada);
    }
}

export = RepositorioSimulacionesImpl;
