/**
 * Utilidades de cálculo para el sistema AirBnb
 */

/**
 * Calcula el número de noches entre dos fechas
 * @param {string} fechaInicio - Fecha en formato YYYY-MM-DD
 * @param {string} fechaFin - Fecha en formato YYYY-MM-DD
 * @returns {number} Número de noches
 */
export const calcularNoches = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diffTime = Math.abs(fin - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calcula el monto total de una reservación
 * @param {number} noches - Número de noches
 * @param {number} tarifaNoche - Tarifa por noche
 * @returns {number} Monto total
 */
export const calcularMontoReserva = (noches, tarifaNoche) => {
  return noches * tarifaNoche;
};

/**
 * Calcula la comisión de Airbnb (10% del monto bruto)
 * @param {number} montoBruto - Monto bruto del pago
 * @returns {number} Comisión de Airbnb
 */
export const calcularComisionAirbnb = (montoBruto) => {
  return montoBruto * 0.10;
};

/**
 * Calcula el monto neto después de comisión
 * @param {number} montoBruto - Monto bruto del pago
 * @param {number} comision - Comisión a descontar
 * @returns {number} Monto neto
 */
export const calcularMontoNeto = (montoBruto, comision) => {
  return montoBruto - comision;
};

/**
 * Calcula el IVA (16%)
 * @param {number} monto - Monto base
 * @returns {number} IVA calculado
 */
export const calcularIVA = (monto) => {
  return monto * 0.16;
};

/**
 * Calcula el total con IVA
 * @param {number} monto - Monto base
 * @param {number} iva - IVA
 * @returns {number} Total con IVA
 */
export const calcularTotalConIVA = (monto, iva) => {
  return monto + iva;
};

/**
 * Calcula la comisión de la plataforma para mantenimiento
 * @param {number} costoBase - Costo base del mantenimiento
 * @param {number} porcentajeComision - Porcentaje de comisión (0-1)
 * @returns {number} Comisión calculada
 */
export const calcularComisionMantenimiento = (costoBase, porcentajeComision) => {
  return costoBase * porcentajeComision;
};

/**
 * Calcula el total cobrado en mantenimiento
 * @param {number} costoBase - Costo base
 * @param {number} comision - Comisión
 * @returns {number} Total cobrado
 */
export const calcularTotalMantenimiento = (costoBase, comision) => {
  return costoBase + comision;
};

/**
 * Formatea un número como moneda
 * @param {number} monto - Monto a formatear
 * @returns {string} Monto formateado (ej: "$2,800.00")
 */
export const formatearMoneda = (monto) => {
  if (monto === undefined || monto === null || isNaN(Number(monto))) {
    return '$0.00';
  }
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(monto);
};

/**
 * Formatea una fecha para mostrar
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada (ej: "15 de febrero de 2025")
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Formatea una fecha corta
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada (ej: "15/02/2025")
 */
export const formatearFechaCorta = (fecha) => {
  if (!fecha) return '-';
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('es-MX').format(date);
};

/**
 * Calcula totales de ingresos
 * @param {Array} pagos - Array de pagos
 * @returns {Object} Objeto con totales
 */
export const calcularTotalesIngresos = (pagos) => {
  const pagosPagados = pagos.filter(p => p.estadoPago === 'Pagado');

  const totalBruto = pagosPagados.reduce((sum, p) => sum + p.montoBruto, 0);
  const totalComisiones = pagosPagados.reduce((sum, p) => sum + p.comisionAirbnb, 0);
  const totalNeto = pagosPagados.reduce((sum, p) => sum + p.montoNeto, 0);

  return {
    totalBruto,
    totalComisiones,
    totalNeto,
    numeroPagos: pagosPagados.length
  };
};

/**
 * Calcula totales de gastos
 * @param {Array} gastos - Array de gastos
 * @returns {Object} Objeto con totales
 */
export const calcularTotalesGastos = (gastos) => {
  const gastosPagados = gastos.filter(g => g.estatus === 'Pagado');

  const totalMonto = gastosPagados.reduce((sum, g) => sum + g.monto, 0);
  const totalIVA = gastosPagados.reduce((sum, g) => sum + g.iva, 0);
  const totalConIVA = gastosPagados.reduce((sum, g) => sum + g.totalConIVA, 0);

  return {
    totalMonto,
    totalIVA,
    totalConIVA,
    numeroGastos: gastosPagados.length
  };
};

/**
 * Calcula el estado de resultados
 * @param {number} totalIngresos - Total de ingresos netos
 * @param {number} totalGastos - Total de gastos
 * @returns {Object} Estado de resultados
 */
export const calcularEstadoResultados = (totalIngresos, totalGastos) => {
  const utilidad = totalIngresos - totalGastos;
  const margenUtilidad = totalIngresos > 0 ? (utilidad / totalIngresos) * 100 : 0;

  return {
    totalIngresos,
    totalGastos,
    utilidad,
    margenUtilidad: margenUtilidad.toFixed(2)
  };
};
