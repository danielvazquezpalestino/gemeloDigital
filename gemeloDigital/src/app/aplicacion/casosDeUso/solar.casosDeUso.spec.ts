import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { produccionSolar } from '../../dominio/entidades/produccionSolar.entidad';
import { radiacionSolar } from '../../dominio/entidades/radiacionSolar.entidad';
import { repositorioSolar } from '../puertos/repositorioSolar';
import { calcularProduccionSolar } from './calcularProduccionSolar.casoUso';
import { obtenerRadiacionSolar } from './obtenerRadiacionSolar.casoUso';

const radiacionDePrueba = {} as radiacionSolar;
const produccionDePrueba = {} as produccionSolar;

function configurar()
{
    const repositorio = {
        obtenerRadiacion: vi.fn(),
        calcularProduccion: vi.fn(),
    };

    repositorio.obtenerRadiacion.mockResolvedValue(radiacionDePrueba);
    repositorio.calcularProduccion.mockResolvedValue(produccionDePrueba);

    TestBed.configureTestingModule({
        providers: [
            obtenerRadiacionSolar,
            calcularProduccionSolar,
            { provide: repositorioSolar, useValue: repositorio },
        ],
    });

    return {
        casoUsoRadiacion: TestBed.inject(obtenerRadiacionSolar),
        casoUsoProduccion: TestBed.inject(calcularProduccionSolar),
        repositorio,
    };
}

describe('casos de uso de energía solar', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe consultar la radiación con coordenadas', async () =>
    {
        const { casoUsoRadiacion, repositorio } = configurar();

        const resultado = await casoUsoRadiacion.ejecutar(19.04, -98.2);

        expect(repositorio.obtenerRadiacion).toHaveBeenCalledWith({
            latitud: 19.04,
            longitud: -98.2,
            municipioId: null,
        });
        expect(resultado).toBe(radiacionDePrueba);
    });

    it('debe consultar la radiación por municipio', async () =>
    {
        const { casoUsoRadiacion, repositorio } = configurar();

        await casoUsoRadiacion.ejecutar(null, null, 110);

        expect(repositorio.obtenerRadiacion).toHaveBeenCalledWith({
            latitud: null,
            longitud: null,
            municipioId: 110,
        });
    });

    it('debe rechazar coordenadas incompletas', async () =>
    {
        const { casoUsoRadiacion, repositorio } = configurar();

        await expect(casoUsoRadiacion.ejecutar(19.04, null))
            .rejects.toThrow('Debe indicar la latitud y la longitud juntas, o bien un municipio');

        expect(repositorio.obtenerRadiacion).not.toHaveBeenCalled();
    });

    it('debe rechazar una consulta sin ubicación', async () =>
    {
        const { casoUsoRadiacion, repositorio } = configurar();

        await expect(casoUsoRadiacion.ejecutar())
            .rejects.toThrow('Debe indicar la latitud y la longitud, o bien un municipio');

        expect(repositorio.obtenerRadiacion).not.toHaveBeenCalled();
    });

    it('debe calcular la producción con eficiencia por defecto', async () =>
    {
        const { casoUsoProduccion, repositorio } = configurar();

        const resultado = await casoUsoProduccion.ejecutar(10);

        expect(repositorio.calcularProduccion).toHaveBeenCalledWith({
            capacidadKwp: 10,
            eficiencia: 0.8,
            latitud: null,
            longitud: null,
            municipioId: null,
        });
        expect(resultado).toBe(produccionDePrueba);
    });

    it('debe rechazar una capacidad no positiva', async () =>
    {
        const { casoUsoProduccion, repositorio } = configurar();

        await expect(casoUsoProduccion.ejecutar(0))
            .rejects.toThrow('La capacidad instalada debe ser mayor que 0');

        expect(repositorio.calcularProduccion).not.toHaveBeenCalled();
    });
});
