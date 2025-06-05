"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../database/config"));
const Rol = config_1.default.define('rol', {
    id_rol: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NombreRol: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'tbl_Rol',
    timestamps: false
});
exports.default = Rol;
