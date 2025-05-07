import { DataTypes } from 'sequelize';
import db from '../database/config';

const Inventario = db.define('Inventario', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  StockActual: DataTypes.INTEGER,
  FechaIngreso: DataTypes.DATE,
  Descripcion: DataTypes.TEXT,
  PrecioTotal: DataTypes.DECIMAL(10, 2),
  PrecioVentaInicial: DataTypes.DECIMAL(10, 2)
}, {
  tableName: 'tbl_Inventario',
  timestamps: false
});

export default Inventario;
