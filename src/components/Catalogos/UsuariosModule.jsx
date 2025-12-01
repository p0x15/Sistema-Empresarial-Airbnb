import { useState } from 'react';
import { useData } from '../../context/DataContext';
import './UsuariosModule.css';

const UsuariosModule = () => {
    const { usuarios, crearUsuario, actualizarUsuario, eliminarUsuario, propiedades, reservaciones } = useData();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [filterType, setFilterType] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const initialFormState = {
        nombre: '',
        apellido: '',
        tipoUsuario: 'Huésped',
        telefono: '',
        email: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // Debugging
    console.log('UsuariosModule rendered. Usuarios:', usuarios);

    // Local safe helper for date formatting to avoid import issues
    const safeFormatearFecha = (fecha) => {
        if (!fecha) return 'Fecha no disponible';
        const date = new Date(fecha);
        if (isNaN(date.getTime())) return 'Fecha inválida';
        return new Intl.DateTimeFormat('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    // Safety check for loading state
    if (!usuarios || !Array.isArray(usuarios)) {
        return <div className="p-4">Cargando usuarios... (Datos no disponibles)</div>;
    }

    // Filtrado directo
    const filteredUsuarios = usuarios.filter(usuario => {
        if (!usuario) return false;

        const matchesType = filterType === 'Todos' || usuario.tipoUsuario === filterType;

        const nombre = usuario.nombre || '';
        const apellido = usuario.apellido || '';
        const email = usuario.email || '';
        const term = searchTerm.toLowerCase();

        const matchesSearch =
            nombre.toLowerCase().includes(term) ||
            apellido.toLowerCase().includes(term) ||
            email.toLowerCase().includes(term);

        return matchesType && matchesSearch;
    });

    // Cálculo de detalles seguro
    const getSelectedUserDetails = () => {
        if (!selectedUser) return null;

        try {
            if (selectedUser.tipoUsuario === 'Anfitrión') {
                const userProperties = propiedades ? propiedades.filter(p => p.idAnfitrion === selectedUser.id) : [];
                return { type: 'Anfitrión', data: userProperties };
            } else {
                const userReservations = reservaciones
                    ? reservaciones
                        .filter(r => r.idHuesped === selectedUser.id)
                        .sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
                    : [];

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const isActive = userReservations.some(r => {
                    const start = new Date(r.fechaInicio);
                    const end = new Date(r.fechaFin);
                    start.setHours(0, 0, 0, 0);
                    end.setHours(0, 0, 0, 0);
                    return r.estadoReserva === 'Confirmada' && today >= start && today < end;
                });

                return { type: 'Huésped', data: userReservations, isActive };
            }
        } catch (error) {
            console.error("Error calculating user details:", error);
            return null;
        }
    };

    const selectedUserDetails = getSelectedUserDetails();

    const handleOpenModal = (usuario = null) => {
        if (usuario) {
            setEditingId(usuario.id);
            setFormData({
                nombre: usuario.nombre || '',
                apellido: usuario.apellido || '',
                tipoUsuario: usuario.tipoUsuario || 'Huésped',
                telefono: usuario.telefono || '',
                email: usuario.email || ''
            });
        } else {
            setEditingId(null);
            setFormData(initialFormState);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData(initialFormState);
        setEditingId(null);
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

        const usuarioData = {
            ...formData,
            fechaRegistro: editingId ? undefined : new Date().toISOString().split('T')[0]
        };

        if (editingId) {
            actualizarUsuario(editingId, usuarioData);
        } else {
            crearUsuario(usuarioData);
        }

        handleCloseModal();
    };

    const handleDeleteClick = (id, e) => {
        e.stopPropagation(); // Prevent opening detail modal
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleEditClick = (usuario, e) => {
        e.stopPropagation(); // Prevent opening detail modal
        handleOpenModal(usuario);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            eliminarUsuario(itemToDelete);
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    // Helper seguro para clases CSS
    const getUserClass = (tipo) => {
        if (!tipo) return '';
        return tipo === 'Anfitrión' ? 'anfitrion' : 'huesped';
    };

    return (
        <div className="usuarios-container">
            <div className="usuarios-header">
                <h2>Catálogo de Usuarios</h2>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    + Nuevo Usuario
                </button>
            </div>

            <div className="usuarios-controls" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%' }}
                />
                <div className="filter-bar">
                    {['Todos', 'Huésped', 'Anfitrión'].map(type => (
                        <button
                            key={type}
                            className={`filter-btn ${filterType === type ? 'active' : ''}`}
                            onClick={() => setFilterType(type)}
                        >
                            {type === 'Todos' ? 'Todos' : type + 'es'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="users-grid">
                {filteredUsuarios.map(usuario => (
                    <div
                        key={usuario.id || Math.random()}
                        className={`user-card ${getUserClass(usuario.tipoUsuario)}`}
                        onClick={() => setSelectedUser(usuario)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="user-header">
                            <div className="user-avatar">
                                {(usuario.nombre || '?').charAt(0)}{(usuario.apellido || '?').charAt(0)}
                            </div>
                            <span className={`user-badge ${getUserClass(usuario.tipoUsuario)}`}>
                                {usuario.tipoUsuario}
                            </span>
                        </div>

                        <div className="user-info">
                            <h3>{usuario.nombre} {usuario.apellido}</h3>
                            <p>Registrado: {safeFormatearFecha(usuario.fechaRegistro)}</p>
                        </div>

                        <div className="user-contact">
                            <div className="contact-item">
                                📧 {usuario.email}
                            </div>
                            <div className="contact-item">
                                📱 {usuario.telefono}
                            </div>
                        </div>

                        <div className="user-actions">
                            <button
                                className="btn-icon edit"
                                onClick={(e) => handleEditClick(usuario, e)}
                                title="Editar"
                            >
                                ✏️
                            </button>
                            <button
                                className="btn-icon delete"
                                onClick={(e) => handleDeleteClick(usuario.id, e)}
                                title="Eliminar"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Apellido</label>
                                        <input
                                            type="text"
                                            name="apellido"
                                            value={formData.apellido}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Tipo de Usuario</label>
                                        <select
                                            name="tipoUsuario"
                                            value={formData.tipoUsuario}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        >
                                            <option value="Huésped">Huésped</option>
                                            <option value="Anfitrión">Anfitrión</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button type="button" onClick={handleCloseModal} className="btn-secondary">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3>Confirmar Eliminación</h3>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
                            <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button onClick={confirmDelete} className="btn-primary" style={{ backgroundColor: '#dc3545' }}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            {selectedUser && selectedUserDetails && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Detalles de {selectedUser.tipoUsuario}</h3>
                            <button className="close-btn" onClick={() => setSelectedUser(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h4>Información Personal</h4>
                                <div className="info-row">
                                    <span>Nombre:</span>
                                    <span>{selectedUser.nombre} {selectedUser.apellido}</span>
                                </div>
                                <div className="info-row">
                                    <span>Email:</span>
                                    <span>{selectedUser.email}</span>
                                </div>
                                <div className="info-row">
                                    <span>Teléfono:</span>
                                    <span>{selectedUser.telefono}</span>
                                </div>
                                <div className="info-row">
                                    <span>Fecha Registro:</span>
                                    <span>{safeFormatearFecha(selectedUser.fechaRegistro)}</span>
                                </div>
                            </div>

                            {selectedUser.tipoUsuario === 'Anfitrión' && (
                                <div className="detail-section">
                                    <h4>Propiedades ({selectedUserDetails.data.length})</h4>
                                    {selectedUserDetails.data.length > 0 ? (
                                        selectedUserDetails.data.map(prop => (
                                            <div key={prop.id} className="modal-list-item">
                                                <h5>{prop.nombre}</h5>
                                                <p>{prop.ciudad}, {prop.estado}</p>
                                                <p style={{ marginTop: '0.25rem' }}>Status: <b>{prop.estatus}</b></p>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No tiene propiedades registradas.</p>
                                    )}
                                </div>
                            )}

                            {selectedUser.tipoUsuario === 'Huésped' && (
                                <div className="detail-section">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                        <h4 style={{ margin: 0, border: 'none', padding: 0 }}>Historial de Estancias</h4>
                                        {selectedUserDetails.isActive ? (
                                            <span className="status-tag active">Actualmente Hospedado</span>
                                        ) : (
                                            <span className="status-tag inactive">Inactivo</span>
                                        )}
                                    </div>

                                    {selectedUserDetails.data.length > 0 ? (
                                        selectedUserDetails.data.map(res => {
                                            const propiedad = propiedades.find(p => p.id === res.idPropiedad);
                                            return (
                                                <div key={res.id} className="modal-list-item">
                                                    <h5>{propiedad?.nombre || 'Propiedad Desconocida'}</h5>
                                                    <p>{safeFormatearFecha(res.fechaInicio)} - {safeFormatearFecha(res.fechaFin)}</p>
                                                    <p style={{ marginTop: '0.25rem' }}>Estado: <b>{res.estadoReserva}</b></p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No tiene historial de reservaciones.</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setSelectedUser(null)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsuariosModule;
