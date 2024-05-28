"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuariosController_1 = require("../controllers/usuariosController");
class UsuariosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Rutas de usuarios
        this.router.get("/", usuariosController_1.usuariosController.listUsers);
        this.router.get("/:id", usuariosController_1.usuariosController.listOneUser);
        this.router.post("/crear_usuario", usuariosController_1.usuariosController.createUser);
        this.router.put("/actualizar_usuario/:id", usuariosController_1.usuariosController.updateUser);
        this.router.delete("/eliminar_usuario/:id", usuariosController_1.usuariosController.deleteUser);
        //Rutas de contactos
        this.router.get("/contactos/:id", usuariosController_1.usuariosController.listContacts);
        this.router.get("/contactos2/:id", usuariosController_1.usuariosController.listContacts2);
        this.router.get("/contactos/:id/:id_contacto", usuariosController_1.usuariosController.listOneContact);
        this.router.post("/contactos/nuevo_contacto/:id/:id_contacto", usuariosController_1.usuariosController.newContact);
        this.router.put("/contactos/actualizar_contacto/:id/:id_contacto", usuariosController_1.usuariosController.updateContact);
        this.router.delete("/contactos/eliminar_contacto/:id/:id_contacto", usuariosController_1.usuariosController.deleteContact);
    }
}
const usuariosRoutes = new UsuariosRoutes();
exports.default = usuariosRoutes.router;
