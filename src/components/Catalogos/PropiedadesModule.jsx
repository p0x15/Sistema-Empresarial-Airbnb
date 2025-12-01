import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatearMoneda } from '../../utils/calculations';
import './PropiedadesModule.css';

const PropiedadesModule = () => {
    const { propiedades, crearPropiedad, actualizarPropiedad, eliminarPropiedad, usuarios } = useData();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const initialFormState = {
        nombre: '',
        direccion: '',
        zona: '',
        ciudad: 'Ciudad de México',
        precioNoche: '',
        capacidad: '',
        numHabitaciones: '',
        numBanos: '',
        idAnfitrion: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const anfitriones = usuarios.filter(u => u.tipoUsuario === 'Anfitrión');

    const handleOpenModal = (propiedad = null) => {
        if (propiedad) {
            setEditingId(propiedad.id);
            setFormData({
                nombre: propiedad.nombre,
                direccion: propiedad.direccion,
                zona: propiedad.zona,
                ciudad: propiedad.ciudad,
                precioNoche: propiedad.precioNoche,
                capacidad: propiedad.capacidad,
                numHabitaciones: propiedad.numHabitaciones,
                numBanos: propiedad.numBanos,
                idAnfitrion: propiedad.idAnfitrion
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

        const propiedadData = {
            ...formData,
            precioNoche: parseFloat(formData.precioNoche),
            capacidad: parseInt(formData.capacidad),
            numHabitaciones: parseInt(formData.numHabitaciones),
            numBanos: parseInt(formData.numBanos),
            idAnfitrion: parseInt(formData.idAnfitrion),
            estatus: 'Disponible', // Default
            pais: 'México',
            estado: 'CDMX'
        };

        if (editingId) {
            actualizarPropiedad(editingId, propiedadData);
        } else {
            crearPropiedad(propiedadData);
        }

        handleCloseModal();
    };

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            eliminarPropiedad(itemToDelete);
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="propiedades-container">
            <div className="propiedades-header">
                <h2>Catálogo de Propiedades</h2>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    + Nueva Propiedad
                </button>
            </div>

            <div className="propiedades-grid">
                {propiedades.map(propiedad => (
                    <div key={propiedad.id} className="propiedad-card">
                        <div className="card-image-placeholder">
                            🏠
                        </div>
                        <div className="card-content">
                            <h3>{propiedad.nombre}</h3>
                            <div className="card-location">
                                📍 {propiedad.zona}, {propiedad.ciudad}
                            </div>
                            <div className="card-details">
                                <span>🛏️ {propiedad.numHabitaciones} Hab.</span>
                                <span>🚿 {propiedad.numBanos} Baños</span>
                                <span>👥 {propiedad.capacidad} Pers.</span>
                            </div>
                            <div className="card-price">
                                {formatearMoneda(propiedad.precioNoche)}
                                <span> / noche</span>
                            </div>
                        </div>
                        <div className="card-actions">
                            <button
                                className="btn-icon edit"
                                onClick={() => handleOpenModal(propiedad)}
                                title="Editar"
                            >
                                ✏️
                            </button>
                            <button
                                className="btn-icon delete"
                                onClick={() => handleDeleteClick(propiedad.id)}
                                title="Eliminar"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingId ? 'Editar Propiedad' : 'Nueva Propiedad'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>

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
                                    <label>Anfitrión</label>
                                    <select
                                        name="idAnfitrion"
                                        value={formData.idAnfitrion}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">Seleccione anfitrión...</option>
                                        {anfitriones.map(a => (
                                            <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Dirección</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Zona</label>
                                    <input
                                        type="text"
                                        name="zona"
                                        value={formData.zona}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Precio por Noche</label>
                                    <input
                                        type="number"
                                        name="precioNoche"
                                        value={formData.precioNoche}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Capacidad (Personas)</label>
                                    <input
                                        type="number"
                                        name="capacidad"
                                        value={formData.capacidad}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Habitaciones</label>
                                    <input
                                        type="number"
                                        name="numHabitaciones"
                                        value={formData.numHabitaciones}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Baños</label>
                                    <input
                                        type="number"
                                        name="numBanos"
                                        value={formData.numBanos}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
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
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3>Confirmar Eliminación</h3>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>&times;</button>
                        </div>
                        <p>¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">
                                Cancelar
                            </button>
                            <button onClick={confirmDelete} className="btn-primary" style={{ backgroundColor: '#dc3545' }}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropiedadesModule;
