/**
 * DTO de la respuesta de `POST /api/Auth/login`.
 *
 * Vive únicamente en infraestructura; la presentación recibe entidades de
 * dominio a través del mapeador.
 */
export interface respuestaSesionDto
{
    readonly mensaje: string;
    readonly token: string;
    readonly expiraEnSegundos: number;
    readonly usuario: {
        readonly id: number;
        readonly nombre: string;
        readonly correo: string;
        readonly roles: readonly string[];
    };
}
