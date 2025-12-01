// Datos iniciales del sistema AirBnb - Replicados de Access
// Todos los datos están precargados con 10+ registros por tabla

export const initialData = {
  // =====================
  // 1. USUARIOS
  // =====================
  usuarios: [
    {
      id: 1,
      nombre: "Mariana",
      apellido: "López García",
      tipoUsuario: "Huésped",
      telefono: "5543216789",
      email: "mariana.lopez@gmail.com",
      fechaRegistro: "2024-01-15"
    },
    {
      id: 2,
      nombre: "Carlos",
      apellido: "Méndez Torres",
      tipoUsuario: "Anfitrión",
      telefono: "5532198745",
      email: "carlos.mendez@outlook.com",
      fechaRegistro: "2024-01-20",
      datosBancarios: {
        banco: "BBVA",
        clabe: "012180015543219876",
        titular: "Carlos Méndez Torres"
      }
    },
    {
      id: 3,
      nombre: "Andrea",
      apellido: "Ruiz Pineda",
      tipoUsuario: "Huésped",
      telefono: "5587459632",
      email: "andrea.ruizp@hotmail.com",
      fechaRegistro: "2024-02-01"
    },
    {
      id: 4,
      nombre: "Jorge",
      apellido: "Ramírez Ortega",
      tipoUsuario: "Anfitrión",
      telefono: "5512369874",
      email: "jorge.ramirez@gmail.com",
      fechaRegistro: "2024-02-10",
      datosBancarios: {
        banco: "Santander",
        clabe: "014180551236987412",
        titular: "Jorge Ramírez Ortega"
      }
    },
    {
      id: 5,
      nombre: "Sofía",
      apellido: "Hernández León",
      tipoUsuario: "Huésped",
      telefono: "5521478963",
      email: "sofia.hl@gmail.com",
      fechaRegistro: "2024-02-15"
    },
    {
      id: 6,
      nombre: "Pablo",
      apellido: "Rojas Serrano",
      tipoUsuario: "Anfitrión",
      telefono: "5589624713",
      email: "pablorojas@live.com",
      fechaRegistro: "2024-03-01",
      datosBancarios: {
        banco: "Banorte",
        clabe: "072180558962471355",
        titular: "Pablo Rojas Serrano"
      }
    },
    {
      id: 7,
      nombre: "Fernanda",
      apellido: "Díaz Campos",
      tipoUsuario: "Huésped",
      telefono: "5574136982",
      email: "fernanda.diaz@yahoo.com",
      fechaRegistro: "2024-03-05"
    },
    {
      id: 8,
      nombre: "Luis",
      apellido: "Aguilar Morales",
      tipoUsuario: "Huésped",
      telefono: "5569874123",
      email: "luis.aguilar@gmail.com",
      fechaRegistro: "2024-03-12"
    },
    {
      id: 9,
      nombre: "Claudia",
      apellido: "Torres Jiménez",
      tipoUsuario: "Anfitrión",
      telefono: "5598741236",
      email: "claudia.torres@icloud.com",
      fechaRegistro: "2024-03-20",
      datosBancarios: {
        banco: "HSBC",
        clabe: "021180559874123699",
        titular: "Claudia Torres Jiménez"
      }
    },
    {
      id: 10,
      nombre: "Ricardo",
      apellido: "Vega Castillo",
      tipoUsuario: "Huésped",
      telefono: "5528741935",
      email: "ricardo.vega@gmail.com",
      fechaRegistro: "2024-04-01"
    },
    {
      id: 11,
      nombre: "Diego",
      apellido: "Navarro Salas",
      tipoUsuario: "Huésped",
      telefono: "5519824376",
      email: "diego.navarro@gmail.com",
      fechaRegistro: "2024-04-10"
    },
    {
      id: 12,
      nombre: "Ricardo",
      apellido: "Torres Palma",
      tipoUsuario: "Anfitrión",
      telefono: "5527914683",
      email: "ricardo.torres@airbnbhost.com",
      fechaRegistro: "2024-04-15",
      datosBancarios: {
        banco: "Citibanamex",
        clabe: "002180552791468300",
        titular: "Ricardo Torres Palma"
      }
    },
    {
      id: 13,
      nombre: "Valeria",
      apellido: "Campos Rojas",
      tipoUsuario: "Huésped",
      telefono: "5574219863",
      email: "valeriacampos@outlook.com",
      fechaRegistro: "2024-04-20"
    },
    {
      id: 14,
      nombre: "Mauricio",
      apellido: "Chávez Luna",
      tipoUsuario: "Huésped",
      telefono: "5598412765",
      email: "mauricio.chavez@yahoo.com",
      fechaRegistro: "2024-05-01"
    },
    {
      id: 15,
      nombre: "Karla",
      apellido: "Jiménez Soto",
      tipoUsuario: "Huésped",
      telefono: "5583129647",
      email: "karla.jimenez@icloud.com",
      fechaRegistro: "2024-05-10"
    }
  ],

  // =====================
  // 2. PROPIEDADES
  // =====================
  propiedades: [
    {
      id: 456,
      nombre: "Casa Colonial San Ángel",
      direccion: "Calle Amargura 32, San Ángel",
      zona: "San Ángel",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Casa Completa",
      capacidad: 6,
      precioNoche: 2800.00,
      superficieM2: 120,
      estatus: "Disponible",
      numHabitaciones: 3,
      numBanos: 2,
      tieneAlberca: false,
      tieneEstacionamiento: true,
      wifi: true,
      aireAcondicionado: true,
      mascotasPermitidas: true,
      idAnfitrion: 2,
      imagen: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 457,
      nombre: "Loft Moderno Polanco",
      direccion: "Av. Masaryk 145, Polanco",
      zona: "Polanco",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Departamento",
      capacidad: 4,
      precioNoche: 3200.00,
      superficieM2: 85,
      estatus: "Disponible",
      numHabitaciones: 2,
      numBanos: 2,
      tieneAlberca: true,
      tieneEstacionamiento: true,
      wifi: true,
      aireAcondicionado: true,
      mascotasPermitidas: false,
      idAnfitrion: 4,
      imagen: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 458,
      nombre: "Departamento Roma Norte",
      direccion: "Calle Orizaba 67, Roma Norte",
      zona: "Roma Norte",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Departamento",
      capacidad: 3,
      precioNoche: 1800.00,
      superficieM2: 65,
      estatus: "Disponible",
      numHabitaciones: 2,
      numBanos: 1,
      tieneAlberca: false,
      tieneEstacionamiento: false,
      wifi: true,
      aireAcondicionado: true,
      mascotasPermitidas: true,
      idAnfitrion: 6,
      imagen: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 459,
      nombre: "Casa Coyoacán con Jardín",
      direccion: "Av. Francisco Sosa 234, Coyoacán",
      zona: "Coyoacán",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Casa Completa",
      capacidad: 8,
      precioNoche: 4000.00,
      superficieM2: 180,
      estatus: "Disponible",
      numHabitaciones: 4,
      numBanos: 3,
      tieneAlberca: false,
      tieneEstacionamiento: true,
      wifi: true,
      aireAcondicionado: false,
      mascotasPermitidas: true,
      idAnfitrion: 9,
      imagen: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 460,
      nombre: "Studio Condesa",
      direccion: "Calle Amsterdam 78, Condesa",
      zona: "Condesa",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Estudio",
      capacidad: 2,
      precioNoche: 1400.00,
      superficieM2: 45,
      estatus: "Disponible",
      numHabitaciones: 1,
      numBanos: 1,
      tieneAlberca: false,
      tieneEstacionamiento: false,
      wifi: true,
      aireAcondicionado: true,
      mascotasPermitidas: false,
      idAnfitrion: 12,
      imagen: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 461,
      nombre: "Penthouse Santa Fe",
      direccion: "Av. Vasco de Quiroga 3800, Santa Fe",
      zona: "Santa Fe",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Penthouse",
      capacidad: 6,
      precioNoche: 5000.00,
      superficieM2: 200,
      estatus: "Disponible",
      numHabitaciones: 3,
      numBanos: 3,
      tieneAlberca: true,
      tieneEstacionamiento: true,
      wifi: true,
      aireAcondicionado: true,
      mascotasPermitidas: false,
      idAnfitrion: 2,
      imagen: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 462,
      nombre: "Casa Tradicional Xochimilco",
      direccion: "Calle Violeta 12, Xochimilco",
      zona: "Xochimilco",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Casa Completa",
      capacidad: 10,
      precioNoche: 3000.00,
      superficieM2: 150,
      estatus: "Disponible",
      numHabitaciones: 5,
      numBanos: 3,
      tieneAlberca: false,
      tieneEstacionamiento: true,
      wifi: true,
      aireAcondicionado: false,
      mascotasPermitidas: true,
      idAnfitrion: 4,
      imagen: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 463,
      nombre: "Loft Industrial Del Valle",
      direccion: "Insurgentes Sur 1234, Del Valle",
      zona: "Del Valle",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Loft",
      capacidad: 4,
      precioNoche: 2200.00,
      superficieM2: 90,
      estatus: "Disponible",
      numHabitaciones: 2,
      numBanos: 2,
      tieneAlberca: false,
      tieneEstacionamiento: true,
      wifi: true,
      aireAcondicionado: true,
      mascotasPermitidas: false,
      idAnfitrion: 6,
      imagen: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 464,
      nombre: "Departamento Ejecutivo Reforma",
      direccion: "Paseo de la Reforma 456",
      zona: "Reforma",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Departamento",
      capacidad: 3,
      precioNoche: 2600.00,
      superficieM2: 75,
      estatus: "Disponible",
      numHabitaciones: 2,
      numBanos: 2,
      tieneAlberca: true,
      tieneEstacionamiento: true,
      wifi: true,
      aireAcondicionado: true,
      mascotasPermitidas: false,
      idAnfitrion: 9,
      imagen: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 465,
      nombre: "Casa Familiar Narvarte",
      direccion: "Eje 5 Sur 789, Narvarte",
      zona: "Narvarte",
      ciudad: "Ciudad de México",
      estado: "CDMX",
      pais: "México",
      tipoPropiedad: "Casa Completa",
      capacidad: 7,
      precioNoche: 2500.00,
      superficieM2: 140,
      estatus: "Disponible",
      numHabitaciones: 4,
      numBanos: 2,
      tieneAlberca: false,
      tieneEstacionamiento: true,
      wifi: true,
      aireAcondicionado: true,
      mascotasPermitidas: true,
      idAnfitrion: 12,
      imagen: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80"
    }
  ],

  // =====================
  // 3. RESERVACIONES
  // =====================
  reservaciones: [
    {
      id: 1,
      idHuesped: 1,
      idPropiedad: 456,
      fechaInicio: "2025-11-25",
      fechaFin: "2025-11-30",
      noches: 5,
      tarifaNoche: 2800.00,
      montoTotal: 14000.00,
      estadoReserva: "Confirmada",
      notas: "Huésped muy puntual, sin incidentes"
    },
    {
      id: 2,
      idHuesped: 3,
      idPropiedad: 457,
      fechaInicio: "2025-11-26",
      fechaFin: "2025-12-03",
      noches: 7,
      tarifaNoche: 3200.00,
      montoTotal: 22400.00,
      estadoReserva: "Confirmada",
      notas: "Solicitud de check-in temprano aprobada"
    },
    {
      id: 3,
      idHuesped: 5,
      idPropiedad: 459,
      fechaInicio: "2025-12-05",
      fechaFin: "2025-12-15",
      noches: 10,
      tarifaNoche: 4000.00,
      montoTotal: 40000.00,
      estadoReserva: "Confirmada",
      notas: "Reservación para evento familiar"
    },
    {
      id: 4,
      idHuesped: 7,
      idPropiedad: 460,
      fechaInicio: "2025-03-15",
      fechaFin: "2025-03-15",
      noches: 0,
      tarifaNoche: 1400.00,
      montoTotal: 0.00,
      estadoReserva: "Cancelada",
      notas: "Cancelada por el huésped"
    },
    {
      id: 5,
      idHuesped: 8,
      idPropiedad: 458,
      fechaInicio: "2025-10-25",
      fechaFin: "2025-10-29",
      noches: 4,
      tarifaNoche: 1800.00,
      montoTotal: 7200.00,
      estadoReserva: "Completada",
      notas: "Viaje de negocios"
    },
    {
      id: 6,
      idHuesped: 10,
      idPropiedad: 461,
      fechaInicio: "2025-12-20",
      fechaFin: "2025-12-30",
      noches: 10,
      tarifaNoche: 5000.00,
      montoTotal: 50000.00,
      estadoReserva: "Confirmada",
      notas: "Cliente VIP, excelente experiencia"
    },
    {
      id: 7,
      idHuesped: 11,
      idPropiedad: 456,
      fechaInicio: "2025-11-28",
      fechaFin: "2025-12-02",
      noches: 4,
      tarifaNoche: 2800.00,
      montoTotal: 11200.00,
      estadoReserva: "Confirmada",
      notas: "Primera reserva del usuario"
    },
    {
      id: 8,
      idHuesped: 13,
      idPropiedad: 462,
      fechaInicio: "2026-01-10",
      fechaFin: "2026-01-20",
      noches: 10,
      tarifaNoche: 3000.00,
      montoTotal: 30000.00,
      estadoReserva: "Confirmada",
      notas: "Reserva grupal para retiro espiritual"
    },
    {
      id: 9,
      idHuesped: 14,
      idPropiedad: 463,
      fechaInicio: "2025-10-02",
      fechaFin: "2025-10-05",
      noches: 3,
      tarifaNoche: 2200.00,
      montoTotal: 6600.00,
      estadoReserva: "Completada",
      notas: "Cliente frecuente"
    },
    {
      id: 10,
      idHuesped: 15,
      idPropiedad: 464,
      fechaInicio: "2025-11-29",
      fechaFin: "2025-12-05",
      noches: 6,
      tarifaNoche: 2600.00,
      montoTotal: 15600.00,
      estadoReserva: "Confirmada",
      notas: "Reserva activa próxima"
    },
    {
      id: 11,
      idHuesped: 3,
      idPropiedad: 465,
      fechaInicio: "2025-05-10",
      fechaFin: "2025-05-15",
      noches: 0,
      tarifaNoche: 2500.00,
      montoTotal: 0.00,
      estadoReserva: "Cancelada",
      notas: "Cancelación por fuerza mayor"
    },
    {
      id: 12,
      idHuesped: 5,
      idPropiedad: 457,
      fechaInicio: "2024-12-01",
      fechaFin: "2024-12-10",
      noches: 9,
      tarifaNoche: 3200.00,
      montoTotal: 28800.00,
      estadoReserva: "Completada",
      notas: "Estancia larga vacacional"
    }
  ],

  // =====================
  // 4. PAGOS (INGRESOS)
  // =====================
  pagos: [
    {
      id: 1,
      idReserva: 1,
      fechaPago: "2025-11-25",
      montoBruto: 14000.00,
      comisionAirbnb: 2800.00, // 20% Comisión
      montoNeto: 11200.00,
      metodoPago: "Tarjeta",
      estadoPago: "Pagado",
      estadoDispersado: true,
      fechaDispersion: "2025-11-26"
    },
    {
      id: 2,
      idReserva: 2,
      fechaPago: "2025-11-26",
      montoBruto: 22400.00,
      comisionAirbnb: 4480.00, // 20% Comisión
      montoNeto: 17920.00,
      metodoPago: "Transferencia",
      estadoPago: "Pagado",
      estadoDispersado: false
    },
    {
      id: 3,
      idReserva: 3,
      fechaPago: "2025-10-15",
      montoBruto: 40000.00,
      comisionAirbnb: 8000.00, // 20% Comisión
      montoNeto: 32000.00,
      metodoPago: "Tarjeta",
      estadoPago: "Pagado",
      estadoDispersado: true,
      fechaDispersion: "2025-10-16"
    },
    {
      id: 4,
      idReserva: 4,
      fechaPago: "2025-03-16",
      montoBruto: 0.00,
      comisionAirbnb: 0.00,
      montoNeto: 0.00,
      metodoPago: "Transferencia",
      estadoPago: "Reembolsado"
    },
    {
      id: 5,
      idReserva: 5,
      fechaPago: "2025-10-25",
      montoBruto: 7200.00,
      comisionAirbnb: 1440.00,
      montoNeto: 5760.00,
      metodoPago: "Efectivo",
      estadoPago: "Pagado",
      estadoDispersado: false
    },
    {
      id: 6,
      idReserva: 6,
      fechaPago: "2025-09-10",
      montoBruto: 50000.00,
      comisionAirbnb: 10000.00, // 20% Comisión (VIP)
      montoNeto: 40000.00,
      metodoPago: "Tarjeta",
      estadoPago: "Pagado",
      estadoDispersado: true,
      fechaDispersion: "2025-09-11"
    },
    {
      id: 7,
      idReserva: 7,
      fechaPago: "2025-11-28",
      montoBruto: 11200.00,
      comisionAirbnb: 2240.00,
      montoNeto: 8960.00,
      metodoPago: "Transferencia",
      estadoPago: "Pagado",
      estadoDispersado: false
    },
    {
      id: 8,
      idReserva: 8,
      fechaPago: "2025-08-15",
      montoBruto: 30000.00,
      comisionAirbnb: 6000.00,
      montoNeto: 24000.00,
      metodoPago: "Tarjeta",
      estadoPago: "Pagado",
      estadoDispersado: false
    },
    {
      id: 9,
      idReserva: 9,
      fechaPago: "2025-07-20",
      montoBruto: 6600.00,
      comisionAirbnb: 1320.00,
      montoNeto: 5280.00,
      metodoPago: "Efectivo",
      estadoPago: "Pagado",
      estadoDispersado: true,
      fechaDispersion: "2025-07-21"
    },
    {
      id: 10,
      idReserva: 10,
      fechaPago: "2025-11-29",
      montoBruto: 15600.00,
      comisionAirbnb: 3120.00,
      montoNeto: 12480.00,
      metodoPago: "Transferencia",
      estadoPago: "Pagado",
      estadoDispersado: false
    }
  ],

  // =====================
  // 5. MANTENIMIENTOS
  // =====================
  mantenimientos: [
    {
      id: 456,
      idPropiedad: 456,
      tipo: "Limpieza",
      descripcion: "Limpieza completa tras salida de huéspedes, cambio de sábanas",
      fechaProgramada: "2025-02-14",
      costoBase: 650.00,
      porcentajeComision: 0,
      comisionPlataforma: 200.00,
      totalCobrado: 850.00,
      estatus: "Completado"
    },
    {
      id: 457,
      idPropiedad: 457,
      tipo: "Correctivo",
      descripcion: "Reparación de fuga en lavabo del baño principal",
      fechaProgramada: "2025-02-25",
      costoBase: 450.00,
      porcentajeComision: 0,
      comisionPlataforma: 150.00,
      totalCobrado: 600.00,
      estatus: "Completado"
    },
    {
      id: 458,
      idPropiedad: 459,
      tipo: "Preventivo",
      descripcion: "Retocar muros exteriores dañados por la humedad en zona costera",
      fechaProgramada: "2025-03-10",
      costoBase: 950.00,
      porcentajeComision: 0,
      comisionPlataforma: 250.00,
      totalCobrado: 1200.00,
      estatus: "En proceso"
    },
    {
      id: 459,
      idPropiedad: 460,
      tipo: "Correctivo",
      descripcion: "Sustitución de focos LED y revisión de cableado del pasillo",
      fechaProgramada: "2025-03-18",
      costoBase: 350.00,
      porcentajeComision: 0,
      comisionPlataforma: 150.00,
      totalCobrado: 500.00,
      estatus: "Completado"
    },
    {
      id: 460,
      idPropiedad: 458,
      tipo: "Limpieza",
      descripcion: "Limpieza y cambio de blancos tras estadía prolongada",
      fechaProgramada: "2025-03-29",
      costoBase: 550.00,
      porcentajeComision: 0,
      comisionPlataforma: 150.00,
      totalCobrado: 700.00,
      estatus: "Completado"
    },
    {
      id: 461,
      idPropiedad: 461,
      tipo: "Preventivo",
      descripcion: "Reemplazo de sofá dañado y revisión de sillas del comedor",
      fechaProgramada: "2025-04-05",
      costoBase: 2800.00,
      porcentajeComision: 0,
      comisionPlataforma: 700.00,
      totalCobrado: 3500.00,
      estatus: "Completado"
    },
    {
      id: 462,
      idPropiedad: 462,
      tipo: "Preventivo",
      descripcion: "Limpieza de filtros y recarga de gas refrigerante",
      fechaProgramada: "2025-04-12",
      costoBase: 800.00,
      porcentajeComision: 0,
      comisionPlataforma: 300.00,
      totalCobrado: 1100.00,
      estatus: "En proceso"
    },
    {
      id: 463,
      idPropiedad: 456,
      tipo: "Correctivo",
      descripcion: "Ajuste de puertas de clóset y reparación de cajones",
      fechaProgramada: "2025-04-20",
      costoBase: 1000.00,
      porcentajeComision: 0,
      comisionPlataforma: 400.00,
      totalCobrado: 1400.00,
      estatus: "Completado"
    },
    {
      id: 464,
      idPropiedad: 462,
      tipo: "Preventivo",
      descripcion: "Fumigación preventiva contra insectos en cabañas",
      fechaProgramada: "2025-04-28",
      costoBase: 700.00,
      porcentajeComision: 0,
      comisionPlataforma: 250.00,
      totalCobrado: 950.00,
      estatus: "Completado"
    },
    {
      id: 465,
      idPropiedad: 463,
      tipo: "Limpieza",
      descripcion: "Limpieza profunda post-evento y sanitización completa",
      fechaProgramada: "2025-05-06",
      costoBase: 900.00,
      porcentajeComision: 0,
      comisionPlataforma: 300.00,
      totalCobrado: 1200.00,
      estatus: "Completado"
    },
    {
      id: 466,
      idPropiedad: 456,
      tipo: "Limpieza",
      descripcion: "Limpieza express check-out",
      fechaProgramada: "2025-11-28",
      costoBase: 400.00,
      porcentajeComision: 0,
      comisionPlataforma: 150.00,
      totalCobrado: 550.00,
      estatus: "Completado"
    },
    {
      id: 467,
      idPropiedad: 458,
      tipo: "Correctivo",
      descripcion: "Reparación chapa puerta principal",
      fechaProgramada: "2025-11-15",
      costoBase: 600.00,
      porcentajeComision: 0,
      comisionPlataforma: 200.00,
      totalCobrado: 800.00,
      estatus: "Completado"
    }
  ],

  // =====================
  // 6. GASTOS
  // =====================
  gastos: [
    {
      id: 1,
      idPropiedad: null,
      fecha: "2025-01-15",
      categoria: "Software",
      descripcion: "Suscripción mensual Airbnb Plus para anfitriones",
      proveedor: "Airbnb",
      monto: 150.00, // Reducido
      iva: 24.00,
      totalConIVA: 174.00,
      estatus: "Pagado"
    },
    {
      id: 2,
      idPropiedad: 456, // Ejemplo de gasto asociado a propiedad
      fecha: "2025-01-03",
      categoria: "Mantenimiento de propiedades",
      descripcion: "Reparaciones menores oficina",
      proveedor: "Servicios Múltiples SA",
      monto: 500.00, // Reducido
      iva: 0.00,
      totalConIVA: 500.00,
      estatus: "Pagado"
    },
    {
      id: 3,
      fecha: "2025-02-10",
      categoria: "Marketing",
      descripcion: "Campaña publicitaria Facebook/Instagram Ads",
      proveedor: "Meta",
      monto: 1500.00, // Ajustado
      iva: 240.00,
      totalConIVA: 1740.00,
      estatus: "Pagado"
    },
    {
      id: 4,
      fecha: "2025-02-20",
      categoria: "Infraestructura",
      descripcion: "Hosting web y almacenamiento en la nube",
      proveedor: "AWS",
      monto: 200.00, // Reducido
      iva: 32.00,
      totalConIVA: 232.00,
      estatus: "Pagado"
    },
    {
      id: 5,
      fecha: "2025-03-05",
      categoria: "Personal",
      descripcion: "Honorarios Asistente Virtual",
      proveedor: "Freelancer",
      monto: 3000.00, // Ajustado
      iva: 0.00,
      totalConIVA: 3000.00,
      estatus: "Pagado"
    },
    {
      id: 6,
      fecha: "2025-03-15",
      categoria: "Comisiones de pago",
      descripcion: "Comisiones Stripe/PayPal por transacciones",
      proveedor: "Stripe",
      monto: 450.00,
      iva: 0.00,
      totalConIVA: 450.00,
      estatus: "Pagado"
    },
    {
      id: 7,
      fecha: "2025-04-01",
      categoria: "Legales",
      descripcion: "Asesoría contable mensual",
      proveedor: "Despacho Contable",
      monto: 1200.00, // Reducido
      iva: 192.00,
      totalConIVA: 1392.00,
      estatus: "Pagado"
    },
    {
      id: 10,
      idReserva: 10, // Error in original data? This looks like an expense ID, not reservation ID. Keeping as is but updating content.
      fecha: "2025-05-02",
      categoria: "Otros",
      descripcion: "Seguros de propiedad contra daños",
      proveedor: "Seguros Monterrey",
      monto: 3200.00,
      iva: 512.00,
      totalConIVA: 3712.00,
      estatus: "Pagado"
    },
    {
      id: 11,
      fecha: "2025-11-28",
      categoria: "Marketing",
      descripcion: "Campaña Black Friday Redes Sociales",
      proveedor: "Meta Ads",
      monto: 2500.00,
      iva: 400.00,
      totalConIVA: 2900.00,
      estatus: "Pagado"
    },
    {
      id: 12,
      fecha: "2025-11-15",
      categoria: "Software",
      descripcion: "Renovación Licencia CRM",
      proveedor: "Salesforce",
      monto: 1200.00,
      iva: 192.00,
      totalConIVA: 1392.00,
      estatus: "Pagado"
    },
    {
      id: 13,
      fecha: "2025-11-05",
      categoria: "Operativo",
      descripcion: "Suministros de oficina y limpieza",
      proveedor: "Office Depot",
      monto: 850.00,
      iva: 136.00,
      totalConIVA: 986.00,
      estatus: "Pagado"
    }
  ]
};

// IDs autoincrementables para nuevos registros
export const nextIds = {
  usuarios: 16,
  propiedades: 466,
  reservaciones: 11,
  pagos: 11,
  mantenimientos: 466,
  gastos: 11
};
