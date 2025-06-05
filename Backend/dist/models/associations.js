"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const rol_1 = __importDefault(require("./rol"));
rol_1.default.hasMany(user_1.default, {
    foreignKey: 'id_rol',
    as: 'usuarios'
});
user_1.default.belongsTo(rol_1.default, {
    foreignKey: 'id_rol',
    as: 'rol'
});
