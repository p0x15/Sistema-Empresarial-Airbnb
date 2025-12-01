import React from 'react';
import './HomePage.css'; // Reusing existing styles

const LoginModal = ({
    isOpen,
    onClose,
    modalMode,
    setModalMode,
    formData,
    handleInputChange,
    loginRole,
    setLoginRole,
    onSubmit
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="login-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="btn-close" onClick={onClose}>✕</button>
                    <h2>
                        {modalMode === 'selection' && 'Inicia sesión o regístrate'}
                        {modalMode === 'login' && 'Iniciar Sesión'}
                        {modalMode === 'register' && 'Crear Cuenta'}
                    </h2>
                </div>
                <div className="modal-body">
                    {modalMode === 'selection' && (
                        <div className="auth-selection">
                            <h3 className="welcome-text">¿Cómo quieres continuar?</h3>
                            <button className="btn-auth-option primary" onClick={() => setModalMode('login')}>
                                Iniciar Sesión
                            </button>
                            <button className="btn-auth-option outline" onClick={() => setModalMode('register')}>
                                Crear una cuenta
                            </button>
                        </div>
                    )}

                    {(modalMode === 'login' || modalMode === 'register') && (
                        <>
                            <h3 className="welcome-text">
                                {modalMode === 'register' ? 'Crear perfil de huésped' : 'Te damos la bienvenida a Airbnb'}
                            </h3>

                            <form onSubmit={onSubmit} className="login-form">
                                {modalMode === 'register' ? (
                                    <>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="nombre"
                                                placeholder="Nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="apellido"
                                                placeholder="Apellido"
                                                value={formData.apellido}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                name="telefono"
                                                placeholder="Teléfono"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Correo electrónico"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="input-group">
                                            <input type="email" placeholder="Correo electrónico" required />
                                        </div>
                                        <div className="input-group">
                                            <input type="password" placeholder="Contraseña" required />
                                        </div>
                                        <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.9rem', color: '#717171' }}>¿No tienes cuenta? </span>
                                            <button
                                                type="button"
                                                onClick={() => setModalMode('register')}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#222',
                                                    fontWeight: '600',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    padding: 0
                                                }}
                                            >
                                                Regístrate
                                            </button>
                                        </div>

                                        <div className="role-selector">
                                            <button
                                                type="button"
                                                className={`role-option ${loginRole === 'user' ? 'active' : ''}`}
                                                onClick={() => setLoginRole('user')}
                                            >
                                                Usuario
                                            </button>
                                            <button
                                                type="button"
                                                className={`role-option ${loginRole === 'admin' ? 'active' : ''}`}
                                                onClick={() => setLoginRole('admin')}
                                            >
                                                Administrador
                                            </button>
                                        </div>
                                    </>
                                )}

                                <button type="submit" className="btn-submit-login">
                                    {modalMode === 'register' ? 'Registrarme y Continuar' : 'Continuar'}
                                </button>

                                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                                    <button
                                        type="button"
                                        className="btn-link-back"
                                        onClick={() => setModalMode('selection')}
                                        style={{ background: 'none', border: 'none', color: '#717171', textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                        Volver
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
