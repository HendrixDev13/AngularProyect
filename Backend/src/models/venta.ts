import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/config';

// 1. Interfaz con todos los campos de la tabla
interface VentaAttributes {
  id_venta: number;
  id_usuario: number;
  fecha: Date;
  NumeroRecibo: number; // ✅ nuevo campo
}

// 2. Campos opcionales para crear (no se necesita enviar id_venta ni fecha)
type VentaCreationAttributes = Optional<VentaAttributes, 'id_venta' | 'fecha'>;

// 3. Clase con tipado fuerte
class Venta extends Model<VentaAttributes, VentaCreationAttributes>
  implements VentaAttributes {
  public id_venta!: number;
  public id_usuario!: number;
  public fecha!: Date;
  public NumeroRecibo!: number; // ✅ agregar aquí
}


Venta.init(
  {
    id_venta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    NumeroRecibo: { // ✅ nuevo campo
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Venta',
    tableName: 'tbl_Venta',
    timestamps: false
  }
);


export default Venta;
