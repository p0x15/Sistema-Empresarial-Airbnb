import { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
    calcularNoches,
    calcularMontoReserva,
    formatearMoneda,
    formatearFecha
} from '../../utils/calculations';
import './ReservacionesModule.css';

const ReservacionesModule = () => {
    const {
        reservaciones,
        propiedades,
        usuarios,
        crearReservacion,
        crearPago // Para generar el pago automáticamente si se desea
    } = useData();

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        idHuesped: '',
        idPropiedad: '',
        fechaInicio: '',
        fechaFin: '',
        notas: ''
    });

    const [calculation, setCalculation] = useState({
        noches: 0,
        tarifaNoche: 0,
        total: 0
    });

    const [error, setError] = useState('');

    const [filterStatus, setFilterStatus] = useState('Todas'); // 'Todas' | 'Confirmadas' | 'Canceladas' | 'Activas' | 'Completadas'
    const [selectedReservation, setSelectedReservation] = useState(null);

    // --- Métricas ---
    const metrics = useMemo(() => {
        const totalPropiedades = propiedades.length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Propiedades reservadas hoy
        const reservedProperties = new Set();
        reservaciones.forEach(r => {
            if (r.estadoReserva === 'Confirmada') {
                const start = new Date(r.fechaInicio);
                const end = new Date(r.fechaFin);
                // Ajustar horas para comparación correcta
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);

                if (today >= start && today < end) {
                    reservedProperties.add(r.idPropiedad);
                }
            }
        });

        const propiedadesOcupadas = reservedProperties.size;
        const propiedadesDisponibles = totalPropiedades - propiedadesOcupadas;
        const ocupacionPorcentaje = totalPropiedades > 0
            ? ((propiedadesOcupadas / totalPropiedades) * 100).toFixed(1)
            : 0;

        // Próximas reservaciones (inicio > hoy)
        const proximasReservas = reservaciones.filter(r => {
            const start = new Date(r.fechaInicio);
            start.setHours(0, 0, 0, 0);
            return start > today && r.estadoReserva === 'Confirmada';
        }).length;

        return {
            totalPropiedades,
            propiedadesOcupadas,
            propiedadesDisponibles,
            ocupacionPorcentaje,
            proximasReservas
        };
    }, [propiedades, reservaciones]);


    // Efecto para recalcular totales cuando cambian fechas o propiedad
    useEffect(() => {
        if (formData.idPropiedad && formData.fechaInicio && formData.fechaFin) {
            const propiedad = propiedades.find(p => p.id === parseInt(formData.idPropiedad));

            if (propiedad) {
                const noches = calcularNoches(formData.fechaInicio, formData.fechaFin);
                const total = calcularMontoReserva(noches, propiedad.precioNoche);

                setCalculation({
                    noches,
                    tarifaNoche: propiedad.precioNoche,
                    total
                });
            }
        }
    }, [formData.idPropiedad, formData.fechaInicio, formData.fechaFin, propiedades]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Limpiar errores al escribir
    };

    const checkAvailability = () => {
        const start = new Date(formData.fechaInicio);
        const end = new Date(formData.fechaFin);

        // Validar fechas lógicas
        if (start >= end) {
            return "La fecha de fin debe ser posterior a la fecha de inicio.";
        }

        // Buscar conflictos
        const conflictos = reservaciones.filter(r => {
            if (r.idPropiedad !== parseInt(formData.idPropiedad)) return false;
            if (r.estadoReserva === 'Cancelada') return false;

            const rStart = new Date(r.fechaInicio);
            const rEnd = new Date(r.fechaFin);

            // Verificar solapamiento
            return (start < rEnd && end > rStart);
        });

        if (conflictos.length > 0) {
            return "La propiedad no está disponible en esas fechas.";
        }

        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.idHuesped || !formData.idPropiedad || !formData.fechaInicio || !formData.fechaFin) {
            setError("Por favor complete todos los campos requeridos.");
            return;
        }

        // Validar disponibilidad
        const availabilityError = checkAvailability();
        if (availabilityError) {
            setError(availabilityError);
            return;
        }

        // Crear reservación
        const nuevaReserva = {
            idHuesped: parseInt(formData.idHuesped),
            idPropiedad: parseInt(formData.idPropiedad),
            fechaInicio: formData.fechaInicio,
            fechaFin: formData.fechaFin,
            noches: calculation.noches,
            tarifaNoche: calculation.tarifaNoche,
            montoTotal: calculation.total,
            estadoReserva: 'Confirmada',
            notas: formData.notas || 'Reserva creada desde el sistema'
        };

        const reservaCreada = crearReservacion(nuevaReserva);

        // Resetear form
        setShowForm(false);
        setFormData({
            idHuesped: '',
            idPropiedad: '',
            fechaInicio: '',
            fechaFin: '',
            notas: ''
        });
        alert(`Reservación #${reservaCreada.id} creada exitosamente.`);
    };

    // Filtrar solo huéspedes para el select
    const huespedes = usuarios.filter(u => u.tipoUsuario === 'Huésped');

    // Lógica de filtrado de lista
    const filteredReservations = reservaciones.filter(r => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(r.fechaInicio);
        const end = new Date(r.fechaFin);
        // Ajustar horas para evitar problemas de zona horaria
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (filterStatus === 'Todas') return true;

        if (filterStatus === 'Canceladas') {
            return r.estadoReserva === 'Cancelada';
        }

        if (filterStatus === 'Completadas') {
            // Completadas explícitas o fechas pasadas
            return r.estadoReserva === 'Completada' || (r.estadoReserva === 'Confirmada' && end <= today);
        }

        if (filterStatus === 'Activas') {
            // En curso actualmente
            return r.estadoReserva === 'Confirmada' && start <= today && end > today;
        }

        if (filterStatus === 'Confirmadas') {
            // Futuras confirmadas
            return r.estadoReserva === 'Confirmada' && start > today;
        }

        return true;
    }).slice().reverse();

    // Helper para obtener datos completos para el modal
    const getReservationDetails = (reservation) => {
        const propiedad = propiedades.find(p => p.id === reservation.idPropiedad);
        const huesped = usuarios.find(u => u.id === reservation.idHuesped);
        // Asumimos que el anfitrión es un usuario, buscamos por idAnfitrion de la propiedad
        const anfitrion = propiedad ? usuarios.find(u => u.id === propiedad.idAnfitrion) : null;

        return {
            ...reservation,
            propiedad,
            huesped,
            anfitrion
        };
    };

    return (
        <div className="reservaciones-container">
            <div className="reservaciones-header">
                <h2>Gestión de Reservaciones</h2>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancelar' : '+ Nueva Reservación'}
                </button>
            </div>

            {/* Métricas Section */}
            <div className="metrics-grid">
                <div className="metric-card blue">
                    <span className="metric-title">Propiedades Totales</span>
                    <span className="metric-value">{metrics.totalPropiedades}</span>
                    <span className="metric-subtext">En catálogo</span>
                </div>
                <div className="metric-card green">
                    <span className="metric-title">Disponibles Hoy</span>
                    <span className="metric-value">{metrics.propiedadesDisponibles}</span>
                    <span className="metric-subtext">Listas para reservar</span>
                </div>
                <div className="metric-card orange">
                    <span className="metric-title">Ocupación Actual</span>
                    <span className="metric-value">{metrics.ocupacionPorcentaje}%</span>
                    <span className="metric-subtext">{metrics.propiedadesOcupadas} propiedades ocupadas</span>
                </div>
                <div className="metric-card teal">
                    <span className="metric-title">Próximas Reservas</span>
                    <span className="metric-value">{metrics.proximasReservas}</span>
                    <span className="metric-subtext">Confirmadas a futuro</span>
                </div>
            </div>

            {showForm && (
                <div className="reservation-form-card">
                    <h3>Nueva Reservación</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Huésped</label>
                                <select
                                    name="idHuesped"
                                    value={formData.idHuesped}
                                    onChange={handleInputChange}
                                    className="form-control"
                                >
                                    <option value="">Seleccione un huésped...</option>
                                    {huespedes.map(h => (
                                        <option key={h.id} value={h.id}>
                                            {h.nombre} {h.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Propiedad</label>
                                <select
                                    name="idPropiedad"
                                    value={formData.idPropiedad}
                                    onChange={handleInputChange}
                                    className="form-control"
                                >
                                    <option value="">Seleccione una propiedad...</option>
                                    {propiedades.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre} ({formatearMoneda(p.precioNoche)}/noche)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Fecha Inicio</label>
                                <input
                                    type="date"
                                    name="fechaInicio"
                                    value={formData.fechaInicio}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Fecha Fin</label>
                                <input
                                    type="date"
                                    name="fechaFin"
                                    value={formData.fechaFin}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label>Notas</label>
                            <textarea
                                name="notas"
                                value={formData.notas}
                                onChange={handleInputChange}
                                className="form-control"
                                rows="2"
                            />
                        </div>

                        {calculation.total > 0 && (
                            <div className="summary-box">
                                <div className="summary-row">
                                    <span>Tarifa por noche:</span>
                                    <span>{formatearMoneda(calculation.tarifaNoche)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Noches:</span>
                                    <span>{calculation.noches}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total a Pagar:</span>
                                    <span>{formatearMoneda(calculation.total)}</span>
                                </div>
                            </div>
                        )}

                        {error && <div className="error-msg" style={{ marginBottom: '1rem' }}>{error}</div>}

                        <div className="form-actions">
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary">
                                Confirmar Reservación
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter Bar */}
            <div className="filter-bar">
                {['Todas', 'Confirmadas', 'Activas', 'Completadas', 'Canceladas'].map(status => (
                    <button
                        key={status}
                        className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="reservations-list">
                {filteredReservations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
                        No se encontraron reservaciones con este filtro.
                    </div>
                ) : (
                    filteredReservations.map(reserva => {
                        const propiedad = propiedades.find(p => p.id === reserva.idPropiedad);
                        const huesped = usuarios.find(u => u.id === reserva.idHuesped);

                        return (
                            <div
                                key={reserva.id}
                                className="reservation-card"
                                onClick={() => setSelectedReservation(getReservationDetails(reserva))}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="res-id">#{reserva.id}</div>
                                <div className="res-info">
                                    <h4 style={{ color: '#495057' }}>{propiedad?.nombre || 'Propiedad desconocida'}</h4>
                                    <p style={{ color: '#495057' }}>Huésped: {huesped?.nombre} {huesped?.apellido}</p>
                                    <p style={{ color: '#6c757d' }}><i>{reserva.notas}</i></p>
                                </div>
                                <div className="res-dates">
                                    <span className="date-range">
                                        {formatearFecha(reserva.fechaInicio)} - {formatearFecha(reserva.fechaFin)}
                                    </span>
                                    <span className="nights">{reserva.noches} noches</span>
                                </div>
                                <div className="res-status">
                                    <span className="res-price">{formatearMoneda(reserva.montoTotal)}</span>
                                    <span className={`status-badge ${reserva.estadoReserva.toLowerCase()}`}>
                                        {reserva.estadoReserva}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Detail Modal */}
            {selectedReservation && (
                <div className="modal-overlay" onClick={() => setSelectedReservation(null)}>
                    <div className="detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Detalles de Reservación #{selectedReservation.id}</h3>
                            <button className="btn-close-modal" onClick={() => setSelectedReservation(null)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="detail-section">
                                <h4>Información de la Propiedad</h4>
                                <div className="info-row">
                                    <span>Propiedad:</span>
                                    <span>{selectedReservation.propiedad?.nombre}</span>
                                </div>
                                <div className="info-row">
                                    <span>Ubicación:</span>
                                    <span>{selectedReservation.propiedad?.ciudad}, {selectedReservation.propiedad?.estado}</span>
                                </div>
                                <div className="info-row">
                                    <span>Zona:</span>
                                    <span>{selectedReservation.propiedad?.zona}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Información del Huésped</h4>
                                <div className="info-row">
                                    <span>Nombre:</span>
                                    <span>{selectedReservation.huesped?.nombre} {selectedReservation.huesped?.apellido}</span>
                                </div>
                                <div className="info-row">
                                    <span>Email:</span>
                                    <span>{selectedReservation.huesped?.email}</span>
                                </div>
                                <div className="info-row">
                                    <span>Teléfono:</span>
                                    <span>{selectedReservation.huesped?.telefono}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Información del Anfitrión</h4>
                                <div className="info-row">
                                    <span>Nombre:</span>
                                    <span>{selectedReservation.anfitrion?.nombre || 'No asignado'} {selectedReservation.anfitrion?.apellido}</span>
                                </div>
                                <div className="info-row">
                                    <span>Email:</span>
                                    <span>{selectedReservation.anfitrion?.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Detalles Financieros</h4>
                                <div className="info-row">
                                    <span>Fechas:</span>
                                    <span>{formatearFecha(selectedReservation.fechaInicio)} - {formatearFecha(selectedReservation.fechaFin)}</span>
                                </div>
                                <div className="info-row">
                                    <span>Duración:</span>
                                    <span>{selectedReservation.noches} noches</span>
                                </div>
                                <div className="info-row">
                                    <span>Precio por noche:</span>
                                    <span>{formatearMoneda(selectedReservation.tarifaNoche)}</span>
                                </div>
                                <div className="info-row" style={{ marginTop: '0.5rem', fontWeight: '700', fontSize: '1.1rem' }}>
                                    <span>Total:</span>
                                    <span>{formatearMoneda(selectedReservation.montoTotal)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setSelectedReservation(null)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservacionesModule;
