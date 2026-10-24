/**
 * Estados de un programa de incentivos para la generación distribuida.
 *
 * - `active`: programa vigente.
 * - `expired`: programa vencido.
 * - `upcoming`: programa pendiente de iniciar su vigencia.
 * - `unverified`: programa sin verificación de sus requisitos.
 */
enum EstadoIncentivo
{
    ACTIVO = 'active',
    VENCIDO = 'expired',
    PROXIMO = 'upcoming',
    NO_VERIFICADO = 'unverified',
}

export = EstadoIncentivo;
