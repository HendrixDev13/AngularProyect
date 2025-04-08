import User from './user';
import Rol from './rol';

Rol.hasMany(User, {
  foreignKey: 'id_rol',
  as: 'usuarios'
});

User.belongsTo(Rol, {
  foreignKey: 'id_rol',
  as: 'rol'
});
