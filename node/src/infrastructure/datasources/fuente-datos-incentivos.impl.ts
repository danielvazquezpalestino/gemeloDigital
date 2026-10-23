import FuenteDatosIncentivos = require('../../domain/datasources/fuente-datos-incentivos');
import Incentivo = require('../../domain/entities/incentivo.entidad');
import RequisitoIncentivo = require('../../domain/entities/requisito-incentivo.entidad');

/**
 * Catálogo configurable de incentivos.
 *
 * Todos los programas, montos y requisitos son DATOS DE DEMOSTRACIÓN
 * ficticios. No representan programas oficiales ni información vigente.
 */
class FuenteDatosIncentivosImpl extends FuenteDatosIncentivos
{
    private readonly incentivos: readonly Incentivo[] =
    [
        new Incentivo(
            'DEMO-HOGAR-SOLAR',
            'Apoyo demostrativo para hogares',
            'Programa ficticio de demostración para viviendas con consumo eléctrico relevante.',
            'HOGAR',
            15000,
            [
                new RequisitoIncentivo('tipoUsuario', 'igual', 'HOGAR', 'El tipo de usuario debe ser HOGAR'),
                new RequisitoIncentivo('ingresoMensualMxn', 'menor_igual', 20000, 'El ingreso mensual no debe superar 20000 MXN'),
                new RequisitoIncentivo('consumoPromedioMensualKwh', 'mayor_igual', 100, 'El consumo mensual promedio debe ser al menos 100 kWh'),
            ],
            true,
        ),
        new Incentivo(
            'DEMO-PYME-EFICIENCIA',
            'Apoyo demostrativo para PYMES',
            'Programa ficticio de demostración para proyectos de eficiencia energética en PYMES.',
            'PYME',
            50000,
            [
                new RequisitoIncentivo('tipoUsuario', 'igual', 'PYME', 'El tipo de usuario debe ser PYME'),
                new RequisitoIncentivo('inversionProyectoMxn', 'mayor_igual', 50000, 'La inversión del proyecto debe ser al menos 50000 MXN'),
            ],
            true,
        ),
        new Incentivo(
            'DEMO-REGION-NORTE',
            'Apoyo demostrativo regional',
            'Programa ficticio de demostración para la región Sierra Norte.',
            'REGIONAL',
            10000,
            [
                new RequisitoIncentivo('region', 'igual', 'SIERRA_NORTE', 'La región debe ser SIERRA_NORTE'),
                new RequisitoIncentivo('consumoPromedioMensualKwh', 'mayor_igual', 200, 'El consumo mensual promedio debe ser al menos 200 kWh'),
            ],
            true,
        ),
    ];

    async listar(): Promise<Incentivo[]>
    {
        return [...this.incentivos];
    }

    async buscarPorId(id: string): Promise<Incentivo | null>
    {
        const normalizado = id.trim().toUpperCase();
        const incentivo = this.incentivos.find((candidato) => candidato.id === normalizado);

        return incentivo ?? null;
    }
}

export = FuenteDatosIncentivosImpl;
