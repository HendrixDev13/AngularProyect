import { Sequelize } from 'sequelize';

const db = new Sequelize('PROYECTOHONDA', 'sa', '12345', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false, // cambia a true si estás en Azure o usando TLS
      trustServerCertificate: true // útil para localhost
    }
  },
  logging: false // opcional: desactiva logs SQL en consola
});

export default db;
            