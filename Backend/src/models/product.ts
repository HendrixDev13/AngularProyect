import { DataTypes } from 'sequelize';
import db from '../database/config';

const Product = db.define('Product', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CodigoBarras: {
    type: DataTypes.STRING(50)
  },
  ProductoNombre: {
    type: DataTypes.STRING(100)
  },
  Modelo: {
    type: DataTypes.STRING(50)
  },
  Marca: {
    type: DataTypes.STRING(50)
  },
  Descripcion: {
    type: DataTypes.TEXT
  },
  Color: {
    type: DataTypes.STRING(30)
  },
  PrecioVenta: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  tableName: 'tbl_Producto',
  timestamps: false
});

export default Product;
