import { DataTypes } from 'sequelize';
import db from '../database/config';

const User = db.define('user', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique:true,
  },
  Password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'tbl_Usuarios',
  timestamps: false
});

export default User;
