import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { formatearMoneda, formatearFecha } from '../../utils/calculations';
import './PagosModule.css';

const PagosModule = () => {
    const { pagos, reservaciones, usuarios, propiedades, actualizarPago } = useData();
    const [activeTab, setActiveTab] = useState('ingresos'); // 'ingresos' (Entradas) | 'dispersiones' (Salidas)
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedPayout, setSelectedPayout] = useState(null); // Can be single object or 'ALL'
    const [processing, setProcessing] = useState(false);

    // --- Métricas Financieras ---
    const metrics = useMemo(() => {
        let totalGMV = 0; // Gross Merchandise Value (Total procesado)
        let totalComision = 0; // Tu ganancia
        let deudaAnfitriones = 0; // Dinero en bóveda pendiente de dispersar
        let totalDispersado = 0; // Dinero ya pagado a anfitriones

        pagos.forEach(p => {
            // Solo contamos pagos exitosos para métricas reales
            if (p.estadoPago === 'Pagado' || p.estadoPago === 'Dispersado') {
                totalGMV += parseFloat(p.montoBruto);
                totalComision += parseFloat(p.comisionAirbnb);

                if (p.estadoDispersado) {
                    totalDispersado += parseFloat(p.montoNeto);
                } else {
                    deudaAnfitriones += parseFloat(p.montoNeto);
                }
            }
        });

        // Simulación de Saldo en Cuenta Maestra
        // Saldo = (Ingresos Totales - Comisiones) - (Pagos ya dispersados)
        // Es decir, el dinero que DEBERÍA estar en la cuenta para pagar a anfitriones
        const saldoEnCuenta = (totalGMV - totalComision) - totalDispersado;

        return {
            totalGMV,
            totalComision,
            deudaAnfitriones,
            totalDispersado,
            saldoEnCuenta
        };
    }, [pagos]);

    // --- Lógica de Dispersión ---
    const handleOpenPayout = (pago) => {
        // Encontrar info bancaria del anfitrión
        const reserva = reservaciones.find(r => r.id === pago.idReserva);
        const propiedad = propiedades.find(p => p.id === reserva?.idPropiedad);
        const anfitrion = usuarios.find(u => u.id === propiedad?.idAnfitrion);

        setSelectedPayout({
            ...pago,
            anfitrion
        });
        setShowPayoutModal(true);
    };

    const handlePayAll = () => {
        if (metrics.deudaAnfitriones <= 0) return;
        setSelectedPayout('ALL');
        setShowPayoutModal(true);
    };

    const handleConfirmPayout = () => {
        setProcessing(true);
        // Simular delay bancario
        setTimeout(() => {
            if (selectedPayout === 'ALL') {
                // Batch process all pending
                const pending = pagos.filter(p => p.estadoPago === 'Pagado' && !p.estadoDispersado);
                pending.forEach(p => {
                    actualizarPago(p.id, {
                        estadoDispersado: true,
                        fechaDispersion: new Date().toISOString().split('T')[0]
                    });
                });
                alert(`¡Se han procesado ${pending.length} pagos por un total de ${formatearMoneda(metrics.deudaAnfitriones)}!`);
            } else {
                // Single process
                actualizarPago(selectedPayout.id, {
                    estadoDispersado: true,
                    fechaDispersion: new Date().toISOString().split('T')[0]
                });
                alert(`¡Transferencia de ${formatearMoneda(selectedPayout.montoNeto)} exitosa!`);
            }

            setProcessing(false);
            setShowPayoutModal(false);
            setSelectedPayout(null);
        }, 2000);
    };

    // --- Renderizado de Tablas ---
    const renderIngresosTable = () => (
        <table className="pagos-table">
            <thead>
                <tr>
                    <th>Reserva ID</th>
                    <th>Fecha Pago</th>
                    <th>Huésped</th>
                    <th>Método</th>
                    <th>Monto Total</th>
                    <th>Tu Comisión</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {pagos.slice().reverse().map(pago => {
                    const reserva = reservaciones.find(r => r.id === pago.idReserva);
                    const huesped = usuarios.find(u => u.id === reserva?.idHuesped);

                    return (
                        <tr key={pago.id}>
                            <td style={{ color: '#495057' }}>#{pago.idReserva}</td>
                            <td style={{ color: '#495057' }}>{formatearFecha(pago.fechaPago)}</td>
                            <td style={{ color: '#495057' }}>{huesped ? `${huesped.nombre} ${huesped.apellido}` : 'Desconocido'}</td>
                            <td style={{ color: '#495057' }}>{pago.metodoPago}</td>
                            <td className="amount neutral" style={{ color: '#495057' }}>{formatearMoneda(pago.montoBruto)}</td>
                            <td className="amount income">+{formatearMoneda(pago.comisionAirbnb)}</td>
                            <td>
                                <span className={`status-badge ${pago.estadoPago.toLowerCase()}`}>
                                    {pago.estadoPago}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    const renderDispersionesTable = () => (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button
                    className="btn-primary"
                    style={{ backgroundColor: '#28a745', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={handlePayAll}
                    disabled={metrics.deudaAnfitriones <= 0}
                >
                    <span>💸</span> Pagar Todo ({formatearMoneda(metrics.deudaAnfitriones)})
                </button>
            </div>
            <table className="pagos-table">
                <thead>
                    <tr>
                        <th>Reserva ID</th>
                        <th>Anfitrión (Destino)</th>
                        <th>Monto a Pagar</th>
                        <th>Estado Dispersión</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.filter(p => p.estadoPago === 'Pagado').slice().reverse().map(pago => {
                        // Encontrar anfitrión a través de la propiedad de la reserva
                        const reserva = reservaciones.find(r => r.id === pago.idReserva);
                        const propiedad = propiedades.find(p => p.id === reserva?.idPropiedad);
                        const anfitrion = usuarios.find(u => u.id === propiedad?.idAnfitrion);

                        const isDispersado = pago.estadoDispersado === true;

                        return (
                            <tr key={pago.id}>
                                <td style={{ color: '#495057' }}>#{pago.idReserva}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 500, color: '#495057' }}>{anfitrion ? `${anfitrion.nombre} ${anfitrion.apellido}` : 'Desconocido'}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>{anfitrion?.datosBancarios?.banco || 'Banco No Reg.'}</span>
                                    </div>
                                </td>
                                <td className="amount expense">{formatearMoneda(pago.montoNeto)}</td>
                                <td>
                                    <span className={`status-badge ${isDispersado ? 'pagado' : 'pendiente'}`}>
                                        {isDispersado ? 'Dispersado' : 'En Bóveda'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-action"
                                        disabled={isDispersado}
                                        onClick={() => handleOpenPayout(pago)}
                                    >
                                        {isDispersado ? 'Completado' : 'Pagar Ahora'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );

    return (
        <div className="pagos-container">
            <div className="pagos-header">
                <h2>Billetera Virtual</h2>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#6c757d' }}>Saldo Disponible en Cuenta Maestra</span>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: '#2c3e50' }}>{formatearMoneda(metrics.saldoEnCuenta)}</span>
                </div>
            </div>

            {/* Dashboard Financiero */}
            <div className="metrics-grid">
                <div className="metric-card profit">
                    <span className="metric-title">Tu Utilidad Neta (Comisiones)</span>
                    <span className="metric-value">{formatearMoneda(metrics.totalComision)}</span>
                </div>
                <div className="metric-card debt">
                    <span className="metric-title">Por Pagar a Anfitriones</span>
                    <span className="metric-value">{formatearMoneda(metrics.deudaAnfitriones)}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-title">Volumen Total (GMV)</span>
                    <span className="metric-value">{formatearMoneda(metrics.totalGMV)}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-title">Total Dispersado</span>
                    <span className="metric-value">{formatearMoneda(metrics.totalDispersado)}</span>
                </div>
            </div>

            {/* Tabs de Navegación */}
            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'ingresos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ingresos')}
                >
                    Entradas (Ingresos)
                </button>
                <button
                    className={`tab-btn ${activeTab === 'dispersiones' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dispersiones')}
                >
                    Salidas (Dispersiones)
                </button>
            </div>

            {/* Tabla de Datos */}
            <div className="table-container">
                {activeTab === 'ingresos' ? renderIngresosTable() : renderDispersionesTable()}
            </div>

            {/* Modal de Dispersión */}
            {showPayoutModal && selectedPayout && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3>Confirmar Transferencia</h3>
                            <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setShowPayoutModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '3rem' }}>💸</span>
                                <h4 style={{ margin: '1rem 0', color: '#2c3e50' }}>
                                    {selectedPayout === 'ALL'
                                        ? `Dispersando Total: ${formatearMoneda(metrics.deudaAnfitriones)}`
                                        : `Estás enviando ${formatearMoneda(selectedPayout.montoNeto)}`
                                    }
                                </h4>
                            </div>

                            {selectedPayout === 'ALL' ? (
                                <div className="detail-section">
                                    <p style={{ textAlign: 'center', color: '#6c757d' }}>
                                        Se procesarán transferencias masivas a todos los anfitriones con saldo pendiente.
                                    </p>
                                </div>
                            ) : (
                                <div className="detail-section">
                                    <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#6c757d', fontSize: '0.9rem', textTransform: 'uppercase' }}>Datos del Beneficiario</h4>
                                    <div className="info-row">
                                        <span>Nombre:</span>
                                        <span>{selectedPayout.anfitrion?.datosBancarios?.titular || `${selectedPayout.anfitrion?.nombre} ${selectedPayout.anfitrion?.apellido}`}</span>
                                    </div>
                                    <div className="info-row">
                                        <span>Banco:</span>
                                        <span>{selectedPayout.anfitrion?.datosBancarios?.banco || 'No registrado'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span>CLABE / Cuenta:</span>
                                        <span style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{selectedPayout.anfitrion?.datosBancarios?.clabe || 'No registrada'}</span>
                                    </div>
                                </div>
                            )}

                            <div className="detail-section" style={{ marginTop: '1.5rem', background: '#fff3cd', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
                                    ⚠️ Esta acción restará los fondos de tu Cuenta Maestra y marcará la deuda como saldada.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowPayoutModal(false)} disabled={processing}>Cancelar</button>
                            <button className="btn-primary" onClick={handleConfirmPayout} disabled={processing}>
                                {processing ? 'Procesando...' : 'Confirmar Transferencia'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PagosModule;
