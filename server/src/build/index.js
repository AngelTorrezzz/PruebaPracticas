"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const usuariosRoutes_1 = __importDefault(require("./routes/usuariosRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000); // Establece el puerto
        this.app.use((0, morgan_1.default)('dev')); // Muestra por consola las peticiones
        this.app.use((0, cors_1.default)()); // Permite la comunicación entre servidores
        this.app.use(express_1.default.json()); // Permite recibir formatos json
        this.app.use(express_1.default.urlencoded({ extended: false })); // Permite recibir datos de formularios
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use('/api/usuarios', usuariosRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
