import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import indexRoutes from './routes/indexRoutes';
import usuariosRoutes from './routes/usuariosRoutes';

class Server {
    public app: Application;//hola
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);// Establece el puerto
        this.app.use(morgan('dev'));// Muestra por consola las peticiones
        this.app.use(cors());// Permite la comunicación entre servidores
        this.app.use(express.json());// Permite recibir formatos json
        this.app.use(express.urlencoded({ extended: false }));// Permite recibir datos de formularios
    }

    routes(): void { 
        this.app.use(indexRoutes);
        this.app.use('/api/usuarios', usuariosRoutes);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();