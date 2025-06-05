"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../routes/product"));
const user_1 = __importDefault(require("../routes/user"));
const product_2 = __importDefault(require("./product"));
const user_2 = __importDefault(require("./user"));
const rol_1 = __importDefault(require("./rol"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.midlewares();
        this.routes();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicación corriendo en el puerto ' + this.port);
        });
    }
    routes() {
        this.app.use('/api/products', product_1.default);
        this.app.use('/api/users', user_1.default);
    }
    midlewares() {
        this.app.use(express_1.default.json());
    }
    async dbConnection() {
        try {
            await product_2.default.sync(); // Sincroniza el modelo con la base de datos
            await user_2.default.sync(); // Sincroniza el modelo con la base de datos
            await rol_1.default.sync(); // Sincroniza el modelo con la base de datos
        }
        catch (error) {
            console.error('Error al conectar a la base de datos', error);
        }
    }
}
exports.default = Server;
