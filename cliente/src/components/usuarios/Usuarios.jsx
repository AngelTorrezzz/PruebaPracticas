import React, { useEffect, useState } from "react";
import "./Usuarios.css";
import { RiAddLargeLine } from "react-icons/ri";
import { BsFillPencilFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function Usuarios() {
  const url = "http://localhost:3001/api/usuarios/";

  //VARIABLES USUARIO
  const [usuarios, setUsuarios] = useState([]); // useState es un hook que permite añadir estado a los componentes de función
  const [id, setId] = useState(-1);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [op, setOp] = useState(0); // op es una variable que indica la operación a realizar [0: nada, 1: agregar, 2: editar, 3: eliminar, 4: ver
  const [title, setTitle] = useState(""); // title es una variable que indica el título del modal [Nuevo Usuario, Editar Usuario, Eliminar Usuario, Ver Usuario
  //VARIABLES MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false); // handleClose es una función que cierra el modal
  const handleShow = () => setShow(true); // handleShow es una función que abre el modal

  useEffect(() => {
    fetchUsuarios();
  }, []); // useEffect sirve para ejecutar código después de que el componente ha sido renderizado

  //FETCH'S
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAgregarUsuario = async () => {
    try {
      const response = await fetch(`${url}crear_usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombres, apellidos, correo, telefono }),
      });

      const data = await response.json();
      console.log(data);
      fetchUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEditarUsuario = async () => {
    try {
      const response = await fetch(`${url}actualizar_usuario/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombres, apellidos, correo, telefono }),
      });

      const data = await response.json();
      console.log(data);
      fetchUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEliminarUsuario = async (id) => {
    console.log(id);
    try {
      const response = await fetch(`${url}eliminar_usuario/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log(data);
      fetchUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  //FUNCIONES
  const OpenModal = (opp, usuario) => {
    setOp(opp);
    setId(-1);
    setNombres("");
    setApellidos("");
    setCorreo("");
    setTelefono("");
    if (opp === 1) {
      setTitle("Nuevo Usuario");
    } else if (opp === 2) {
      setTitle("Editar Usuario");
      setId(usuario.id);
      setNombres(usuario.nombres);
      setApellidos(usuario.apellidos);
      setCorreo(usuario.correo);
      setTelefono(usuario.telefono);
    }
    handleShow();
  };

  const Confirmar = () => {
    if (
      nombres === "" ||
      apellidos === "" ||
      correo === "" ||
      telefono === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, complete todos los campos",
      });
      return;
    } else {
      if (op === 1) {
        //AGREGAR
        // Llamar la función fetchAgregarUsuario
        Swal.fire({
          title: "¿Estás seguro de agregar el usuario?",
          text: "Verifique que los datos sean correctos",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Confirmar",
        }).then((result) => {
          if (result.isConfirmed) {
            fetchAgregarUsuario();
          }
        });
      } else if (op === 2) {
        //EDITAR
        // Llamar la función fetchEditarUsuario
        Swal.fire({
          title: "Verifique que los datos sean correctos",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Confirmar",
        }).then((result) => {
          if (result.isConfirmed) {
            fetchEditarUsuario();
          }
        });
      }
    }
    handleClose();
  };

  const EliminarUsuario = (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar el usuario?",
      text: "No podrás recuperar la información del usuario",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log("PPPPPP");
        fetchEliminarUsuario(id);
      }
    });
  };

  const RutaContactos = (usuario) => {
    localStorage.setItem("IdUsuario", usuario.id);
    localStorage.setItem("NombreUsuario", usuario.nombres);
  };

  return (
    <>
      <div className="body">
        <div className="Titulo">
          <h1>USUARIOS</h1>
        </div>
        <br></br>

        <div className="CentrarBotonAgregarUsuario">
          <button
            type="submit"
            className="btn btn-lg BotonAgregarUsuario"
            onClick={() => OpenModal(1, -1, "", "", "", "")}
          >
            <RiAddLargeLine />
          </button>
        </div>
        <div className="ListaUsuarios">
          <table className="table">
            <thead className="table table-dark">
              <tr className="TablaTitulo">
                <th scope="col">Nombres</th>
                <th scope="col">Apellidos</th>
                <th scope="col">Correo</th>
                <th scope="col">Teléfono</th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="Tuplas">
                  <td>{usuario.nombres}</td>
                  <td>{usuario.apellidos}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.telefono}</td>
                  <td>
                    <button
                      type="button"
                      className="btn BotonesUsuario"
                      onClick={() => OpenModal(2, usuario)}
                    >
                      <BsFillPencilFill />
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn BotonesUsuario"
                      onClick={() => EliminarUsuario(usuario.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td>
                    <Link to="/usuarios/contactos">
                      <button
                        type="button"
                        className="btn BotonesUsuario"
                        onClick={() => RutaContactos(usuario)}
                      >
                        <BsFillPeopleFill />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} className="body" centered>
        <Modal.Header className="ModalHeader">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="ModalBody">
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label className="ModalLabel">Nombres</Form.Label>
              <Form.Control
                type="text"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="formApellido">
              <Form.Label className="ModalLabel">Apellidos</Form.Label>
              <Form.Control
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="formCorreo">
              <Form.Label className="ModalLabel">Correo</Form.Label>
              <Form.Control
                type="text"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label className="ModalLabel">Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="ModalFooter">
          <Button
            type="button"
            className="btn ModalBotonesUsuario"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="btn ModalBotonesUsuario"
            onClick={() => Confirmar(op)}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
