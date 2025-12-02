import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatearMoneda } from '../../utils/calculations';
import './MenuPrincipal.css';

import ReportesModule from '../Reportes/ReportesModule';
import ReservacionesModule from '../Transacciones/ReservacionesModule';
import PropiedadesModule from '../Catalogos/PropiedadesModule';
import MantenimientoModule from '../Transacciones/MantenimientoModule';
import PagosModule from '../Transacciones/PagosModule';
import GastosModule from '../Transacciones/GastosModule';
import UsuariosModule from '../Catalogos/UsuariosModule';

const MenuPrincipal = ({ onLogout }) => {
  // Trigger HMR update
  const { totales } = useData();
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderVista = () => {
    switch (vistaActual) {
      case 'dashboard':
        return <Dashboard />;
      case 'usuarios':
        return <UsuariosModule />;
      case 'propiedades':
        return <PropiedadesModule />;
      case 'reservaciones':
        return <ReservacionesModule />;
      case 'pagos':
        return <PagosModule />;
      case 'mantenimiento':
        return <MantenimientoModule />;
      case 'gastos':
        return <GastosModule />;
      case 'reportes':
        return <ReportesModule />;
      default:
        return <Dashboard />;
    }
  };

  const Dashboard = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Página Administrador</h1>
        <p>Bienvenido al sistema de gestión de Airbnb</p>
      </div>

      <div className="totales-container">
        <div className="total-card gastos">
          <h2>{formatearMoneda(totales.gastos)}</h2>
          <p>Total Gastos</p>
          <button onClick={() => setVistaActual('gastos')} className="btn-dashboard">
            Ver Detalles
          </button>
        </div>

        <div className="total-card ingresos">
          <h2>{formatearMoneda(totales.ingresos)}</h2>
          <p>Total Ingresos</p>
          <button onClick={() => setVistaActual('pagos')} className="btn-dashboard">
            Ver Detalles
          </button>
        </div>
      </div>

      <div className="modulos-container">
        <div className="modulos-row">
          <button onClick={() => setVistaActual('usuarios')} className="btn-modulo">
            <span style={{ fontSize: '2rem' }}>👥</span>
            Gestionar Usuarios
          </button>

          <button onClick={() => setVistaActual('reservaciones')} className="btn-modulo">
            <span style={{ fontSize: '2rem' }}>📅</span>
            Gestionar Reservaciones
          </button>

          <button onClick={() => setVistaActual('propiedades')} className="btn-modulo">
            <span style={{ fontSize: '2rem' }}>🏘️</span>
            Gestionar Propiedades
          </button>
        </div>
      </div>

      <div className="footer-info">
        <p>Sistema Empresarial AirBnb - ITAM 2025</p>
        <p>Pedro Merino F. • Mateo del Rosal Yañez • Rodrigo Ruiz Lira</p>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {isSidebarOpen && (
            <img
              src="/Sistema-Empresarial-Airbnb/habita_logo.png"
              alt="Habitá"
              className="sidebar-logo"
            />
          )}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => setVistaActual('dashboard')}
            className={`nav-item ${vistaActual === 'dashboard' ? 'active' : ''}`}
            title="Inicio"
          >
            <span className="icon">🏠</span>
            {isSidebarOpen && <span className="label">Inicio</span>}
          </button>
          <button
            onClick={() => setVistaActual('usuarios')}
            className={`nav-item ${vistaActual === 'usuarios' ? 'active' : ''}`}
            title="Usuarios"
          >
            <span className="icon">👥</span>
            {isSidebarOpen && <span className="label">Usuarios</span>}
          </button>
          <button
            onClick={() => setVistaActual('propiedades')}
            className={`nav-item ${vistaActual === 'propiedades' ? 'active' : ''}`}
            title="Propiedades"
          >
            <span className="icon">🏘️</span>
            {isSidebarOpen && <span className="label">Propiedades</span>}
          </button>
          <button
            onClick={() => setVistaActual('reservaciones')}
            className={`nav-item ${vistaActual === 'reservaciones' ? 'active' : ''}`}
            title="Reservaciones"
          >
            <span className="icon">📅</span>
            {isSidebarOpen && <span className="label">Reservaciones</span>}
          </button>
          <button
            onClick={() => setVistaActual('pagos')}
            className={`nav-item ${vistaActual === 'pagos' ? 'active' : ''}`}
            title="Pagos"
          >
            <span className="icon">💰</span>
            {isSidebarOpen && <span className="label">Pagos</span>}
          </button>
          <button
            onClick={() => setVistaActual('mantenimiento')}
            className={`nav-item ${vistaActual === 'mantenimiento' ? 'active' : ''}`}
            title="Mantenimiento"
          >
            <span className="icon">🔧</span>
            {isSidebarOpen && <span className="label">Mantenimiento</span>}
          </button>
          <button
            onClick={() => setVistaActual('gastos')}
            className={`nav-item ${vistaActual === 'gastos' ? 'active' : ''}`}
            title="Gastos"
          >
            <span className="icon">📊</span>
            {isSidebarOpen && <span className="label">Gastos</span>}
          </button>
          <button
            onClick={() => setVistaActual('reportes')}
            className={`nav-item ${vistaActual === 'reportes' ? 'active' : ''}`}
            title="Reportes"
          >
            <span className="icon">📄</span>
            {isSidebarOpen && <span className="label">Reportes</span>}
          </button>

          <div style={{ flexGrow: 1 }}></div>

          <button
            onClick={onLogout}
            className="nav-item"
            title="Cerrar Sesión"
            style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="icon">🚪</span>
            {isSidebarOpen && <span className="label">Cerrar Sesión</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'shifted' : 'full'}`}>
        <div className="content-wrapper">
          {renderVista()}
        </div>
      </main>
    </div>
  );
};

export default MenuPrincipal;
