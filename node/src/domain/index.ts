

import registerUserDTO = require('./entities/dtos/auth/register-user.dtos');
import User = require('./entities/user.entities');
import CustomError = require('./datasources/errors/custom.error');
import AuthDatasource = require('./datasources/auth.datasource');
import AuthRepository = require('./repositories/auth.repository');

import DtoConsultarSimulaciones = require('./entities/dtos/simulaciones/consultar-simulaciones.dto');
import DtoCrearSimulacion = require('./entities/dtos/simulaciones/crear-simulacion.dto');
import DtoIdSimulacion = require('./entities/dtos/simulaciones/id-simulacion.dto');
import DtoRecalcularSimulacion = require('./entities/dtos/simulaciones/recalcular-simulacion.dto');
import ErrorPersonalizado = require('./datasources/errors/custom-error');
import FuenteDatosSimulaciones = require('./datasources/fuente-datos-simulaciones');
import HistorialSimulaciones = require('./entities/historial-simulaciones.entidad');
import RepositorioSimulaciones = require('./repositories/repositorio-simulaciones');
import ResultadoCalculoSolar = require('./entities/resultado-calculo-solar.entidad');
import Simulacion = require('./entities/simulacion.entidad');
import TipoTarifa = require('./entities/tipo-tarifa');
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
