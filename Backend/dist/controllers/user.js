"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newUser = async (req, res) => {
    const { nombre, password, id_rol } = req.body;
    // Validar que se envíen los datos requeridos
    if (!nombre || !password || !id_rol) {
        return res.status(400).json({
            msg: 'Faltan datos obligatorios: nombre, password o id_rol',
        });
    }
    try {
        const user = await user_1.default.findOne({ where: { Nombre: nombre } });
        if (user) {
            return res.status(400).json({
                msg: `El usuario ${nombre} ya existe`,
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await user_1.default.create({
            Nombre: nombre,
            Password: hashedPassword,
            id_rol,
        });
        res.json({
            msg: `Usuario ${nombre} creado exitosamente`,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error interno al crear el usuario',
            error,
        });
    }
};
exports.newUser = newUser;
const loginUser = async (req, res) => {
    const { nombre, password } = req.body;
    if (!nombre || !password) {
        return res.status(400).json({
            msg: 'Debes enviar nombre y password',
        });
    }
    try {
        const user = await user_1.default.findOne({ where: { Nombre: nombre } });
        if (!user) {
            return res.status(404).json({
                msg: `El usuario ${nombre} no existe`,
            });
        }
        const passwordValid = await bcrypt_1.default.compare(password, user.Password);
        if (!passwordValid) {
            return res.status(401).json({
                msg: 'La contraseña es incorrecta',
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id_usuario,
            nombre: user.Nombre,
            rol: user.id_rol,
        }, process.env.SECRET_KEY || 'pepito123');
        // ✅ Esto es lo único que necesitás para mostrar solo el token entre comillas
        res.json(token);
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error interno al iniciar sesión',
            error,
        });
    }
};
exports.loginUser = loginUser;
