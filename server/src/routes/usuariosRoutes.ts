import { Router } from 'express';
import { usuariosController } from '../controllers/usuariosController';

class UsuariosRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        //Rutas de usuarios
        this.router.get('/', usuariosController.listUsers);
        this.router.get('/:id', usuariosController.listOneUser);
        this.router.post('/crear_usuario', usuariosController.createUser);
        this.router.put('/actualizar_usuario/:id', usuariosController.updateUser);
        this.router.delete('/eliminar_usuario/:id', usuariosController.deleteUser);
    
        //Rutas de contactos
        this.router.get('/contactos/:id', usuariosController.listContacts);
        this.router.get('/contactos/:id/:id_contacto', usuariosController.listOneContact);
        this.router.post('/contactos/nuevo_contacto/:id/:id_contacto', usuariosController.newContact);
        this.router.put('/contactos/actualizar_contacto/:id/:id_contacto', usuariosController.updateContact);
        this.router.delete('/contactos/eliminar_contacto/:id/:id_contacto', usuariosController.deleteContact);
    }
}

const usuariosRoutes = new UsuariosRoutes();
export default usuariosRoutes.router;