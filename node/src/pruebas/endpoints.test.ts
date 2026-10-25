import test = require('node:test');
import assert = require('node:assert/strict');
import express = require('express');

// El enrutador raíz carga la configuración de entornos al importarse. En la
// prueba se usan valores ficticios para no depender de src/.env ni de MySQL.
process.env['PORT'] ??= '3100';
process.env['DB_HOST'] ??= 'localhost';
process.env['DB_PORT'] ??= '3306';
process.env['DB_USER'] ??= 'root';
process.env['DB_NAME'] ??= 'gemeloDigital';

const RutasAplicacion: { routes: express.Router } = require('../presentation/routes');
const pool: { end: () => Promise<void> } = require('../config/database');

interface RespuestaPrueba
{
    estado: number;
    cuerpo: any;
}

async function solicitar(base: string, ruta: string, metodo = 'GET', cuerpo?: unknown): Promise<RespuestaPrueba>
{
    const opciones: RequestInit = { method: metodo };

    if (cuerpo !== undefined)
    {
        opciones.headers = { 'Content-Type': 'application/json' };
        opciones.body = JSON.stringify(cuerpo);
    }

    const respuesta = await fetch(`${base}${ruta}`, opciones);

    return {
        estado: respuesta.status,
        cuerpo: await respuesta.json(),
    };
}

test('los endpoints v1 responden con datos de demostración', async () =>
{
    const aplicacion = express();
    aplicacion.use(express.json());
    aplicacion.use(RutasAplicacion.routes);

    const servidor = aplicacion.listen(0);
    await new Promise<void>((resolver) => servidor.once('listening', () => resolver()));

    const direccion = servidor.address();
    assert.ok(direccion && typeof direccion === 'object');
    const base = `http://127.0.0.1:${direccion.port}/api/v1`;

    try
    {
        const tarifas = await solicitar(base, '/electricity/tariffs');
        assert.equal(tarifas.estado, 200);
        assert.equal(tarifas.cuerpo.esDemostracion, true);
        assert.equal(tarifas.cuerpo.tarifas.length, 3);

        const factura = await solicitar(base, '/electricity/estimate-bill', 'POST', {
            tipoTarifa: 'PDBT',
            consumoKwh: 150,
            periodo: 'BIMESTRAL',
        });
        assert.equal(factura.estado, 200);
        assert.equal(factura.cuerpo.factura.moneda, 'MXN');
        assert.equal(factura.cuerpo.factura.periodo, 'BIMESTRAL');
        assert.ok(factura.cuerpo.factura.totalEstimado > 0);
        assert.equal(factura.cuerpo.factura.esDemostracion, true);

        const facturaInvalida = await solicitar(base, '/electricity/estimate-bill', 'POST', {
            consumoKwh: 150,
        });
        assert.equal(facturaInvalida.estado, 400);
        assert.equal(typeof facturaInvalida.cuerpo.mensaje, 'string');

        const riesgo = await solicitar(
            base,
            '/electricity/dac-risk?consumoPromedioMensualKwh=3000&tipoTarifa=PDBT&mesesHistoricos=12',
        );
        assert.equal(riesgo.estado, 200);
        assert.equal(riesgo.cuerpo.evaluacion.nivelRiesgo, 'ALTO');
        assert.equal(riesgo.cuerpo.evaluacion.tipoTarifa, 'PDBT');
        assert.equal(riesgo.cuerpo.evaluacion.determinacionOficial, false);

        const riesgoInvalido = await solicitar(
            base,
            '/electricity/dac-risk?consumoPromedioMensualKwh=3000',
        );
        assert.equal(riesgoInvalido.estado, 400);
        assert.equal(typeof riesgoInvalido.cuerpo.mensaje, 'string');

        const paneles = await solicitar(base, '/panels');
        assert.equal(paneles.estado, 200);
        assert.equal(paneles.cuerpo.esDemostracion, true);
        assert.equal(paneles.cuerpo.paneles.length, 3);

        const panelesFabricante = await solicitar(base, '/panels?fabricante=Demo%20Uno');
        assert.equal(panelesFabricante.estado, 200);
        assert.equal(panelesFabricante.cuerpo.paneles.length, 2);

        const panelesPotencia = await solicitar(base, '/panels?potenciaMinimaWatts=500');
        assert.equal(panelesPotencia.estado, 200);
        assert.equal(panelesPotencia.cuerpo.paneles.length, 1);

        const panelesSinCoincidencias = await solicitar(base, '/panels?fabricante=NoExiste');
        assert.equal(panelesSinCoincidencias.estado, 200);
        assert.equal(panelesSinCoincidencias.cuerpo.paneles.length, 0);

        const panelesInvalidos = await solicitar(base, '/panels?potenciaMinimaWatts=abc');
        assert.equal(panelesInvalidos.estado, 400);
        assert.equal(typeof panelesInvalidos.cuerpo.mensaje, 'string');

        const financiero = await solicitar(base, '/financial/estimate', 'POST', {
            inversionInicial: 100000,
            ahorroAnual: 30000,
            mantenimientoAnual: 5000,
            horizonteAnios: 10,
            tasaDescuento: 0.1,
        });
        assert.equal(financiero.estado, 200);
        assert.equal(financiero.cuerpo.resultado.moneda, 'MXN');
        assert.equal(typeof financiero.cuerpo.resultado.vpn, 'number');
        assert.equal(typeof financiero.cuerpo.resultado.tirPorcentaje, 'number');

        const incentivos = await solicitar(base, '/incentives');
        assert.equal(incentivos.estado, 200);
        assert.equal(incentivos.cuerpo.esDemostracion, true);
        assert.equal(incentivos.cuerpo.incentivos.length, 3);

        const elegibilidad = await solicitar(
            base,
            '/incentives/eligibility?incentivoId=DEMO-HOGAR-SOLAR&tipoUsuario=HOGAR&ingresoMensualMxn=15000&consumoPromedioMensualKwh=120',
        );
        assert.equal(elegibilidad.estado, 200);
        assert.equal(elegibilidad.cuerpo.resultado.elegible, true);
        assert.equal(elegibilidad.cuerpo.resultado.determinacionOficial, false);

        const faltantes = await solicitar(base, '/incentives/eligibility?incentivoId=DEMO-HOGAR-SOLAR');
        assert.equal(faltantes.estado, 200);
        assert.equal(faltantes.cuerpo.resultado.elegible, null);
        assert.ok(faltantes.cuerpo.resultado.requisitosFaltantes.length > 0);

        const invalido = await solicitar(base, '/financial/estimate', 'POST', { inversionInicial: 0 });
        assert.equal(invalido.estado, 400);
        assert.equal(typeof invalido.cuerpo.mensaje, 'string');

        const inexistente = await solicitar(base, '/incentives/eligibility?incentivoId=NO-EXISTE');
        assert.equal(inexistente.estado, 404);
    }
    finally
    {
        await new Promise<void>((resolver, rechazar) =>
        {
            servidor.close((error) => error ? rechazar(error) : resolver());
        });

        await pool.end();
    }
});
