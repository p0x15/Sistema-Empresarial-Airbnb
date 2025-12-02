import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
  formatearMoneda,
  formatearFecha,
} from '../../utils/calculations';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportarTablaPDF } from '../../utils/pdfExporter';
import './ReportesModule.css';

const ReportesModule = () => {
  const { pagos, gastos, mantenimientos } = useData();
  const [activeTab, setActiveTab] = useState('general');
  const [filterPeriod, setFilterPeriod] = useState('all'); // all, month, week

  // Función de filtrado reutilizable
  const filterByDate = (data, dateField) => {
    if (filterPeriod === 'all') return data;

    const now = new Date();
    // Resetear horas para comparación de fechas pura
    now.setHours(23, 59, 59, 999);

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);

    return data.filter(item => {
      if (!item[dateField]) return false;
      const itemDate = new Date(item[dateField]);
      // Ajuste de zona horaria simple o asumir UTC/Local consistente
      // Para seguridad, comparamos timestamps o fechas

      if (filterPeriod === 'week') return itemDate >= oneWeekAgo;
      if (filterPeriod === 'month') return itemDate >= oneMonthAgo;
      return true;
    });
  };

  // Datos filtrados dinámicamente
  const filteredPagos = useMemo(() => filterByDate(pagos, 'fechaPago'), [pagos, filterPeriod]);
  const filteredGastos = useMemo(() => filterByDate(gastos, 'fecha'), [gastos, filterPeriod]);
  const filteredMantenimientos = useMemo(() => filterByDate(mantenimientos, 'fechaProgramada'), [mantenimientos, filterPeriod]);

  // Calcular datos financieros precisos para el Estado de Resultados (basado en filtrados)
  const financialData = useMemo(() => {
    // 1. Ingresos por Comisiones (Reservas)
    let ingresosComisiones = 0;
    filteredPagos.forEach(p => {
      if (p.estadoPago === 'Pagado' || p.estadoPago === 'Dispersado') {
        ingresosComisiones += parseFloat(p.comisionAirbnb || 0);
      }
    });

    // 2. Ingresos por Mantenimiento (Utilidad Neta del Servicio)
    let utilidadMantenimiento = 0;
    filteredMantenimientos.forEach(m => {
      if (m.estatus === 'Completado') {
        utilidadMantenimiento += (parseFloat(m.totalCobrado || 0) - parseFloat(m.costoBase || 0));
      }
    });

    const totalIngresosOperativos = ingresosComisiones + utilidadMantenimiento;

    // 3. Gastos Operativos Desglosados
    let totalGastos = 0;
    const gastosPorCategoria = {
      'Marketing': 0,
      'Nómina': 0,
      'Software': 0,
      'Operativo': 0,
      'Legales': 0,
      'Otros': 0
    };

    filteredGastos.forEach(g => {
      if (g.estatus === 'Pagado') {
        const monto = parseFloat(g.totalConIVA || 0);
        totalGastos += monto;

        // Categorización simplificada para el reporte
        let cat = g.categoria;
        if (['Personal', 'Nómina'].includes(cat)) cat = 'Nómina';
        else if (['Marketing', 'Publicidad'].includes(cat)) cat = 'Marketing';
        else if (['Software', 'Infraestructura'].includes(cat)) cat = 'Software';
        else if (['Legales', 'Impuestos', 'Comisiones de pago'].includes(cat)) cat = 'Legales';
        else if (['Operativo', 'Mantenimiento de propiedades'].includes(cat)) cat = 'Operativo';
        else cat = 'Otros';

        gastosPorCategoria[cat] += monto;
      }
    });

    // 4. Resultados
    const utilidadNeta = totalIngresosOperativos - totalGastos;
    const margenNeto = totalIngresosOperativos > 0 ? (utilidadNeta / totalIngresosOperativos) * 100 : 0;

    return {
      ingresosComisiones,
      utilidadMantenimiento,
      totalIngresosOperativos,
      totalGastos,
      gastosPorCategoria,
      utilidadNeta,
      margenNeto
    };
  }, [filteredPagos, filteredGastos, filteredMantenimientos]);

  // Funciones de exportación PDF
  const exportarEstadoResultados = () => {
    const doc = new jsPDF();
    const periodText = filterPeriod === 'all' ? 'Histórico Total' : filterPeriod === 'month' ? 'Último Mes' : 'Última Semana';

    // Encabezado
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text('Estado de Resultados Integral', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Airbnb Enterprise Management - ${periodText}`, 105, 28, null, null, 'center');
    doc.text(`Generado al: ${new Date().toLocaleDateString()}`, 105, 34, null, null, 'center');

    // Cuerpo del Reporte
    doc.autoTable({
      startY: 45,
      head: [['CONCEPTO', 'MONTO', '%']],
      body: [
        [{ content: 'INGRESOS OPERATIVOS', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, '', ''],
        ['Comisiones por Reservas', formatearMoneda(financialData.ingresosComisiones), ''],
        ['Utilidad Servicios Mantenimiento', formatearMoneda(financialData.utilidadMantenimiento), ''],
        [{ content: 'TOTAL INGRESOS', styles: { fontStyle: 'bold' } }, formatearMoneda(financialData.totalIngresosOperativos), '100%'],

        ['', '', ''], // Espacio
        [{ content: 'GASTOS OPERATIVOS', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, '', ''],
        ['Marketing y Publicidad', formatearMoneda(financialData.gastosPorCategoria['Marketing']), ''],
        ['Nómina y Personal', formatearMoneda(financialData.gastosPorCategoria['Nómina']), ''],
        ['Tecnología y Software', formatearMoneda(financialData.gastosPorCategoria['Software']), ''],
        ['Legales y Administrativos', formatearMoneda(financialData.gastosPorCategoria['Legales']), ''],
        ['Otros Gastos Generales', formatearMoneda(financialData.gastosPorCategoria['Otros'] + financialData.gastosPorCategoria['Operativo']), ''],
        [{ content: 'TOTAL GASTOS', styles: { fontStyle: 'bold' } }, formatearMoneda(financialData.totalGastos), financialData.totalIngresosOperativos > 0 ? `${((financialData.totalGastos / financialData.totalIngresosOperativos) * 100).toFixed(1)}%` : '0%'],

        ['', '', ''], // Espacio
        [{ content: 'UTILIDAD NETA DEL EJERCICIO', styles: { fontStyle: 'bold', fontSize: 12, textColor: [0, 128, 0] } },
        { content: formatearMoneda(financialData.utilidadNeta), styles: { fontStyle: 'bold', fontSize: 12, textColor: [0, 128, 0] } },
        { content: `${financialData.margenNeto.toFixed(1)}%`, styles: { fontStyle: 'bold', textColor: [0, 128, 0] } }]
      ],
      theme: 'plain',
      styles: { cellPadding: 1.5, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 50, halign: 'right' },
        2: { cellWidth: 30, halign: 'right' }
      }
    });

    doc.save(`estado_resultados_${filterPeriod}.pdf`);
  };

  const exportarTabla = (titulo, columnas, datos, nombreArchivo) => {
    exportarTablaPDF(titulo, columnas, datos, nombreArchivo);
  };

  // Componente de Filtro Reutilizable
  const FilterComponent = () => (
    <div className="filter-group">
      <label>Periodo:</label>
      <select
        value={filterPeriod}
        onChange={(e) => setFilterPeriod(e.target.value)}
        className="filter-select"
      >
        <option value="all">Todo el historial</option>
        <option value="month">Último Mes</option>
        <option value="week">Última Semana</option>
      </select>
    </div>
  );

  const renderEstadoResultados = () => (
    <div className="tab-content fade-in">
      <div className="er-container">
        <div className="er-header">
          <h3>Estado de Resultados Integral</h3>
          <div className="header-actions">
            <FilterComponent />
            <button onClick={exportarEstadoResultados} className="btn-export">
              📄 Descargar PDF
            </button>
          </div>
        </div>

        <div className="er-paper">
          <div className="er-section">
            <h4 className="er-section-title">INGRESOS OPERATIVOS</h4>
            <div className="er-row">
              <span>Comisiones por Reservas</span>
              <span>{formatearMoneda(financialData.ingresosComisiones)}</span>
            </div>
            <div className="er-row">
              <span>Utilidad Servicios Mantenimiento</span>
              <span>{formatearMoneda(financialData.utilidadMantenimiento)}</span>
            </div>
            <div className="er-row total">
              <span>TOTAL INGRESOS</span>
              <span>{formatearMoneda(financialData.totalIngresosOperativos)}</span>
            </div>
          </div>

          <div className="er-section">
            <h4 className="er-section-title">GASTOS OPERATIVOS</h4>
            {Object.entries(financialData.gastosPorCategoria).map(([cat, amount]) => (
              amount > 0 && (
                <div key={cat} className="er-row">
                  <span>{cat}</span>
                  <span>{formatearMoneda(amount)}</span>
                </div>
              )
            ))}
            {financialData.totalGastos === 0 && (
              <div className="er-row" style={{ fontStyle: 'italic', color: '#999' }}>
                <span>Sin gastos registrados en este periodo</span>
                <span>$0.00</span>
              </div>
            )}
            <div className="er-row total warning">
              <span>TOTAL GASTOS</span>
              <span>{formatearMoneda(financialData.totalGastos)}</span>
            </div>
          </div>

          <div className="er-section result">
            <div className="er-row final">
              <span>UTILIDAD NETA DEL EJERCICIO</span>
              <span className={financialData.utilidadNeta >= 0 ? 'positive' : 'negative'}>
                {formatearMoneda(financialData.utilidadNeta)}
              </span>
            </div>
            <div className="er-row margin">
              <span>Margen Neto</span>
              <span className={financialData.margenNeto >= 0 ? 'positive' : 'negative'}>
                {financialData.margenNeto.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIngresosTab = () => (
    <div className="tab-content fade-in">
      <div className="table-container">
        <div className="table-header">
          <h3>Reporte de Ingresos (Pagos Recibidos)</h3>
          <button
            onClick={() => exportarTabla(
              'Reporte de Ingresos',
              ['Fecha', 'Reserva ID', 'Método', 'Monto Bruto', 'Comisión', 'Neto', 'Estatus'],
              filteredPagos.map(p => [
                p.fechaPago,
                p.idReserva,
                p.metodoPago,
                formatearMoneda(p.montoBruto),
                formatearMoneda(p.comisionAirbnb),
                formatearMoneda(p.montoNeto),
                p.estadoPago
              ]),
              'reporte_ingresos'
            )}
            className="btn-export"
          >
            📄 Exportar Tabla
          </button>
        </div>

        <div className="filters-bar">
          <FilterComponent />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Reserva</th>
              <th>Método</th>
              <th>Monto Bruto</th>
              <th>Comisión Airbnb</th>
              <th>Monto Neto</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {filteredPagos.length > 0 ? (
              filteredPagos.map(pago => (
                <tr key={pago.id}>
                  <td>{formatearFecha(pago.fechaPago)}</td>
                  <td>#{pago.idReserva}</td>
                  <td>{pago.metodoPago}</td>
                  <td>{formatearMoneda(pago.montoBruto)}</td>
                  <td style={{ color: '#28a745', fontWeight: 'bold' }}>+{formatearMoneda(pago.comisionAirbnb)}</td>
                  <td style={{ color: '#6c757d' }}>{formatearMoneda(pago.montoNeto)}</td>
                  <td>
                    <span className={`status-badge ${pago.estadoPago.toLowerCase()}`}>
                      {pago.estadoPago}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No hay ingresos en este periodo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGastosTab = () => (
    <div className="tab-content fade-in">
      <div className="table-container">
        <div className="table-header">
          <h3>Reporte de Gastos Operativos</h3>
          <button
            onClick={() => exportarTabla(
              'Reporte de Gastos',
              ['Fecha', 'Categoría', 'Proveedor', 'Descripción', 'Monto', 'IVA', 'Total'],
              filteredGastos.map(g => [
                g.fecha,
                g.categoria,
                g.proveedor,
                g.descripcion,
                formatearMoneda(g.monto),
                formatearMoneda(g.iva),
                formatearMoneda(g.totalConIVA)
              ]),
              'reporte_gastos'
            )}
            className="btn-export"
          >
            📄 Exportar Tabla
          </button>
        </div>

        <div className="filters-bar">
          <FilterComponent />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Descripción</th>
              <th>Monto Base</th>
              <th>IVA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredGastos.length > 0 ? (
              filteredGastos.map(gasto => (
                <tr key={gasto.id}>
                  <td>{formatearFecha(gasto.fecha)}</td>
                  <td>{gasto.categoria}</td>
                  <td>{gasto.proveedor}</td>
                  <td>{gasto.descripcion}</td>
                  <td>{formatearMoneda(gasto.monto)}</td>
                  <td>{formatearMoneda(gasto.iva)}</td>
                  <td style={{ fontWeight: 'bold', color: '#dc3545' }}>{formatearMoneda(gasto.totalConIVA)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No hay gastos en este periodo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h2>Reportes y Finanzas</h2>
      </div>

      <div className="reportes-tabs">
        <button
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          Estado de Resultados
        </button>
        <button
          className={`tab-btn ${activeTab === 'ingresos' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingresos')}
        >
          Reporte de Ingresos
        </button>
        <button
          className={`tab-btn ${activeTab === 'gastos' ? 'active' : ''}`}
          onClick={() => setActiveTab('gastos')}
        >
          Reporte de Gastos
        </button>
      </div>

      {activeTab === 'general' && renderEstadoResultados()}
      {activeTab === 'ingresos' && renderIngresosTab()}
      {activeTab === 'gastos' && renderGastosTab()}
    </div>
  );
};

export default ReportesModule;
