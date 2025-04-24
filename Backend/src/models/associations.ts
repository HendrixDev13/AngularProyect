import User from './user';
import Rol from './rol';
import Product from './product';
import Inventario from './inventario';
import MovimientoInventario from './movimientoInventario';

// Asociación Rol - User
Rol.hasMany(User, {
  foreignKey: 'id_rol',
  as: 'usuarios'
});

User.belongsTo(Rol, {
  foreignKey: 'id_rol',
  as: 'rol'
});

// Asociación Product - Inventario
Product.hasOne(Inventario, {
  foreignKey: 'id_producto',
  as: 'inventario'
});

Inventario.belongsTo(Product, {
  foreignKey: 'id_producto',
  as: 'producto'
});

Product.hasMany(MovimientoInventario, {
  foreignKey: 'id_producto',
  as: 'movimientos'
});

MovimientoInventario.belongsTo(Product, {
  foreignKey: 'id_producto',
  as: 'producto'
});
