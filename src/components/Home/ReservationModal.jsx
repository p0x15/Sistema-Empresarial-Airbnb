import React from 'react';
import { formatearMoneda } from '../../utils/calculations';
import './HomePage.css'; // Reusing existing styles

const ReservationModal = ({
    isOpen,
    onClose,
    onConfirm,
    reservationData,
    property,
    guestName
}) => {
    if (!isOpen || !reservationData || !property) return null;

    const { checkIn, checkOut, total, noches } = reservationData;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="login-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <button className="btn-close" onClick={onClose}>✕</button>
                    <h2>Confirma y paga</h2>
                </div>
                <div className="modal-body">
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #ebebeb', paddingBottom: '1.5rem' }}>
                        <img
                            src={property.imagen || `https://source.unsplash.com/random/120x120/?house,${property.id}`}
                            alt={property.nombre}
                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{property.nombre}</h3>
                            <p style={{ margin: 0, color: '#717171', fontSize: '0.9rem' }}>{property.tipoPropiedad} en {property.zona}</p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>★ 4.9 (120 reseñas)</p>
                        </div>
                    </div>

                    <div className="reservation-details">
                        <h3 className="welcome-text" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Tu viaje</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ fontWeight: '600' }}>Fechas</div>
                                <div style={{ fontSize: '0.95rem', color: '#717171' }}>
                                    {formatDate(checkIn)} – {formatDate(checkOut)}
                                </div>
                            </div>
                            <div style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}>Editar</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ fontWeight: '600' }}>Huéspedes</div>
                                <div style={{ fontSize: '0.95rem', color: '#717171' }}>1 huésped</div>
                            </div>
                            <div style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}>Editar</div>
                        </div>

                        <h3 className="welcome-text" style={{ fontSize: '1.2rem', marginBottom: '1rem', marginTop: '2rem' }}>Detalles del precio</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#717171' }}>{formatearMoneda(property.precioNoche)} x {noches} noches</span>
                            <span>{formatearMoneda(total)}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#717171' }}>Tarifa de limpieza</span>
                            <span>$500.00</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#717171' }}>Tarifa por servicio Airbnb</span>
                            <span>$0.00</span>
                        </div>

                        <div style={{ borderTop: '1px solid #ebebeb', margin: '1rem 0' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem' }}>
                            <span>Total (MXN)</span>
                            <span>{formatearMoneda(total + 500)}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button
                            className="btn-submit-login"
                            onClick={onConfirm}
                            style={{ width: '100%', fontSize: '1.1rem' }}
                        >
                            Confirmar y pagar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
