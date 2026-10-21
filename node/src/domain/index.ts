

import registerUserDTO = require('./entities/dtos/auth/register-user.dtos');
import User = require('./entities/user.entities');
import CustomError = require('./datasources/errors/custom.error');
import AuthDatasource = require('./datasources/auth.datasource');
import AuthRepository = require('./repositories/auth.repository');

import DtoConsultarSimulaciones = require('./entidades/dtos/simulaciones/consultar-simulaciones.dto');
import DtoCrearSimulacion = require('./entidades/dtos/simulaciones/crear-simulacion.dto');
import DtoIdSimulacion = require('./entidades/dtos/simulaciones/id-simulacion.dto');
import DtoRecalcularSimulacion = require('./entidades/dtos/simulaciones/recalcular-simulacion.dto');
import ErrorPersonalizado = require('./fuentes-datos/errores/error-personalizado');
import FuenteDatosSimulaciones = require('./fuentes-datos/fuente-datos-simulaciones');
import HistorialSimulaciones = require('./entidades/historial-simulaciones.entidad');
import RepositorioSimulaciones = require('./repositorios/repositorio-simulaciones');
import ResultadoCalculoSolar = require('./entidades/resultado-calculo-solar.entidad');
import Simulacion = require('./entidades/simulacion.entidad');
import TipoTarifa = require('./entidades/tipo-tarifa');
import CalculadoraSimulacionSolar = require('./servicios/calculadora-simulacion-solar');



const domain = {
    registerUserDTO,
    User,
    CustomError,
    AuthDatasource,
    AuthRepository,
    DtoConsultarSimulaciones,
    DtoCrearSimulacion,
    DtoIdSimulacion,
    DtoRecalcularSimulacion,
    ErrorPersonalizado,
    FuenteDatosSimulaciones,
    HistorialSimulaciones,
    RepositorioSimulaciones,
    ResultadoCalculoSolar,
    Simulacion,
    TipoTarifa,
    CalculadoraSimulacionSolar
};

export = domain;
