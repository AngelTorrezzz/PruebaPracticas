"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class UsuariosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/usuarios/', (req, res) => res.send('Usuarios'));
    }
}
const usuariosRoutes = new UsuariosRoutes();
exports.default = usuariosRoutes.router;
