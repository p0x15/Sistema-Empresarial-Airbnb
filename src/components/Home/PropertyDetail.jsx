import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { formatearMoneda, calcularNoches, calcularMontoReserva } from '../../utils/calculations';
import Calendar from './Calendar';
import './PropertyDetail.css';

const PropertyDetail = ({ property, onBack, onReserve, isUserLoggedIn }) => {
    const { reservaciones } = useData();
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [total, setTotal] = useState(0);
    const [noches, setNoches] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);

    if (!property) return null;

    // Obtener fechas reservadas para esta propiedad
    const bookedDates = reservaciones
        .filter(r => r.idPropiedad === property.id && r.estadoReserva !== 'Cancelada')
        .map(r => ({ start: new Date(r.fechaInicio), end: new Date(r.fechaFin) }));

    useEffect(() => {
        if (checkIn && checkOut) {
            const n = calcularNoches(checkIn.toISOString(), checkOut.toISOString());
            setNoches(n);
            setTotal(calcularMontoReserva(n, property.precioNoche));
        } else {
            setNoches(0);
            setTotal(0);
        }
    }, [checkIn, checkOut, property.precioNoche]);

    const handleDateSelect = ({ start, end }) => {
        setCheckIn(start);
        setCheckOut(end);
        if (start && end) {
            // Keep calendar open for a moment or close it? Let's keep it open or let user close
            // Actually, usually it closes after selection or user clicks close.
            // Let's leave it open so they can see the range.
        }
    };

    const handleReserve = () => {
        if (!checkIn || !checkOut) return;
        onReserve({
            checkIn: checkIn.toISOString().split('T')[0],
            checkOut: checkOut.toISOString().split('T')[0],
            noches,
            total
        });
    };

    const formatDate = (date) => {
        if (!date) return 'Agrega fecha';
        return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="property-detail-container">
            <button className="btn-back" onClick={onBack}>
                ← Volver al inicio
            </button>

            <div className="detail-header">
                <h1>{property.nombre}</h1>
                <div className="detail-subtitle">
                    <span>★ 4.9</span>
                    <span>•</span>
                    <span>{property.ciudad}, {property.estado}, {property.pais}</span>
                </div>
            </div>

            <div className="detail-images">
                <img
                    src={property.imagen || `https://source.unsplash.com/random/800x600/?house,interior,${property.id}`}
                    alt={property.nombre}
                    className="main-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Vista+Principal' }}
                />
                <div className="secondary-images">
                    <img
                        src={`https://source.unsplash.com/random/400x300/?bedroom,${property.id}`}
                        alt="Bedroom"
                        className="sec-image"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Habitacion' }}
                    />
                    <img
                        src={`https://source.unsplash.com/random/400x300/?kitchen,${property.id}`}
                        alt="Kitchen"
                        className="sec-image"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Cocina' }}
                    />
                </div>
            </div>

            <div className="detail-content">
                <div className="info-section">
                    <div className="host-info">
                        <h2>{property.tipoPropiedad} en {property.zona}</h2>
                        <p>{property.capacidad} huéspedes • {property.numHabitaciones} habitaciones • {property.numBanos} baños</p>
                    </div>

                    <div className="description">
                        <h3>Acerca de este espacio</h3>
                        <p style={{ lineHeight: '1.6', color: '#484848' }}>
                            Disfruta de una estancia inolvidable en esta hermosa propiedad ubicada en el corazón de {property.zona}.
                            Ideal para relajarse y desconectar, con todas las comodidades que necesitas para sentirte como en casa.
                            Cuenta con espacios amplios, iluminación natural y una decoración moderna.
                        </p>
                    </div>

                    <div className="amenities" style={{ marginTop: '2rem' }}>
                        <h3>Lo que ofrece este lugar</h3>
                        <div className="amenities-list">
                            {property.wifi && <div className="amenity-item">📶 Wifi de alta velocidad</div>}
                            {property.aireAcondicionado && <div className="amenity-item">❄️ Aire acondicionado</div>}
                            {property.tieneAlberca && <div className="amenity-item">🏊 Alberca privada</div>}
                            {property.tieneEstacionamiento && <div className="amenity-item">🚗 Estacionamiento gratuito</div>}
                            {property.mascotasPermitidas && <div className="amenity-item">🐾 Mascotas permitidas</div>}
                            <div className="amenity-item">🍳 Cocina equipada</div>
                            <div className="amenity-item">📺 TV con streaming</div>
                        </div>
                    </div>
                </div>

                <div className="booking-sidebar">
                    <div className="booking-card" style={{ position: 'relative' }}>
                        <div className="price-header">
                            <div>
                                <span className="price-large">{formatearMoneda(property.precioNoche)}</span>
                                <span style={{ color: '#717171' }}> noche</span>
                            </div>
                            <span>★ 4.9</span>
                        </div>

                        <div className="date-selection" onClick={() => setShowCalendar(true)} style={{ cursor: 'pointer' }}>
                            <div className="date-input-group">
                                <label>Llegada</label>
                                <div className="date-display">{formatDate(checkIn)}</div>
                            </div>
                            <div className="date-input-group">
                                <label>Salida</label>
                                <div className="date-display">{formatDate(checkOut)}</div>
                            </div>
                        </div>

                        {showCalendar && (
                            <Calendar
                                bookedDates={bookedDates}
                                startDate={checkIn}
                                endDate={checkOut}
                                onSelect={handleDateSelect}
                                onClose={() => setShowCalendar(false)}
                            />
                        )}

                        {noches > 0 && (
                            <div className="price-breakdown">
                                <div className="breakdown-row">
                                    <span>{formatearMoneda(property.precioNoche)} x {noches} noches</span>
                                    <span>{formatearMoneda(total)}</span>
                                </div>
                                <div className="breakdown-total">
                                    <span>Total</span>
                                    <span>{formatearMoneda(total)}</span>
                                </div>
                            </div>
                        )}

                        <button
                            className="btn-reserve"
                            onClick={handleReserve}
                            disabled={!checkIn || !checkOut}
                            style={{ opacity: (!checkIn || !checkOut) ? 0.5 : 1 }}
                        >
                            Reservar
                        </button>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
