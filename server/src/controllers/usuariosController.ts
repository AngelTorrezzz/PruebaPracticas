import { Request, Response } from "express";
import pool from "../database";

class UsuariosController {
  //USUARIOS

  public async listUsers(req: Request, res: Response): Promise<void> {
    const usuarios = await pool.query("SELECT * FROM usuarios");
    res.json(usuarios);
  }

  public async listOneUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const respuesta = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);
    if (respuesta.length > 0) {
      res.json(respuesta[0]);
      return;
    }
    res.status(404).json({ mensaje: "El usuario no existe" });
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    const resp = await pool.query("INSERT INTO usuarios set ?", [req.body]);
    res.json(resp);
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    console.log(req.body);
    const resp = await pool.query("UPDATE usuarios set ? WHERE id = ?", [
      req.body,
      id,
    ]);
    res.json(resp);
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const resp = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    const resp2 = await pool.query(
      "DELETE FROM contactos WHERE id_usuario = ? OR id_contacto = ?",
      [id, id]
    );
    res.json(resp);
  }

  //CONTACTOS
  //Se listan los contactos de un usuario el alias de cada contacto se obtiene de la tabla contactos y los datos del contacto de la tabla usuarios
  public async listContacts(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const resp = await pool.query(
      "SELECT * FROM usuarios WHERE usuarios.id IN (SELECT contactos.id_contacto FROM contactos WHERE contactos.id_usuario = ?);",
      [id]
    );
    const resp2 = await pool.query(
      "SELECT contactos.id_contacto, contactos.alias FROM contactos WHERE id_usuario = ? ORDER BY contactos.id_contacto",
      [id]
    );

    //Se agrega el alias a cada contacto para mostrarlo en la lista debido a que el alias se encuentra en la tabla contactos
    for (let i = 0; i < resp2.length; i++) {
      resp[i].alias = resp2[i].alias;
    }
    res.json(resp);
  }

  public async listContacts2(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const resp = await pool.query(
      "SELECT * FROM usuarios WHERE usuarios.id NOT IN (SELECT contactos.id_contacto FROM contactos WHERE contactos.id_usuario = ?) AND usuarios.id != ?;",
      [id, id]
    );
    res.json(resp);
  }

  //El alias de un contacto se obtiene de la tabla contactos y los datos del contacto de la tabla usuarios
  public async listOneContact(req: Request, res: Response): Promise<void> {
    const { id, id_contacto } = req.params;
    const resp = await pool.query(
      "SELECT * FROM usuarios WHERE usuarios.id IN (SELECT contactos.id_contacto FROM contactos WHERE contactos.id_usuario = ?) AND usuarios.id = ?;",
      [id, id_contacto]
    );
    const resp2 = await pool.query(
      "SELECT contactos.alias FROM contactos WHERE id_usuario = ? AND id_contacto = ?",
      [id, id_contacto]
    );

    resp[0].alias = resp2[0].alias;
    res.json(resp);
  }

  //Se crea un nuevo contacto con un alias pero los datos del contacto son los mismos que los del usuario (no editables)
  public async newContact(req: Request, res: Response): Promise<void> {
    const { id, id_contacto } = req.params;

    const existeAlias = await pool.query(
      "SELECT * FROM contactos WHERE alias = ? AND id_usuario = ?",
      [req.body.alias, id]
    );
    if (existeAlias.length > 0) {
      //console.log("proobando");
      res.json({ mensaje: "El alias ya existe" });
      return;
    } else {
      const nuevo = {
        id_usuario: id,
        id_contacto: id_contacto,
        alias: req.body.alias,
      };
      const resp = await pool.query("INSERT INTO contactos set ?", [nuevo]);
      res.json(resp);
    }
  }

  //Lo unico que puede cambiar de un contacto es el alias
  public async updateContact(req: Request, res: Response): Promise<void> {
    const { id, id_contacto } = req.params;

    const existeAlias = await pool.query(
      "SELECT * FROM contactos WHERE alias = ? AND id_usuario = ?",
      [req.body.alias, id]
    );
    if (existeAlias.length > 0) {
      res.json({ mensaje: "El alias ya existe" });
      return;
    } else {
      const resp = await pool.query(
        "UPDATE contactos set ? WHERE id_usuario = ? AND id_contacto = ?",
        [req.body, id, id_contacto]
      );
      res.json(resp);
    }
  }

  public async deleteContact(req: Request, res: Response): Promise<void> {
    const { id, id_contacto } = req.params;
    const resp = await pool.query(
      "DELETE FROM contactos WHERE id_usuario = ? AND id_contacto = ?",
      [id, id_contacto]
    );
    res.json(resp);
  }
}

export const usuariosController = new UsuariosController();
