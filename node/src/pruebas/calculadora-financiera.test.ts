import test = require('node:test');
import assert = require('node:assert/strict');
import CalculadoraFinanciera = require('../domain/servicios/calculadora-financiera');
import DtoEstimarFinanciero = require('../domain/entities/dtos/financiero/estimar-financiero.dto');

test('calcula recuperación, ROI, VPN y TIR con flujos positivos', () =>
{
    const [error, dto] = DtoEstimarFinanciero.crear({
        inversionInicial: 100000,
        ahorroAnual: 30000,
        mantenimientoAnual: 5000,
        horizonteAnios: 10,
        tasaDescuento: 0.1,
    });

    assert.equal(error, undefined);
    assert.ok(dto);

    const resultado = new CalculadoraFinanciera().calcular(dto);

    assert.equal(resultado.flujoNetoAnual, 25000);
    assert.equal(resultado.recuperacionAnios, 4);
    assert.equal(resultado.roiPorcentaje, 150);
    assert.ok(resultado.vpn > 50000 && resultado.vpn < 55000);
    assert.ok(resultado.tirPorcentaje !== null && resultado.tirPorcentaje > 20 && resultado.tirPorcentaje < 23);
    assert.equal(resultado.flujosAnuales.length, 10);
});

test('informa cuando no hay recuperación ni TIR', () =>
{
    const [error, dto] = DtoEstimarFinanciero.crear({
        inversionInicial: 100000,
        ahorroAnual: 1000,
        mantenimientoAnual: 5000,
        horizonteAnios: 5,
        tasaDescuento: 0.1,
    });

    assert.equal(error, undefined);
    assert.ok(dto);

    const resultado = new CalculadoraFinanciera().calcular(dto);

    assert.equal(resultado.recuperacionAnios, null);
    assert.equal(resultado.tirPorcentaje, null);
    assert.ok(resultado.vpn < 0);
    assert.ok(resultado.advertencias.length >= 3);
});

test('rechaza entradas financieras inválidas', () =>
{
    const [error] = DtoEstimarFinanciero.crear({
        inversionInicial: 0,
        ahorroAnual: 30000,
        horizonteAnios: 10,
        tasaDescuento: 0.1,
    });

    assert.ok(error);

    const [errorHorizonte] = DtoEstimarFinanciero.crear({
        inversionInicial: 100000,
        ahorroAnual: 30000,
        horizonteAnios: 2.5,
        tasaDescuento: 0.1,
    });

    assert.ok(errorHorizonte);

    const [errorTasa] = DtoEstimarFinanciero.crear({
        inversionInicial: 100000,
        ahorroAnual: 30000,
        horizonteAnios: 10,
        tasaDescuento: 1.5,
    });

    assert.ok(errorTasa);
});
