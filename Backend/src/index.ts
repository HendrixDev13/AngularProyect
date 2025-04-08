import dotenv from 'dotenv';
import Server from './models/server';
import db from './database/config'; // 👈 importamos la conexión Sequelize

// Cargar variables de entorno
dotenv.config();

// Probar la conexión a la base de datos
(async () => {
  try {
    await db.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }

  // Iniciar servidor
  const server = new Server();
  server.listen();
})();
