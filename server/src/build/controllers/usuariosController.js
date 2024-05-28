"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuariosController = void 0;
const database_1 = __importDefault(require("../database"));
class UsuariosController {
    //USUARIOS
    listUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarios = yield database_1.default.query("SELECT * FROM usuarios");
            res.json(usuarios);
        });
    }
    listOneUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query("SELECT * FROM usuarios WHERE id = ?", [
                id,
            ]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ mensaje: "El usuario no existe" });
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO usuarios set ?", [req.body]);
            res.json(resp);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(req.body);
            const resp = yield database_1.default.query("UPDATE usuarios set ? WHERE id = ?", [
                req.body,
                id,
            ]);
            res.json(resp);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("DELETE FROM usuarios WHERE id = ?", [id]);
            const resp2 = yield database_1.default.query("DELETE FROM contactos WHERE id_usuario = ? OR id_contacto = ?", [id, id]);
            res.json(resp);
        });
    }
    //CONTACTOS
    //Se listan los contactos de un usuario el alias de cada contacto se obtiene de la tabla contactos y los datos del contacto de la tabla usuarios
    listContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("SELECT * FROM usuarios WHERE usuarios.id IN (SELECT contactos.id_contacto FROM contactos WHERE contactos.id_usuario = ?);", [id]);
            const resp2 = yield database_1.default.query("SELECT contactos.alias FROM contactos WHERE id_usuario = ?", [id]);
            //Se agrega el alias a cada contacto para mostrarlo en la lista debido a que el alias se encuentra en la tabla contactos
            for (let i = 0; i < resp2.length; i++) {
                resp[i].alias = resp2[i].alias;
            }
            res.json(resp);
        });
    }
    listContacts2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("SELECT * FROM usuarios WHERE usuarios.id NOT IN (SELECT contactos.id_contacto FROM contactos WHERE contactos.id_usuario = ?) AND usuarios.id != ?;", [id, id]);
            res.json(resp);
        });
    }
    //El alias de un contacto se obtiene de la tabla contactos y los datos del contacto de la tabla usuarios
    listOneContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, id_contacto } = req.params;
            const resp = yield database_1.default.query("SELECT * FROM usuarios WHERE usuarios.id IN (SELECT contactos.id_contacto FROM contactos WHERE contactos.id_usuario = ?) AND usuarios.id = ?;", [id, id_contacto]);
            const resp2 = yield database_1.default.query("SELECT contactos.alias FROM contactos WHERE id_usuario = ? AND id_contacto = ?", [id, id_contacto]);
            resp[0].alias = resp2[0].alias;
            res.json(resp);
        });
    }
    //Se crea un nuevo contacto con un alias pero los datos del contacto son los mismos que los del usuario (no editables)
    newContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, id_contacto } = req.params;
            const existeAlias = yield database_1.default.query("SELECT * FROM contactos WHERE alias = ? AND id_usuario = ?", [req.body.alias, id]);
            if (existeAlias.length > 0) {
                res.json({ mensaje: "El alias ya existe" });
                return;
            }
            else {
                const nuevo = {
                    id_usuario: id,
                    id_contacto: id_contacto,
                    alias: req.body.alias,
                };
                const resp = yield database_1.default.query("INSERT INTO contactos set ?", [nuevo]);
                res.json(resp);
            }
        });
    }
    //Lo unico que puede cambiar de un contacto es el alias
    updateContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, id_contacto } = req.params;
            const existeAlias = yield database_1.default.query("SELECT * FROM contactos WHERE alias = ? AND id_usuario = ?", [req.body.alias, id]);
            if (existeAlias.length > 0) {
                res.json({ mensaje: "El alias ya existe" });
                return;
            }
            else {
                const resp = yield database_1.default.query("UPDATE contactos set ? WHERE id_usuario = ? AND id_contacto = ?", [req.body, id, id_contacto]);
                res.json(resp);
            }
        });
    }
    deleteContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, id_contacto } = req.params;
            const resp = yield database_1.default.query("DELETE FROM contactos WHERE id_usuario = ? AND id_contacto = ?", [id, id_contacto]);
            res.json(resp);
        });
    }
}
exports.usuariosController = new UsuariosController();
