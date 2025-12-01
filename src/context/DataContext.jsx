import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '../services/DatabaseService';
import { calcularTotalesIngresos, calcularTotalesGastos, calcularEstadoResultados } from '../utils/calculations';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Estados para cada tabla
  const [usuarios, setUsuarios] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [reservaciones, setReservaciones] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [gastos, setGastos] = useState([]);

  // Estado para totales del dashboard
  const [totales, setTotales] = useState({
    ingresos: 0,
    gastos: 0,
    utilidad: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  // Recalcular totales cuando cambien pagos o gastos
  useEffect(() => {
    calcularTotales();
  }, [pagos, gastos]);

  const cargarTodosLosDatos = () => {
    setUsuarios(db.getAll('usuarios'));
    setPropiedades(db.getAll('propiedades'));
    setReservaciones(db.getAll('reservaciones'));
    setPagos(db.getAll('pagos'));
    setMantenimientos(db.getAll('mantenimientos'));
    setGastos(db.getAll('gastos'));
  };

  const calcularTotales = () => {
    const totalesIngresos = calcularTotalesIngresos(pagos);
    const totalesGastos = calcularTotalesGastos(gastos);
    const er = calcularEstadoResultados(totalesIngresos.totalNeto, totalesGastos.totalConIVA);

    setTotales({
      ingresos: totalesIngresos.totalNeto,
      gastos: totalesGastos.totalConIVA,
      utilidad: er.utilidad
    });
  };

  // ==================
  // USUARIOS
  // ==================
  const crearUsuario = (usuario) => {
    const nuevoUsuario = db.create('usuarios', usuario);
    setUsuarios(db.getAll('usuarios'));
    return nuevoUsuario;
  };

  const actualizarUsuario = (id, updates) => {
    const usuarioActualizado = db.update('usuarios', id, updates);
    setUsuarios(db.getAll('usuarios'));
    return usuarioActualizado;
  };

  const eliminarUsuario = (id) => {
    const eliminado = db.delete('usuarios', id);
    if (eliminado) {
      setUsuarios(db.getAll('usuarios'));
    }
    return eliminado;
  };

  const obtenerUsuario = (id) => {
    return db.getById('usuarios', id);
  };

  const obtenerUsuariosPorTipo = (tipo) => {
    return db.filter('usuarios', u => u.tipoUsuario === tipo);
  };

  // ==================
  // PROPIEDADES
  // ==================
  const crearPropiedad = (propiedad) => {
    const nuevaPropiedad = db.create('propiedades', propiedad);
    setPropiedades(db.getAll('propiedades'));
    return nuevaPropiedad;
  };

  const actualizarPropiedad = (id, updates) => {
    const propiedadActualizada = db.update('propiedades', id, updates);
    setPropiedades(db.getAll('propiedades'));
    return propiedadActualizada;
  };

  const eliminarPropiedad = (id) => {
    const eliminado = db.delete('propiedades', id);
    if (eliminado) {
      setPropiedades(db.getAll('propiedades'));
    }
    return eliminado;
  };

  const obtenerPropiedad = (id) => {
    return db.getById('propiedades', id);
  };

  const obtenerPropiedadesPorAnfitrion = (idAnfitrion) => {
    return db.filter('propiedades', p => p.idAnfitrion === idAnfitrion);
  };

  const obtenerPropiedadesDisponibles = () => {
    return db.filter('propiedades', p => p.estatus === 'Disponible');
  };

  // ==================
  // RESERVACIONES
  // ==================
  const crearReservacion = (reservacion) => {
    const nuevaReservacion = db.create('reservaciones', reservacion);
    setReservaciones(db.getAll('reservaciones'));
    return nuevaReservacion;
  };

  const actualizarReservacion = (id, updates) => {
    const reservacionActualizada = db.update('reservaciones', id, updates);
    setReservaciones(db.getAll('reservaciones'));
    return reservacionActualizada;
  };

  const eliminarReservacion = (id) => {
    const eliminado = db.delete('reservaciones', id);
    if (eliminado) {
      setReservaciones(db.getAll('reservaciones'));
    }
    return eliminado;
  };

  const obtenerReservacion = (id) => {
    return db.getById('reservaciones', id);
  };

  const obtenerReservacionesPorHuesped = (idHuesped) => {
    return db.filter('reservaciones', r => r.idHuesped === idHuesped);
  };

  const obtenerReservacionesPorPropiedad = (idPropiedad) => {
    return db.filter('reservaciones', r => r.idPropiedad === idPropiedad);
  };

  // ==================
  // PAGOS
  // ==================
  const crearPago = (pago) => {
    const nuevoPago = db.create('pagos', pago);
    setPagos(db.getAll('pagos'));
    return nuevoPago;
  };

  const actualizarPago = (id, updates) => {
    const pagoActualizado = db.update('pagos', id, updates);
    setPagos(db.getAll('pagos'));
    return pagoActualizado;
  };

  const eliminarPago = (id) => {
    const eliminado = db.delete('pagos', id);
    if (eliminado) {
      setPagos(db.getAll('pagos'));
    }
    return eliminado;
  };

  const obtenerPago = (id) => {
    return db.getById('pagos', id);
  };

  const obtenerPagoPorReserva = (idReserva) => {
    return db.filter('pagos', p => p.idReserva === idReserva)[0];
  };

  // ==================
  // MANTENIMIENTOS
  // ==================
  const crearMantenimiento = (mantenimiento) => {
    const nuevoMantenimiento = db.create('mantenimientos', mantenimiento);
    setMantenimientos(db.getAll('mantenimientos'));
    return nuevoMantenimiento;
  };

  const actualizarMantenimiento = (id, updates) => {
    const mantenimientoActualizado = db.update('mantenimientos', id, updates);
    setMantenimientos(db.getAll('mantenimientos'));
    return mantenimientoActualizado;
  };

  const eliminarMantenimiento = (id) => {
    const eliminado = db.delete('mantenimientos', id);
    if (eliminado) {
      setMantenimientos(db.getAll('mantenimientos'));
    }
    return eliminado;
  };

  const obtenerMantenimiento = (id) => {
    return db.getById('mantenimientos', id);
  };

  const obtenerMantenimientosPorPropiedad = (idPropiedad) => {
    return db.filter('mantenimientos', m => m.idPropiedad === idPropiedad);
  };

  // ==================
  // GASTOS
  // ==================
  const crearGasto = (gasto) => {
    const nuevoGasto = db.create('gastos', gasto);
    setGastos(db.getAll('gastos'));
    return nuevoGasto;
  };

  const actualizarGasto = (id, updates) => {
    const gastoActualizado = db.update('gastos', id, updates);
    setGastos(db.getAll('gastos'));
    return gastoActualizado;
  };

  const eliminarGasto = (id) => {
    const eliminado = db.delete('gastos', id);
    if (eliminado) {
      setGastos(db.getAll('gastos'));
    }
    return eliminado;
  };

  const obtenerGasto = (id) => {
    return db.getById('gastos', id);
  };

  const obtenerGastosPorCategoria = (categoria) => {
    return db.filter('gastos', g => g.categoria === categoria);
  };

  // ==================
  // UTILIDADES
  // ==================
  const resetearDatos = () => {
    db.reset();
    cargarTodosLosDatos();
  };

  const value = {
    // Estados
    usuarios,
    propiedades,
    reservaciones,
    pagos,
    mantenimientos,
    gastos,
    totales,

    // Usuarios
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuario,
    obtenerUsuariosPorTipo,

    // Propiedades
    crearPropiedad,
    actualizarPropiedad,
    eliminarPropiedad,
    obtenerPropiedad,
    obtenerPropiedadesPorAnfitrion,
    obtenerPropiedadesDisponibles,

    // Reservaciones
    crearReservacion,
    actualizarReservacion,
    eliminarReservacion,
    obtenerReservacion,
    obtenerReservacionesPorHuesped,
    obtenerReservacionesPorPropiedad,

    // Pagos
    crearPago,
    actualizarPago,
    eliminarPago,
    obtenerPago,
    obtenerPagoPorReserva,

    // Mantenimientos
    crearMantenimiento,
    actualizarMantenimiento,
    eliminarMantenimiento,
    obtenerMantenimiento,
    obtenerMantenimientosPorPropiedad,

    // Gastos
    crearGasto,
    actualizarGasto,
    eliminarGasto,
    obtenerGasto,
    obtenerGastosPorCategoria,

    // Utilidades
    resetearDatos
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
