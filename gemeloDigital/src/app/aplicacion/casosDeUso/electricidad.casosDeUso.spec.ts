import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { catalogoTarifas } from '../../dominio/entidades/catalogoTarifas.entidad';
import { facturaEstimada } from '../../dominio/entidades/facturaEstimada.entidad';
import { riesgoDac } from '../../dominio/entidades/riesgoDac.entidad';
import { repositorioElectricidad } from '../puertos/repositorioElectricidad';
import { estimarFacturaElectrica } from './estimarFacturaElectrica.casoUso';
import { evaluarRiesgoDac } from './evaluarRiesgoDac.casoUso';
import { listarTarifasElectricas } from './listarTarifasElectricas.casoUso';

const catalogoDePrueba = {} as catalogoTarifas;
const facturaDePrueba = {} as facturaEstimada;
const riesgoDePrueba = {} as riesgoDac;

function configurar()
{
    const repositorio = {
        listarTarifas: vi.fn(),
        estimarFactura: vi.fn(),
        evaluarRiesgoDac: vi.fn(),
    };

    repositorio.listarTarifas.mockResolvedValue(catalogoDePrueba);
    repositorio.estimarFactura.mockResolvedValue(facturaDePrueba);
    repositorio.evaluarRiesgoDac.mockResolvedValue(riesgoDePrueba);

    TestBed.configureTestingModule({
        providers: [
            listarTarifasElectricas,
            estimarFacturaElectrica,
            evaluarRiesgoDac,
            { provide: repositorioElectricidad, useValue: repositorio },
        ],
    });

    return {
        casoUsoTarifas: TestBed.inject(listarTarifasElectricas),
        casoUsoFactura: TestBed.inject(estimarFacturaElectrica),
        casoUsoRiesgo: TestBed.inject(evaluarRiesgoDac),
        repositorio,
    };
}

describe('casos de uso de electricidad', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe listar las tarifas eléctricas', async () =>
    {
        const { casoUsoTarifas, repositorio } = configurar();

        const resultado = await casoUsoTarifas.ejecutar();

        expect(repositorio.listarTarifas).toHaveBeenCalledOnce();
        expect(resultado).toBe(catalogoDePrueba);
    });

    it('debe estimar la factura con el periodo por defecto', async () =>
    {
        const { casoUsoFactura, repositorio } = configurar();

        const resultado = await casoUsoFactura.ejecutar('pdbT' as unknown as 'PDBT', 150);

        expect(repositorio.estimarFactura).toHaveBeenCalledWith('PDBT', 150, 'MENSUAL');
        expect(resultado).toBe(facturaDePrueba);
    });

    it('debe rechazar un consumo no positivo', async () =>
    {
        const { casoUsoFactura, repositorio } = configurar();

        await expect(casoUsoFactura.ejecutar('PDBT', 0))
            .rejects.toThrow('El consumo debe ser mayor que 0');

        expect(repositorio.estimarFactura).not.toHaveBeenCalled();
    });

    it('debe evaluar el riesgo DAC con los meses por defecto', async () =>
    {
        const { casoUsoRiesgo, repositorio } = configurar();

        const resultado = await casoUsoRiesgo.ejecutar('DAC', 3000);

        expect(repositorio.evaluarRiesgoDac).toHaveBeenCalledWith('DAC', 3000, 12);
        expect(resultado).toBe(riesgoDePrueba);
    });

    it('debe rechazar un tipo de tarifa desconocido', async () =>
    {
        const { casoUsoRiesgo, repositorio } = configurar();

        await expect(casoUsoRiesgo.ejecutar('OTRA' as never, 3000))
            .rejects.toThrow('El tipo de tarifa debe ser PDBT, DAC o GDBT');

        expect(repositorio.evaluarRiesgoDac).not.toHaveBeenCalled();
    });
});
