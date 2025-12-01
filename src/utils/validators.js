/**
 * Utilidades de validación para el sistema AirBnb
 */

import db from '../services/DatabaseService';

/**
 * Valida que un email sea válido
 * @param {string} email
 * @returns {boolean}
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida que un teléfono sea válido (formato mexicano 10 dígitos)
 * @param {string} telefono
 * @returns {boolean}
 */
export const validarTelefono = (telefono) => {
  const regex = /^\d{10}$/;
  return regex.test(telefono);
};

/**
 * Valida que una fecha sea válida y no sea pasada
 * @param {string} fecha - Formato YYYY-MM-DD
 * @returns {boolean}
 */
export const validarFechaFutura = (fecha) => {
  const fechaIngresada = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return fechaIngresada >= hoy;
};

/**
 * Valida que la fecha de fin sea posterior a la fecha de inicio
 * @param {string} fechaInicio - Formato YYYY-MM-DD
 * @param {string} fechaFin - Formato YYYY-MM-DD
 * @returns {boolean}
 */
export const validarRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  return fin > inicio;
};

/**
 * Valida que una propiedad no tenga reservas solapadas
 * @param {number} idPropiedad
 * @param {string} fechaInicio
 * @param {string} fechaFin
 * @param {number} idReservaActual - ID de reserva a excluir (para ediciones)
 * @returns {Object} { valido: boolean, mensaje: string }
 */
export const validarDisponibilidadPropiedad = (
  idPropiedad,
  fechaInicio,
  fechaFin,
  idReservaActual = null
) => {
  const reservas = db.getAll('reservaciones');

  const reservasPropiedad = reservas.filter(r =>
    r.idPropiedad === idPropiedad &&
    r.estadoReserva !== 'Cancelada' &&
    r.id !== idReservaActual
  );

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  for (const reserva of reservasPropiedad) {
    const resInicio = new Date(reserva.fechaInicio);
    const resFin = new Date(reserva.fechaFin);

    // Verificar si hay solapamiento
    const hayConflicto =
      (inicio >= resInicio && inicio < resFin) ||
      (fin > resInicio && fin <= resFin) ||
      (inicio <= resInicio && fin >= resFin);

    if (hayConflicto) {
      return {
        valido: false,
        mensaje: `La propiedad ya tiene una reserva del ${reserva.fechaInicio} al ${reserva.fechaFin}`
      };
    }
  }

  return {
    valido: true,
    mensaje: 'Propiedad disponible'
  };
};

/**
 * Valida que un usuario sea tipo Huésped
 * @param {number} idUsuario
 * @returns {boolean}
 */
export const validarEsHuesped = (idUsuario) => {
  const usuario = db.getById('usuarios', idUsuario);
  return usuario && usuario.tipoUsuario === 'Huésped';
};

/**
 * Valida que un usuario sea tipo Anfitrión
 * @param {number} idUsuario
 * @returns {boolean}
 */
export const validarEsAnfitrion = (idUsuario) => {
  const usuario = db.getById('usuarios', idUsuario);
  return usuario && usuario.tipoUsuario === 'Anfitrión';
};

/**
 * Valida que una propiedad pertenezca a un anfitrión
 * @param {number} idPropiedad
 * @param {number} idAnfitrion
 * @returns {boolean}
 */
export const validarPropiedadDeAnfitrion = (idPropiedad, idAnfitrion) => {
  const propiedad = db.getById('propiedades', idPropiedad);
  return propiedad && propiedad.idAnfitrion === idAnfitrion;
};

/**
 * Valida que un campo numérico sea positivo
 * @param {number} valor
 * @returns {boolean}
 */
export const validarNumeroPositivo = (valor) => {
  return typeof valor === 'number' && valor > 0;
};

/**
 * Valida que un campo de texto no esté vacío
 * @param {string} texto
 * @returns {boolean}
 */
export const validarTextoNoVacio = (texto) => {
  return typeof texto === 'string' && texto.trim().length > 0;
};

/**
 * Valida un registro completo de Usuario
 * @param {Object} usuario
 * @returns {Object} { valido: boolean, errores: Array }
 */
export const validarUsuario = (usuario) => {
  const errores = [];

  if (!validarTextoNoVacio(usuario.nombre)) {
    errores.push('El nombre es requerido');
  }

  if (!validarTextoNoVacio(usuario.apellido)) {
    errores.push('El apellido es requerido');
  }

  if (!validarEmail(usuario.email)) {
    errores.push('El email no es válido');
  }

  if (!validarTelefono(usuario.telefono)) {
    errores.push('El teléfono debe tener 10 dígitos');
  }

  if (!['Huésped', 'Anfitrión'].includes(usuario.tipoUsuario)) {
    errores.push('El tipo de usuario debe ser Huésped o Anfitrión');
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * Valida un registro completo de Propiedad
 * @param {Object} propiedad
 * @returns {Object} { valido: boolean, errores: Array }
 */
export const validarPropiedad = (propiedad) => {
  const errores = [];

  if (!validarTextoNoVacio(propiedad.nombre)) {
    errores.push('El nombre de la propiedad es requerido');
  }

  if (!validarTextoNoVacio(propiedad.direccion)) {
    errores.push('La dirección es requerida');
  }

  if (!validarNumeroPositivo(propiedad.capacidad)) {
    errores.push('La capacidad debe ser un número positivo');
  }

  if (!validarNumeroPositivo(propiedad.precioNoche)) {
    errores.push('El precio por noche debe ser un número positivo');
  }

  if (!validarEsAnfitrion(propiedad.idAnfitrion)) {
    errores.push('Debe seleccionar un anfitrión válido');
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * Valida un registro completo de Reservación
 * @param {Object} reservacion
 * @returns {Object} { valido: boolean, errores: Array }
 */
export const validarReservacion = (reservacion) => {
  const errores = [];

  if (!validarEsHuesped(reservacion.idHuesped)) {
    errores.push('Debe seleccionar un huésped válido');
  }

  if (!db.exists('propiedades', reservacion.idPropiedad)) {
    errores.push('Debe seleccionar una propiedad válida');
  }

  if (!validarRangoFechas(reservacion.fechaInicio, reservacion.fechaFin)) {
    errores.push('La fecha de fin debe ser posterior a la fecha de inicio');
  }

  const disponibilidad = validarDisponibilidadPropiedad(
    reservacion.idPropiedad,
    reservacion.fechaInicio,
    reservacion.fechaFin,
    reservacion.id
  );

  if (!disponibilidad.valido) {
    errores.push(disponibilidad.mensaje);
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * Valida un registro completo de Pago
 * @param {Object} pago
 * @returns {Object} { valido: boolean, errores: Array }
 */
export const validarPago = (pago) => {
  const errores = [];

  if (!db.exists('reservaciones', pago.idReserva)) {
    errores.push('Debe seleccionar una reservación válida');
  }

  if (!validarNumeroPositivo(pago.montoBruto)) {
    errores.push('El monto bruto debe ser un número positivo');
  }

  if (!['Efectivo', 'Tarjeta', 'Transferencia'].includes(pago.metodoPago)) {
    errores.push('Método de pago no válido');
  }

  return {
    valido: errores.length === 0,
    errores
  };
};
