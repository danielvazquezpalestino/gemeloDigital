import TipoTarifa = require('../../tipo-tarifa');
import ValidacionSimulacion = require('./validacion-simulacion');

/**
 * Datos de entrada para crear una simulación solar.
 *
 * Obligatorios: `municipioId`, `consumoKwh` (consumo anual) y `tarifaCfe`
 * (costo por kWh). Opcionales: `areaDisponibleM2` (superficie del techo),
 * `tipoTarifa` (por defecto `PDBT`) e `incluyeBaterias` (por defecto `false`).
 */
class DtoCrearSimulacion
{
    private constructor
    (
        public readonly municipioId: number,
        public readonly consumoKwh: number,
        public readonly tarifaCfe: number,
        public readonly areaDisponibleM2: number | null,
        public readonly tipoTarifa: TipoTarifa,
        public readonly incluyeBaterias: boolean,
    )
    {
    }

    static crear(datos: unknown): [string | undefined, DtoCrearSimulacion | undefined]
    {
        const objeto = ValidacionSimulacion.comoObjeto(datos);

        if (!objeto)
        {
            return ['Los datos de la simulación son inválidos', undefined];
        }

        if (objeto['municipioId'] === undefined || objeto['municipioId'] === null)
        {
            return ['El campo "municipioId" es obligatorio', undefined];
        }

        const [errorMunicipio, municipioId] = ValidacionSimulacion.leerEnteroPositivo(objeto['municipioId'], 'municipioId');

        if (errorMunicipio || municipioId === undefined)
        {
            return [errorMunicipio ?? 'El campo "municipioId" es inválido', undefined];
        }

        if (objeto['consumoKwh'] === undefined || objeto['consumoKwh'] === null)
        {
            return ['El campo "consumoKwh" es obligatorio', undefined];
        }

        const [errorConsumo, consumoKwh] = ValidacionSimulacion.leerNumeroPositivo(objeto['consumoKwh'], 'consumoKwh', ValidacionSimulacion.CONSUMO_MAXIMO_KWH);

        if (errorConsumo || consumoKwh === undefined)
        {
            return [errorConsumo ?? 'El campo "consumoKwh" es inválido', undefined];
        }

        if (objeto['tarifaCfe'] === undefined || objeto['tarifaCfe'] === null)
        {
            return ['El campo "tarifaCfe" es obligatorio', undefined];
        }

        const [errorTarifa, tarifaCfe] = ValidacionSimulacion.leerNumeroPositivo(objeto['tarifaCfe'], 'tarifaCfe', ValidacionSimulacion.TARIFA_MAXIMA);

        if (errorTarifa || tarifaCfe === undefined)
        {
            return [errorTarifa ?? 'El campo "tarifaCfe" es inválido', undefined];
        }

        let areaDisponibleM2: number | null = null;

        if (objeto['areaDisponibleM2'] !== undefined && objeto['areaDisponibleM2'] !== null)
        {
            const [errorArea, area] = ValidacionSimulacion.leerNumeroPositivo(objeto['areaDisponibleM2'], 'areaDisponibleM2', ValidacionSimulacion.AREA_MAXIMA_M2);

            if (errorArea || area === undefined)
            {
                return [errorArea ?? 'El campo "areaDisponibleM2" es inválido', undefined];
            }

            areaDisponibleM2 = area;
        }

        const [errorTipoTarifa, tipoTarifa] = ValidacionSimulacion.leerTipoTarifa(objeto['tipoTarifa'], 'tipoTarifa', TipoTarifa.PDBT);

        if (errorTipoTarifa || tipoTarifa === undefined)
        {
            return [errorTipoTarifa ?? 'El campo "tipoTarifa" es inválido', undefined];
        }

        const [errorBaterias, incluyeBaterias] = ValidacionSimulacion.leerBooleano(objeto['incluyeBaterias'], 'incluyeBaterias', false);

        if (errorBaterias || incluyeBaterias === undefined)
        {
            return [errorBaterias ?? 'El campo "incluyeBaterias" es inválido', undefined];
        }

        return [undefined, new DtoCrearSimulacion(municipioId, consumoKwh, tarifaCfe, areaDisponibleM2, tipoTarifa, incluyeBaterias)];
    }
}

export = DtoCrearSimulacion;
