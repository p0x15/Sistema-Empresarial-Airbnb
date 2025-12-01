import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { formatearMoneda, formatearFecha } from '../../utils/calculations';
import './GastosModule.css';

const GastosModule = () => {
    const { gastos, pagos, mantenimientos, crearGasto, eliminarGasto } = useData();
    const [showModal, setShowModal] = useState(false);

    const initialFormState = {
        fecha: new Date().toISOString().split('T')[0],
        categoria: 'Operativo',
        descripcion: '',
        proveedor: '',
        monto: '',
        iva: '',
        estatus: 'Pagado'
    };
    const [formData, setFormData] = useState(initialFormState);

    // --- P&L Calculation (Estado de Resultados) ---
    const financials = useMemo(() => {
        // 1. Ingresos Reales (Comisiones de Reservas)
        let totalIngresos = 0;
        pagos.forEach(p => {
            if (p.estadoPago === 'Pagado' || p.estadoPago === 'Dispersado') {
                totalIngresos += parseFloat(p.comisionAirbnb);
            }
        });

        // 2. Ingresos por Mantenimiento (Utilidad)
        mantenimientos.forEach(m => {
            if (m.estatus === 'Completado') {
                const utilidad = parseFloat(m.totalCobrado) - parseFloat(m.costoBase);
                totalIngresos += utilidad;
            }
        });

        // 3. Gastos Operativos (Registrados en este módulo)
        let totalGastos = 0;
        const gastosPorCategoria = {};

        gastos.forEach(g => {
            const monto = parseFloat(g.totalConIVA);
            totalGastos += monto;

            if (!gastosPorCategoria[g.categoria]) {
                gastosPorCategoria[g.categoria] = 0;
            }
            gastosPorCategoria[g.categoria] += monto;
        });

        // 4. Utilidad Neta Final
        const utilidadNeta = totalIngresos - totalGastos;

        return {
            totalIngresos,
            totalGastos,
            utilidadNeta,
            gastosPorCategoria
        };
    }, [gastos, pagos, mantenimientos]);

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const monto = parseFloat(formData.monto);
        const iva = formData.iva ? parseFloat(formData.iva) : 0;

        crearGasto({
            ...formData,
            monto,
            iva,
            totalConIVA: monto + iva
        });

        setShowModal(false);
        setFormData(initialFormState);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Eliminar este registro de gasto?')) {
            eliminarGasto(id);
        }
    };

    return (
        <div className="gastos-container">
            <div className="gastos-header">
                <h2>Monitor de Salud Financiera</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + Registrar Gasto
                </button>
            </div>

            {/* P&L Dashboard */}
            <div className="pnl-grid">
                <div className="pnl-card income">
                    <span className="pnl-title">Ingresos Totales (Comisiones + Servicios)</span>
                    <span className="pnl-value">{formatearMoneda(financials.totalIngresos)}</span>
                </div>
                <div className="pnl-card expense">
                    <span className="pnl-title">Gastos Operativos Totales</span>
                    <span className="pnl-value">{formatearMoneda(financials.totalGastos)}</span>
                </div>
                <div className="pnl-card net">
                    <span className="pnl-title">UTILIDAD NETA REAL</span>
                    <span className="pnl-value">{formatearMoneda(financials.utilidadNeta)}</span>
                </div>
            </div>

            {/* Breakdown Chart */}
            <div className="categories-chart">
                <h3 className="chart-title">Desglose de Gastos por Categoría</h3>
                {Object.entries(financials.gastosPorCategoria).map(([cat, amount]) => {
                    const percentage = (amount / financials.totalGastos) * 100;
                    return (
                        <div key={cat} className="bar-container">
                            <span className="bar-label">{cat}</span>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="bar-value">{formatearMoneda(amount)}</span>
                        </div>
                    );
                })}
                {financials.totalGastos === 0 && <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No hay gastos registrados aún.</p>}
            </div>

            {/* Expenses List */}
            <div className="gastos-list">
                <table className="gastos-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Categoría</th>
                            <th>Descripción</th>
                            <th>Proveedor</th>
                            <th>Total (c/IVA)</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.slice().reverse().map(gasto => (
                            <tr key={gasto.id}>
                                <td>{formatearFecha(gasto.fecha)}</td>
                                <td><span className="category-tag">{gasto.categoria}</span></td>
                                <td>{gasto.descripcion}</td>
                                <td>{gasto.proveedor}</td>
                                <td style={{ fontWeight: 600, color: '#dc3545' }}>{formatearMoneda(gasto.totalConIVA)}</td>
                                <td>
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#dc3545', border: 'none' }}
                                        onClick={() => handleDelete(gasto.id)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Registrar Nuevo Gasto</h3>
                            <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Fecha</label>
                                    <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="form-control">
                                        <option value="Operativo">Operativo (Oficina, Luz, Agua)</option>
                                        <option value="Software">Software & Suscripciones</option>
                                        <option value="Marketing">Marketing & Publicidad</option>
                                        <option value="Nómina">Nómina & Honorarios</option>
                                        <option value="Mantenimiento de propiedades">Mantenimiento (Gasto Propio)</option>
                                        <option value="Impuestos">Impuestos & Legal</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} className="form-control" placeholder="Ej. Campaña Facebook Ads Enero" required />
                                </div>
                                <div className="form-group">
                                    <label>Proveedor</label>
                                    <input type="text" name="proveedor" value={formData.proveedor} onChange={handleInputChange} className="form-control" placeholder="Ej. Meta Platforms" required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Monto ($)</label>
                                        <input type="number" name="monto" value={formData.monto} onChange={handleInputChange} className="form-control" placeholder="0.00" required />
                                    </div>
                                    <div className="form-group">
                                        <label>IVA ($)</label>
                                        <input type="number" name="iva" value={formData.iva} onChange={handleInputChange} className="form-control" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn-primary">Guardar Gasto</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GastosModule;
