import Simulacion = require('../entities/simulacion.entidad');

/**
 * Puerto (contrato) de persistencia del módulo de simulaciones.
 * La implementación concreta vive en `infrastructure/datasources` y es la
 * única capa donde se escribe SQL.
 */
abstract class FuenteDatosSimulaciones
{
    abstract insertar(simulacion: Simulacion): Promise<Simulacion>;

    abstract buscarPorId(id: number): Promise<Simulacion | null>;

    abstract listar(municipioId: number | null, limite: number, desplazamiento: number): Promise<Simulacion[]>;

    abstract contar(municipioId: number | null): Promise<number>;

    abstract actualizar(simulacion: Simulacion): Promise<Simulacion>;

    abstract eliminarPorId(id: number): Promise<boolean>;
}

export = FuenteDatosSimulaciones;
