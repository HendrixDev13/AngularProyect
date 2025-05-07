import { DataTypes } from 'sequelize';
import db from '../database/config';

const Product = db.define('Product', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CodigoBarras: DataTypes.STRING(50),
  ProductoNombre: DataTypes.STRING(100),
  Modelo: DataTypes.STRING(50),
  Marca: DataTypes.STRING(50),
  Descripcion: DataTypes.TEXT,
  Color: DataTypes.STRING(30),
  PrecioVenta: DataTypes.DECIMAL(10, 2)
}, {
  tableName: 'tbl_Producto',
  timestamps: false
});

export default Product; // 👈 ESTA LÍNEA es esencial
