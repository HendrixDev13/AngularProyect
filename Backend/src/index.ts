import dotenv from 'dotenv';
import Server from './models/server';
import db from './database/config';
import './models/associations';

dotenv.config();

(async () => {
  try {
    await db.authenticate();
    console.log('✅ BD conectada');
    const server = new Server();
    server.listen();
  } catch (e) {
    console.error('❌ BD error:', e);
  }
})();
