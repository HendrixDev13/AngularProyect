"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./models/server"));
const config_1 = __importDefault(require("./database/config")); // 👈 importamos la conexión Sequelize
// Cargar variables de entorno
dotenv_1.default.config();
// Probar la conexión a la base de datos
(async () => {
    try {
        await config_1.default.authenticate();
        console.log('✅ Conexión a la base de datos exitosa.');
    }
    catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
    }
    // Iniciar servidor
    const server = new server_1.default();
    server.listen();
})();
