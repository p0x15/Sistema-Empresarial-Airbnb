import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { formatearMoneda } from '../../utils/calculations';
import PropertyDetail from './PropertyDetail';
import LoginModal from './LoginModal';
import ReservationModal from './ReservationModal';
import './HomePage.css';

const HomePage = ({ onLogin, isUserLoggedIn }) => {
    const { propiedades, crearUsuario, crearReservacion, usuarios } = useData();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [modalMode, setModalMode] = useState('selection'); // 'selection' | 'login' | 'register'
    const [loginRole, setLoginRole] = useState('user'); // 'user' | 'admin'
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [pendingReservation, setPendingReservation] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const processReservation = () => {
        if (!pendingReservation || !currentUser) return;

        // Add cleaning fee to total
        const finalTotal = pendingReservation.total + 500;

        const nuevaReserva = {
            idPropiedad: selectedProperty.id,
            idHuesped: currentUser.id,
            fechaInicio: pendingReservation.checkIn,
            fechaFin: pendingReservation.checkOut,
            noches: pendingReservation.noches,
            tarifaNoche: selectedProperty.precioNoche,
            montoTotal: finalTotal, // Changed from 'total' to match admin module expectation
            estadoReserva: 'Confirmada',
            fechaCreacion: new Date().toISOString(),
            notas: 'Reserva web'
        };
        crearReservacion(nuevaReserva);
        alert(`¡Reserva confirmada con éxito!\nTotal: ${formatearMoneda(finalTotal)}`);

        // Reset states
        setShowReservationModal(false);
        setSelectedProperty(null);
        setPendingReservation(null);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        let user = null;

        if (modalMode === 'register') {
            // Crear nuevo usuario
            const nuevoUsuario = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                telefono: formData.telefono,
                tipoUsuario: 'Huésped',
                fechaRegistro: new Date().toISOString().split('T')[0]
            };

            user = crearUsuario(nuevoUsuario);
            alert(`¡Bienvenido ${formData.nombre}! Tu perfil ha sido creado.`);
            onLogin('user');
        } else {
            // Simulación de login normal
            const existingUser = usuarios.find(u => u.tipoUsuario === 'Huésped');
            user = existingUser || { id: 1, nombre: 'Usuario', apellido: 'Demo' }; // Fallback
            onLogin(loginRole);
        }

        setCurrentUser(user);
        setShowLoginModal(false);
        setModalMode('selection');
        setFormData({ nombre: '', apellido: '', email: '', telefono: '' });

        // If there is a pending reservation, show the confirmation modal
        if (pendingReservation) {
            setShowReservationModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
        setModalMode('selection');
    };

    const handleReserveClick = (reservationData) => {
        if (isUserLoggedIn) {
            // Get current user ID (simulated if not set)
            if (!currentUser) {
                const existingUser = usuarios.find(u => u.tipoUsuario === 'Huésped');
                setCurrentUser(existingUser || { id: 1, nombre: 'Usuario', apellido: 'Demo' });
            }
            setPendingReservation(reservationData);
            setShowReservationModal(true);
        } else {
            setPendingReservation(reservationData);
            setShowLoginModal(true);
        }
    };

    if (selectedProperty) {
        return (
            <div className="home-container">
                <header className="home-header">
                    <div className="logo-container" onClick={() => setSelectedProperty(null)} style={{ cursor: 'pointer' }}>
                        <img
                            src="/Sistema-Empresarial-Airbnb/habita_logo.png"
                            alt="Habitá"
                        />
                    </div>
                    <div className="header-actions">
                        <button className="btn-login-trigger" onClick={() => setShowLoginModal(true)}>
                            <span style={{ fontSize: '1.2rem' }}>☰</span>
                            <span className="user-icon">👤</span>
                        </button>
                    </div>
                </header>
                <PropertyDetail
                    property={selectedProperty}
                    onBack={() => setSelectedProperty(null)}
                    onReserve={handleReserveClick}
                    isUserLoggedIn={isUserLoggedIn}
                />

                <LoginModal
                    isOpen={showLoginModal}
                    onClose={handleCloseModal}
                    modalMode={modalMode}
                    setModalMode={setModalMode}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    loginRole={loginRole}
                    setLoginRole={setLoginRole}
                    onSubmit={handleLoginSubmit}
                />

                <ReservationModal
                    isOpen={showReservationModal}
                    onClose={() => setShowReservationModal(false)}
                    onConfirm={processReservation}
                    reservationData={pendingReservation}
                    property={selectedProperty}
                    guestName={currentUser ? currentUser.nombre : ''}
                />
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="logo-container">
                    <img
                        src="/Sistema-Empresarial-Airbnb/habita_logo.png"
                        alt="Habitá"
                    />
                </div>

                <div className="header-actions">
                    <button className="btn-host">Tu hogar en cada estancia</button>
                    <button className="btn-login-trigger" onClick={() => setShowLoginModal(true)}>
                        <span style={{ fontSize: '1.2rem' }}>☰</span>
                        <span className="user-icon">👤</span>
                    </button>
                </div>
            </header>

            {/* Properties Grid */}
            <div className="properties-grid-home">
                {propiedades.map((propiedad) => (
                    <div key={propiedad.id} className="property-card-home" onClick={() => setSelectedProperty(propiedad)}>
                        <div className="property-image-container">
                            {/* Placeholder image logic - cycling through some realistic placeholders */}
                            <img
                                src={propiedad.imagen || `https://source.unsplash.com/random/400x300/?house,apartment,${propiedad.id}`}
                                alt={propiedad.nombre}
                                className="property-image"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Propiedad' }}
                            />
                            <button className="fav-icon">❤️</button>
                        </div>
                        <div className="property-details-home">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#222' }}>{propiedad.nombre}</h3>
                                <span>★ 4.9</span>
                            </div>
                            <p className="property-info-home" style={{ color: '#717171' }}>{propiedad.zona}, {propiedad.ciudad}</p>
                            <p className="property-info-home">{propiedad.tipoPropiedad} • {propiedad.capacidad} huéspedes</p>
                            <p className="property-price-home">
                                <span className="price-bold">{formatearMoneda(propiedad.precioNoche)}</span> noche
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <LoginModal
                isOpen={showLoginModal}
                onClose={handleCloseModal}
                modalMode={modalMode}
                setModalMode={setModalMode}
                formData={formData}
                handleInputChange={handleInputChange}
                loginRole={loginRole}
                setLoginRole={setLoginRole}
                onSubmit={handleLoginSubmit}
            />
        </div>
    );
};

export default HomePage;
