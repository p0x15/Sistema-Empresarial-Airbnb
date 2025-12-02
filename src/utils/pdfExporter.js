import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportarTablaPDF = (titulo, columnas, datos, nombreArchivo) => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(titulo, 14, 22);

    // Subtítulo con fecha
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()} `, 14, 30);

    // Tabla
    doc.autoTable({
        startY: 35,
        head: [columnas],
        body: datos,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 8, cellPadding: 2 },
    });

    // Guardar
    doc.save(`${nombreArchivo}.pdf`);
};
