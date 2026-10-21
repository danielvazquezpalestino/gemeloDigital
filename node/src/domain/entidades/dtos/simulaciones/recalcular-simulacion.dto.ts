import TipoTarifa = require('../../tipo-tarifa');
import ValidacionSimulacion = require('./validacion-simulacion');

/**
 * Datos de entrada para recalcular una simulación ya existente.
 *
 * Todos los campos son opcionales: los que no se envían conservan el valor
 * guardado. Enviar `null` en `areaDisponibleM2` elimina la restricción de área
 * del techo; enviar `null` en `tipoTarifa` o `incluyeBaterias` los restablece
 * a su valor por defecto. Se exige al menos un campo para recalcular.
 */
class DtoRecalcularSimulacion
{
    private constructor
    (
        public readonly municipioId: number | undefined,
        public readonly consumoKwh: number | undefined,
        public readonly tarifaCfe: number | undefined,
        public readonly areaDisponibleM2: number | null | undefined,
        public readonly tipoTarifa: TipoTarifa | undefined,
        public readonly incluyeBaterias: boolean | undefined,
    )
    {
    }

    static crear(datos: unknown): [string | undefined, DtoRecalcularSimulacion | undefined]
    {
        const objeto = ValidacionSimulacion.comoObjeto(datos);

        if (!objeto)
        {
            return ['Los datos de la simulación son inválidos', undefined];
        }

        let municipioId: number | undefined;

        if (ValidacionSimulacion.tieneCampo(objeto, 'municipioId'))
        {
            const [error, valor] = ValidacionSimulacion.leerEnteroPositivo(objeto['municipioId'], 'municipioId');

            if (error || valor === undefined)
            {
                return [error ?? 'El campo "municipioId" es inválido', undefined];
            }

            municipioId = valor;
        }

        let consumoKwh: number | undefined;

        if (ValidacionSimulacion.tieneCampo(objeto, 'consumoKwh'))
        {
            const [error, valor] = ValidacionSimulacion.leerNumeroPositivo(objeto['consumoKwh'], 'consumoKwh', ValidacionSimulacion.CONSUMO_MAXIMO_KWH);

            if (error || valor === undefined)
            {
                return [error ?? 'El campo "consumoKwh" es inválido', undefined];
            }

            consumoKwh = valor;
        }

        let tarifaCfe: number | undefined;

        if (ValidacionSimulacion.tieneCampo(objeto, 'tarifaCfe'))
        {
            const [error, valor] = ValidacionSimulacion.leerNumeroPositivo(objeto['tarifaCfe'], 'tarifaCfe', ValidacionSimulacion.TARIFA_MAXIMA);

            if (error || valor === undefined)
            {
                return [error ?? 'El campo "tarifaCfe" es inválido', undefined];
            }

            tarifaCfe = valor;
        }

        let areaDisponibleM2: number | null | undefined;

        if (ValidacionSimulacion.tieneCampo(objeto, 'areaDisponibleM2'))
        {
            if (objeto['areaDisponibleM2'] === null)
            {
                areaDisponibleM2 = null;
            }
            else
            {
                const [error, valor] = ValidacionSimulacion.leerNumeroPositivo(objeto['areaDisponibleM2'], 'areaDisponibleM2', ValidacionSimulacion.AREA_MAXIMA_M2);

                if (error || valor === undefined)
                {
                    return [error ?? 'El campo "areaDisponibleM2" es inválido', undefined];
                }

                areaDisponibleM2 = valor;
            }
        }

        let tipoTarifa: TipoTarifa | undefined;

        if (ValidacionSimulacion.tieneCampo(objeto, 'tipoTarifa'))
        {
            const [error, valor] = ValidacionSimulacion.leerTipoTarifa(objeto['tipoTarifa'], 'tipoTarifa', TipoTarifa.PDBT);

            if (error || valor === undefined)
            {
                return [error ?? 'El campo "tipoTarifa" es inválido', undefined];
            }

            tipoTarifa = valor;
        }

        let incluyeBaterias: boolean | undefined;

        if (ValidacionSimulacion.tieneCampo(objeto, 'incluyeBaterias'))
        {
            const [error, valor] = ValidacionSimulacion.leerBooleano(objeto['incluyeBaterias'], 'incluyeBaterias', false);

            if (error || valor === undefined)
            {
                return [error ?? 'El campo "incluyeBaterias" es inválido', undefined];
            }

            incluyeBaterias = valor;
        }

        if (municipioId === undefined
            && consumoKwh === undefined
            && tarifaCfe === undefined
            && areaDisponibleM2 === undefined
            && tipoTarifa === undefined
            && incluyeBaterias === undefined)
        {
            return ['Debe enviar al menos un campo para recalcular la simulación', undefined];
        }

        return [undefined, new DtoRecalcularSimulacion(municipioId, consumoKwh, tarifaCfe, areaDisponibleM2, tipoTarifa, incluyeBaterias)];
    }
}

export = DtoRecalcularSimulacion;
