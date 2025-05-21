import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from '../database/config';

interface InventarioAttributes {
  id_producto: number;
  StockActual: number;
  FechaIngreso?: Date;
  Descripcion?: string;
  PrecioTotal?: number;
}

class Inventario extends Model<InferAttributes<Inventario>, InferCreationAttributes<Inventario>> {
  declare id_producto: number;
  declare StockActual: number;
  declare FechaIngreso: Date;
  declare Descripcion: string;
  declare PrecioTotal: number;
}

Inventario.init({
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  StockActual: DataTypes.INTEGER,
  FechaIngreso: DataTypes.DATE,
  Descripcion: DataTypes.TEXT,
  PrecioTotal: DataTypes.DECIMAL(10, 2),
}, {
  sequelize: db,
  tableName: 'tbl_Inventario',
  timestamps: false
});

export default Inventario;
