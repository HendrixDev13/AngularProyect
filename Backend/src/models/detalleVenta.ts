import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/config';

interface DetalleVentaAttributes {
  id_detalle_venta: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

type DetalleVentaCreationAttributes = Optional<DetalleVentaAttributes, 'id_detalle_venta'>;

class DetalleVenta extends Model<DetalleVentaAttributes, DetalleVentaCreationAttributes>
  implements DetalleVentaAttributes {
public id_detalle_venta!: number;
  public id_venta!: number;
  public id_producto!: number;
  public cantidad!: number;
  public precio_unitario!: number;
  public subtotal!: number;
}

DetalleVenta.init(
  {
    id_detalle_venta: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true
},
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'tbl_DetalleVenta',
    timestamps: false
  }
);

export default DetalleVenta;
