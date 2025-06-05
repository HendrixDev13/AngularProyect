"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize('PROYECTOHONDA', 'sa', '12345', {
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
exports.default = db;
