import { DataTypes } from 'sequelize';
import db from '../database/config';

const Rol = db.define('rol', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  NombreRol: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'tbl_Rol',
  timestamps: false
});

export default Rol;
