"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../database/config"));
const User = config_1.default.define('user', {
    id_usuario: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    Password: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    id_rol: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'tbl_Usuarios',
    timestamps: false
});
exports.default = User;
