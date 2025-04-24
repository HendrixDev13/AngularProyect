import { DataTypes, Sequelize } from 'sequelize';
import db from '../database/config';

const MovimientoInventario = db.define('MovimientoInventario', {
id_movimiento: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  field: 'id_movimiento'
},

  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  TipoMovimiento: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  Cantidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  FechaMovimiento: {
    type: DataTypes.DATE,          // datetime
    allowNull: false,
    defaultValue: Sequelize.literal('GETDATE()'), // 👈 deja que SQL ponga la hora
  },
  Origen: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Inventario'
  },
  Referencia: {
    type: DataTypes.INTEGER,     // o STRING si prefieres
    allowNull: true
  },
  Motivo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },  
}, {
  tableName: 'tbl_MovimientosInventario',
  timestamps: false,
});

export default MovimientoInventario;
