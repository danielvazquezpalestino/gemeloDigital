import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { almacenamientoSesion } from '../puertos/almacenamientoSesion';
import { cerrarSesion } from './cerrarSesion.casoUso';

function crearAlmacenamientoFalso()
{
    return {
        guardar: vi.fn(),
        obtener: vi.fn(),
        obtenerToken: vi.fn(),
        eliminar: vi.fn(),
        estaAutenticado: vi.fn(),
    };
}

describe('cerrarSesion', () =>
{
    afterEach(() =>
    {
        TestBed.resetTestingModule();
    });

    it('debe eliminar la sesión almacenada', () =>
    {
        const almacenamiento = crearAlmacenamientoFalso();

        TestBed.configureTestingModule({
            providers: [
                cerrarSesion,
                { provide: almacenamientoSesion, useValue: almacenamiento },
            ],
        });

        TestBed.inject(cerrarSesion).ejecutar();

        expect(almacenamiento.eliminar).toHaveBeenCalledOnce();
    });
});
