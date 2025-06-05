import { DataTypes, Model, Optional } from 'sequelize';
import db from '../database/config';

export interface UsuarioAttributes {
  id_usuario: number;
  Nombre: string;
  Password: string;
  estado: string;
  id_rol: number;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id_usuario' | 'estado'> {}


class User extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes {
  public id_usuario!: number;
  public Nombre!: string;
  public Password!: string;
  public estado!: string;
  public id_rol!: number;
}

User.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'Activo',
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'User',
    tableName: 'tbl_Usuarios', // asegúrate que coincida con tu tabla
    timestamps: false, // si no tienes createdAt y updatedAt
  }
);

export default User;
