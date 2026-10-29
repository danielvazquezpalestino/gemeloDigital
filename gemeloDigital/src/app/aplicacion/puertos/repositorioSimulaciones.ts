import { consultaSimulaciones } from '../../dominio/entidades/consultaSimulaciones.entidad';
import { simulacionSolar } from '../../dominio/entidades/simulacionSolar.entidad';
import { tipoTarifa } from '../../dominio/objetosValor/tipoTarifa';

/**
 * Datos para crear una simulación solar.
 */
export interface datosCrearSimulacion
{
    readonly municipioId: number;
    readonly consumoKwh: number;
    readonly tarifaCfe: number;
    readonly areaDisponibleM2?: number | null;
    readonly tipoTarifa?: tipoTarifa | null;
    readonly incluyeBaterias?: boolean | null;
}

/**
 * Filtros del historial de simulaciones.
 */
export interface filtrosSimulaciones
{
    readonly municipioId?: number | null;
    readonly pagina?: number;
    readonly limite?: number;
}

/**
 * Cambios parciales de una simulación. Al menos uno debe estar presente.
 */
export interface cambiosSimulacion
{
    municipioId?: number;
    consumoKwh?: number;
    tarifaCfe?: number;
    areaDisponibleM2?: number | null;
    tipoTarifa?: tipoTarifa | null;
    incluyeBaterias?: boolean | null;
}

/**
 * Puerto de acceso al registro de simulaciones solares.
 */
export abstract class repositorioSimulaciones
{
    abstract crear(datos: datosCrearSimulacion): Promise<simulacionSolar>;

    abstract listar(filtros: filtrosSimulaciones): Promise<consultaSimulaciones>;

    abstract obtener(id: number): Promise<simulacionSolar>;

    abstract eliminar(id: number): Promise<void>;

    abstract recalcular(id: number, cambios: cambiosSimulacion): Promise<simulacionSolar>;
}
