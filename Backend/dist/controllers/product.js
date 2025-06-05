"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const product_1 = __importDefault(require("../models/product"));
const getProducts = async (req, res) => {
    const listProducts = await product_1.default.findAll();
    res.json({ listProducts });
};
exports.getProducts = getProducts;
