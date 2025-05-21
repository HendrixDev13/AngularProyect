import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../database/config';
import Inventario from './inventario';

class Producto extends Model<
  InferAttributes<Producto>,
  InferCreationAttributes<Producto>
> {
  declare id_producto: CreationOptional<number>;
  declare CodigoBarras: string;
  declare ProductoNombre: string;
  declare Modelo: string;
  declare Marca: string;
  declare Descripcion: string;
  declare Color: string;
  declare PrecioVenta: number;
  declare PrecioCosto: number;
  declare inventario?: Inventario;
}

Producto.init({
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CodigoBarras: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ProductoNombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Marca: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PrecioVenta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  PrecioCosto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: 'tbl_Producto',
  timestamps: false
});

export default Producto;
