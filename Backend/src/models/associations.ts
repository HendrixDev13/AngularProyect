import User from './user';
import Rol from './rol';
import Product from './product';
import Inventario from './inventario';
import MovimientoInventario from './movimientoInventario';
import Venta from './venta';
import DetalleVenta from './detalleVenta';

// Asociación Rol - User
Rol.hasMany(User, {
  foreignKey: 'id_rol',
  as: 'usuarios',
});

User.belongsTo(Rol, {
  foreignKey: 'id_rol',
  as: 'rol',
});

// Asociación Product - Inventario
Product.hasOne(Inventario, {
  foreignKey: 'id_producto',
  as: 'inventario',
});

Inventario.belongsTo(Product, {
  foreignKey: 'id_producto',
  as: 'producto',
});

// Asociación Product - MovimientoInventario
Product.hasMany(MovimientoInventario, {
  foreignKey: 'id_producto',
  as: 'movimientos',
});

MovimientoInventario.belongsTo(Product, {
  foreignKey: 'id_producto',
  as: 'producto',
});

Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta' });