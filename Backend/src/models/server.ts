import express, { Application } from 'express';
import cors from 'cors';
import routesProduct from '../routes/product';
import routesUsers from '../routes/user';
import Product from './product';
import User from './user';
import Rol from './rol';

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '3001';
    this.midlewares();
    this.routes();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Aplicación corriendo en el puerto ' + this.port);
    });
  }

  routes() {
    this.app.use('/api/products', routesProduct);
    this.app.use('/api/users', routesUsers);
  }

  midlewares() {
    this.app.use(cors({
      origin: 'http://localhost:4200',
      credentials: true
    }));

    this.app.use(express.json());
  }

  async dbConnection() {
    try {
      await Product.sync();
      await User.sync();
      await Rol.sync();
    } catch (error) {
      console.error('Error al conectar a la base de datos', error);
    }
  }
}

export default Server;
