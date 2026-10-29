import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { consultaSimulaciones } from '../../dominio/entidades/consultaSimulaciones.entidad';
import { simulacionSolar } from '../../dominio/entidades/simulacionSolar.entidad';
import { repositorioSimulaciones } from '../puertos/repositorioSimulaciones';
import { crearSimulacionSolar } from './crearSimulacionSolar.casoUso';
import { eliminarSimulacionSolar } from './eliminarSimulacionSolar.casoUso';
import { obtenerHistorialSimulaciones } from './obtenerHistorialSimulaciones.casoUso';
import { obtenerSimulacionSolar } from './obtenerSimulacionSolar.casoUso';
import { recalcularSimulacionSolar } from './recalcularSimulacionSolar.casoUso';

const simulacionDePrueba = {} as simulacionSolar;
const consultaDePrueba = {} as consultaSimulaciones;

function configurar()
{
    const repositorio = {
        crear: vi.fn(),
        listar: vi.fn(),
        obtener: vi.fn(),
        eliminar: vi.fn(),
        recalcular: vi.fn(),
    };

    repositorio.crear.mockResolvedValue(simulacionDePrueba);
    repositorio.listar.mockResolvedValue(consultaDePrueba);
    repositorio.obtener.mockResolvedValue(simulacionDePrueba);
    repositorio.eliminar.mockResolvedValue(undefined);
    repositorio.recalcular.mockResolvedValue(simulacionDePrueba);

    TestBed.configureTestingModule({
        providers: [
            crearSimulacionSolar,
            obtenerHistorialSimulaciones,
            obtenerSimulacionSolar,
            eliminarSimulacionSolar,
            recalcularSimulacionSolar,
            { provide: repositorioSimulaciones, useValue: repositorio },
        ],
    });

    return {
        casoUsoCrear: TestBed.inject(crearSimulacionSolar),
        casoUsoHistorial: TestBed.inject(obtenerHistorialSimulaciones),
        casoUsoObtener: TestBed.inject(obtenerSimulacionSolar),
        casoUsoEliminar: TestBed.inject(eliminarSimulacionSolar),
        casoUsoRecalcular: TestBed.inject(recalcularSimulacionSolar),
        repositorio,
    };
}

describe('casos de uso de simulaciones solares', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe crear una simulación con valores por defecto', async () =>
    {
        const { casoUsoCrear, repositorio } = configurar();

        const resultado = await casoUsoCrear.ejecutar({
            municipioId: 110,
            consumoKwh: 5000,
            tarifaCfe: 1.2,
        });

        expect(repositorio.crear).toHaveBeenCalledWith({
            municipioId: 110,
            consumoKwh: 5000,
            tarifaCfe: 1.2,
            areaDisponibleM2: null,
            tipoTarifa: 'PDBT',
            incluyeBaterias: false,
        });
        expect(resultado).toBe(simulacionDePrueba);
    });

    it('debe rechazar una simulación con municipio inválido', async () =>
    {
        const { casoUsoCrear, repositorio } = configurar();

        await expect(casoUsoCrear.ejecutar({
            municipioId: 0,
            consumoKwh: 5000,
            tarifaCfe: 1.2,
        })).rejects.toThrow('El municipio debe ser mayor o igual que 1');

        expect(repositorio.crear).not.toHaveBeenCalled();
    });

    it('debe obtener el historial con paginación por defecto', async () =>
    {
        const { casoUsoHistorial, repositorio } = configurar();

        const resultado = await casoUsoHistorial.ejecutar();

        expect(repositorio.listar).toHaveBeenCalledWith({
            municipioId: null,
            pagina: 1,
            limite: 20,
        });
        expect(resultado).toBe(consultaDePrueba);
    });

    it('debe rechazar un identificador inválido al obtener', async () =>
    {
        const { casoUsoObtener, repositorio } = configurar();

        await expect(casoUsoObtener.ejecutar(0))
            .rejects.toThrow('El identificador debe ser mayor que 0');

        expect(repositorio.obtener).not.toHaveBeenCalled();
    });

    it('debe eliminar una simulación existente', async () =>
    {
        const { casoUsoEliminar, repositorio } = configurar();

        await casoUsoEliminar.ejecutar(7);

        expect(repositorio.eliminar).toHaveBeenCalledWith(7);
    });

    it('debe rechazar un recalculo sin cambios', async () =>
    {
        const { casoUsoRecalcular, repositorio } = configurar();

        await expect(casoUsoRecalcular.ejecutar(7, {}))
            .rejects.toThrow('Debe enviar al menos un campo para recalcular la simulación');

        expect(repositorio.recalcular).not.toHaveBeenCalled();
    });

    it('debe normalizar los cambios del recalculo', async () =>
    {
        const { casoUsoRecalcular, repositorio } = configurar();

        const resultado = await casoUsoRecalcular.ejecutar(7, {
            consumoKwh: 1200,
            areaDisponibleM2: null,
            tipoTarifa: 'dac' as unknown as 'DAC',
            incluyeBaterias: true,
        });

        expect(repositorio.recalcular).toHaveBeenCalledWith(7, {
            consumoKwh: 1200,
            areaDisponibleM2: null,
            tipoTarifa: 'DAC',
            incluyeBaterias: true,
        });
        expect(resultado).toBe(simulacionDePrueba);
    });
});
