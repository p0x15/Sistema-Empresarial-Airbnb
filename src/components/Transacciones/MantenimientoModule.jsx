import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { formatearMoneda, formatearFecha } from '../../utils/calculations';
import './MantenimientoModule.css';

const MantenimientoModule = () => {
    const { mantenimientos, propiedades, crearMantenimiento, actualizarMantenimiento } = useData();
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('Todos'); // 'Todos', 'Pendiente', 'En proceso', 'Completado'
    const [selectedMant, setSelectedMant] = useState(null); // For detail view

    const initialFormState = {
        idPropiedad: '',
        tipo: 'Correctivo',
        descripcion: '',
        fechaProgramada: new Date().toISOString().split('T')[0],
        costoBase: '', // Costo Proveedor
        totalCobrado: '', // Precio al Anfitrión
        estatus: 'Pendiente'
    };

    const [formData, setFormData] = useState(initialFormState);

    // --- Métricas ---
    const metrics = useMemo(() => {
        let totalCosto = 0;
        let totalCobrado = 0;
        let activos = 0;

        mantenimientos.forEach(m => {
            totalCosto += parseFloat(m.costoBase || 0);
            totalCobrado += parseFloat(m.totalCobrado || 0);
            if (m.estatus === 'En proceso' || m.estatus === 'Pendiente') {
                activos++;
            }
        });

        const utilidad = totalCobrado - totalCosto;
        const margen = totalCobrado > 0 ? ((utilidad / totalCobrado) * 100).toFixed(1) : 0;

        return {
            activos,
            totalCosto,
            totalCobrado,
            utilidad,
            margen
        };
    }, [mantenimientos]);

    // --- Filtrado ---
    const filteredList = mantenimientos.filter(m => {
        if (filterStatus === 'Todos') return true;
        return m.estatus === filterStatus;
    }).slice().reverse();

    // --- Handlers ---
    const handleOpenModal = (mant = null) => {
        if (mant) {
            setFormData({
                ...mant,
                idPropiedad: mant.idPropiedad.toString()
            });
        } else {
            setFormData(initialFormState);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData(initialFormState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSave = {
            ...formData,
            idPropiedad: parseInt(formData.idPropiedad),
            costoBase: parseFloat(formData.costoBase),
            totalCobrado: parseFloat(formData.totalCobrado),
            // Calcular comisiones implícitas si es necesario, por ahora simple
            porcentajeComision: 0,
            comisionPlataforma: parseFloat(formData.totalCobrado) - parseFloat(formData.costoBase)
        };

        if (dataToSave.id) {
            actualizarMantenimiento(dataToSave.id, dataToSave);
        } else {
            crearMantenimiento(dataToSave);
        }
        handleCloseModal();
    };

    // Helper para calcular utilidad en tiempo real en el form
    const formUtilidad = (formData.totalCobrado && formData.costoBase)
        ? parseFloat(formData.totalCobrado) - parseFloat(formData.costoBase)
        : 0;

    return (
        <div className="mantenimiento-container">
            <div className="mantenimiento-header">
                <h2>Centro de Mantenimiento</h2>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    + Nueva Orden
                </button>
            </div>

            {/* Metrics Dashboard */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <span className="metric-title">Órdenes Activas</span>
                    <span className="metric-value">{metrics.activos}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-title">Facturación Total</span>
                    <span className="metric-value">{formatearMoneda(metrics.totalCobrado)}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-title">Costo Proveedores</span>
                    <span className="metric-value" style={{ color: '#dc3545' }}>{formatearMoneda(metrics.totalCosto)}</span>
                </div>
                <div className="metric-card profit">
                    <span className="metric-title">Utilidad Neta</span>
                    <span className="metric-value">{formatearMoneda(metrics.utilidad)}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Margen: {metrics.margen}%</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                {['Todos', 'Pendiente', 'En proceso', 'Completado'].map(status => (
                    <button
                        key={status}
                        className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="mantenimiento-list">
                {filteredList.map(item => {
                    const propiedad = propiedades.find(p => p.id === item.idPropiedad);
                    const utilidadItem = item.totalCobrado - item.costoBase;

                    return (
                        <div key={item.id} className="mantenimiento-card" onClick={() => handleOpenModal(item)}>
                            <div className="mant-icon">
                                {item.tipo === 'Limpieza' ? '🧹' : item.tipo === 'Preventivo' ? '🛡️' : '🔧'}
                            </div>
                            <div className="mant-info">
                                <h4>{propiedad?.nombre || 'Propiedad Desconocida'}</h4>
                                <p>{item.descripcion}</p>
                                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>📅 {formatearFecha(item.fechaProgramada)}</p>
                            </div>
                            <div className="mant-financials">
                                <span style={{ display: 'block', color: '#6c757d', fontSize: '0.85rem' }}>Cobro: {formatearMoneda(item.totalCobrado)}</span>
                                <span className="profit-badge">+{formatearMoneda(utilidadItem)}</span>
                            </div>
                            <div className="mant-status">
                                <span className={`status-badge ${item.estatus.toLowerCase().replace(' ', '-')}`}>
                                    {item.estatus}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{formData.id ? 'Editar Orden' : 'Nueva Orden de Servicio'}</h3>
                            <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={handleCloseModal}>✕</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Propiedad</label>
                                        <select
                                            name="idPropiedad"
                                            value={formData.idPropiedad}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        >
                                            <option value="">Seleccione una propiedad...</option>
                                            {propiedades.map(p => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Tipo de Servicio</label>
                                        <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="form-control">
                                            <option value="Correctivo">Correctivo (Reparación)</option>
                                            <option value="Preventivo">Preventivo</option>
                                            <option value="Limpieza">Limpieza</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Fecha Programada</label>
                                        <input
                                            type="date"
                                            name="fechaProgramada"
                                            value={formData.fechaProgramada}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Descripción del Problema/Servicio</label>
                                        <textarea
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            rows="2"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Costo Proveedor ($)</label>
                                        <input
                                            type="number"
                                            name="costoBase"
                                            value={formData.costoBase}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Precio al Anfitrión ($)</label>
                                        <input
                                            type="number"
                                            name="totalCobrado"
                                            value={formData.totalCobrado}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Estatus</label>
                                        <select name="estatus" value={formData.estatus} onChange={handleInputChange} className="form-control">
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En proceso">En proceso</option>
                                            <option value="Completado">Completado</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="financial-summary">
                                    <div className="fin-row">
                                        <span>Costo Real:</span>
                                        <span>{formatearMoneda(formData.costoBase || 0)}</span>
                                    </div>
                                    <div className="fin-row">
                                        <span>Precio Venta:</span>
                                        <span>{formatearMoneda(formData.totalCobrado || 0)}</span>
                                    </div>
                                    <div className="fin-row profit">
                                        <span>Tu Utilidad Estimada:</span>
                                        <span>{formatearMoneda(formUtilidad)}</span>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={handleCloseModal} className="btn-secondary">Cancelar</button>
                                    <button type="submit" className="btn-primary">Guardar Orden</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MantenimientoModule;
