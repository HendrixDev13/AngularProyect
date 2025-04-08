"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../database/config"));
const Product = config_1.default.define('Product', {
    id_producto: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CodigoBarras: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    ProductoNombre: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    Modelo: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    Marca: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    Descripcion: {
        type: sequelize_1.DataTypes.TEXT
    },
    Color: {
        type: sequelize_1.DataTypes.STRING(30)
    },
    PrecioVenta: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2)
    }
}, {
    tableName: 'tbl_Producto',
    timestamps: false
});
exports.default = Product;
