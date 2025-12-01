import { initialData, nextIds } from '../data/initialData';

/**
 * DatabaseService - Servicio principal para CRUD + sessionStorage
 * Funciona como una mini base de datos en memoria con persistencia temporal
 */

const STORAGE_KEY = 'airbnb_sistema_data';
const IDS_KEY = 'airbnb_sistema_ids';

class DatabaseService {
  constructor() {
    this.data = null;
    this.ids = null;
    this.initialize();
  }

  /**
   * Inicializa la base de datos desde sessionStorage o datos iniciales
   */
  initialize() {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    const storedIds = sessionStorage.getItem(IDS_KEY);

    if (storedData && storedIds) {
      // Si existen datos en sessionStorage, los usamos
      this.data = JSON.parse(storedData);
      this.ids = JSON.parse(storedIds);
    } else {
      // Si no existen, usamos los datos iniciales
      this.data = JSON.parse(JSON.stringify(initialData)); // Deep copy
      this.ids = JSON.parse(JSON.stringify(nextIds)); // Deep copy
      this.saveToStorage();
    }
  }

  /**
   * Guarda el estado actual en sessionStorage
   */
  saveToStorage() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    sessionStorage.setItem(IDS_KEY, JSON.stringify(this.ids));
  }

  /**
   * Resetea la base de datos a los datos iniciales
   */
  reset() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.ids = JSON.parse(JSON.stringify(nextIds));
    this.saveToStorage();
  }

  /**
   * Obtiene todos los registros de una tabla
   * @param {string} table - Nombre de la tabla
   * @returns {Array} Array de registros
   */
  getAll(table) {
    if (!this.data[table]) {
      throw new Error(`Tabla "${table}" no existe`);
    }
    return [...this.data[table]]; // Retorna una copia
  }

  /**
   * Obtiene un registro por ID
   * @param {string} table - Nombre de la tabla
   * @param {number} id - ID del registro
   * @returns {Object|null} El registro o null si no existe
   */
  getById(table, id) {
    if (!this.data[table]) {
      throw new Error(`Tabla "${table}" no existe`);
    }
    const record = this.data[table].find(item => item.id === id);
    return record ? { ...record } : null; // Retorna copia
  }

  /**
   * Filtra registros según un criterio
   * @param {string} table - Nombre de la tabla
   * @param {Function} predicate - Función de filtro
   * @returns {Array} Array de registros que cumplen el criterio
   */
  filter(table, predicate) {
    if (!this.data[table]) {
      throw new Error(`Tabla "${table}" no existe`);
    }
    return this.data[table].filter(predicate);
  }

  /**
   * Crea un nuevo registro
   * @param {string} table - Nombre de la tabla
   * @param {Object} record - Datos del registro (sin ID)
   * @returns {Object} El registro creado con su ID
   */
  create(table, record) {
    if (!this.data[table]) {
      throw new Error(`Tabla "${table}" no existe`);
    }

    // Generar nuevo ID
    const newId = this.ids[table];
    this.ids[table]++;

    // Crear registro con ID
    const newRecord = {
      id: newId,
      ...record
    };

    // Agregar a la tabla
    this.data[table].push(newRecord);
    this.saveToStorage();

    return { ...newRecord };
  }

  /**
   * Actualiza un registro existente
   * @param {string} table - Nombre de la tabla
   * @param {number} id - ID del registro
   * @param {Object} updates - Datos a actualizar
   * @returns {Object|null} El registro actualizado o null si no existe
   */
  update(table, id, updates) {
    if (!this.data[table]) {
      throw new Error(`Tabla "${table}" no existe`);
    }

    const index = this.data[table].findIndex(item => item.id === id);

    if (index === -1) {
      return null;
    }

    // Actualizar registro (mantener el ID)
    this.data[table][index] = {
      ...this.data[table][index],
      ...updates,
      id // Asegurarse que el ID no cambie
    };

    this.saveToStorage();
    return { ...this.data[table][index] };
  }

  /**
   * Elimina un registro
   * @param {string} table - Nombre de la tabla
   * @param {number} id - ID del registro
   * @returns {boolean} true si se eliminó, false si no existía
   */
  delete(table, id) {
    if (!this.data[table]) {
      throw new Error(`Tabla "${table}" no existe`);
    }

    const index = this.data[table].findIndex(item => item.id === id);

    if (index === -1) {
      return false;
    }

    this.data[table].splice(index, 1);
    this.saveToStorage();
    return true;
  }

  /**
   * Cuenta registros en una tabla
   * @param {string} table - Nombre de la tabla
   * @param {Function} predicate - Función de filtro opcional
   * @returns {number} Número de registros
   */
  count(table, predicate = null) {
    if (!this.data[table]) {
      throw new Error(`Tabla "${table}" no existe`);
    }

    if (predicate) {
      return this.data[table].filter(predicate).length;
    }

    return this.data[table].length;
  }

  /**
   * Verifica si existe un registro
   * @param {string} table - Nombre de la tabla
   * @param {number} id - ID del registro
   * @returns {boolean} true si existe
   */
  exists(table, id) {
    if (!this.data[table]) {
      throw new Error(`Tabla "${table}" no existe`);
    }
    return this.data[table].some(item => item.id === id);
  }
}

// Exportar instancia única (Singleton)
const db = new DatabaseService();
export default db;
