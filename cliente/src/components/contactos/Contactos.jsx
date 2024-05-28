import React from "react";
import { useEffect, useState } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import Swal from "sweetalert2";
import { RiAddLargeLine } from "react-icons/ri";
import { BsFillPencilFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import "./Contactos.css";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Contactos() {
  const url = "http://localhost:3001/api/usuarios/";

  //VARIABLES USUARIO
  const [contactos, setContactos] = useState([]);
  const [alias, setAlias] = useState("");
  const [op, setOp] = useState(0);
  const [title, setTitle] = useState("");
  const [usuarios, setUsuarios] = useState([]); // useState es un hook que permite añadir estado a los componentes de función

  //VARIABLES MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false); // handleClose es una función que cierra el modal
  const handleShow = () => setShow(true); // handleShow es una función que abre el modal

  const [IdUsuario, setIdUsuario] = useState("");
  const [NombreUsuario, setNombreUsuario] = useState("");
  const [IdContacto, setIdContacto] = useState("");

  useEffect(() => {
    ObtenerRutaUsuario();
    if (IdUsuario) {
      fetchContactos(IdUsuario);
    }
  }, [IdUsuario]); // Ejecutar solo cuando IdUsuario cambie

  //FETCH'S
  const fetchContactos = async (id) => {
    //console.log("P" + id);
    try {
      const response = await fetch(`${url}contactos/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
      setContactos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAgregarContacto = async () => {
    console.log(IdUsuario);
    console.log(IdContacto);
    try {
      const response = await fetch(
        `${url}contactos/nuevo_contacto/${IdUsuario}/${IdContacto}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alias }),
        }
      );
      
      console.log(response.data.mensaje);
      if (response.data.mensaje === "El alias ya existe") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El alias ya existe",
        });
        return;
      }
      //console.log(data);

      const data = await response.json();
      fetchContactos(IdUsuario);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEditarContacto = async () => {
    try {
      const response = await fetch(
        `${url}contactos/actualizar_contacto/${IdUsuario}/${IdContacto}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alias }),
        }
      );
      const data = await response.json();
      console.log(response.data.mensaje);
      if (response.data.mensaje === "El alias ya existe") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El alias ya existe",
        });
        return;
      }
      //console.log(data);
      fetchContactos(IdUsuario);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEliminarContacto = async (contactoo) => {
    console.log(contactoo.id);
    try {
      const response = await fetch(
        `${url}contactos/eliminar_contacto/${IdUsuario}/${contactoo.id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log(data);
      fetchContactos(IdUsuario);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${url}contactos2/${IdUsuario}`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  //FUNCIONES
  const ObtenerRutaUsuario = () => {
    let IdUsuario = localStorage.getItem("IdUsuario");
    //console.log(IdUsuario);
    let NombreUsuario = localStorage.getItem("NombreUsuario");
    //console.log(NombreUsuario);
    setIdUsuario(IdUsuario);
    setNombreUsuario(NombreUsuario);
  };

  const OpenModal = (opp, usuario) => {
    setOp(opp);
    setAlias("");
    if (opp === 1) {
      setTitle("Nuevo Contacto");
      fetchUsuarios();
    } else if (opp === 2) {
      setTitle("Editar Contacto");
      setAlias(usuario.alias);
    }
    handleShow();
  };

  const Confirmar = () => {
    if (alias === "") {
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
          title: "¿Estás seguro de agregar el contacto?",
          text: "Verifique que los datos sean correctos",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Confirmar",
        }).then((result) => {
          if (result.isConfirmed) {
            fetchAgregarContacto();
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
            fetchEditarContacto();
          }
        });
      }
    }
    handleClose();
  };

  const EliminarContacto = (contactoo) => {
    Swal.fire({
      title:
        "¿Estás seguro de eliminar el contacto: " + contactoo.nombres + "?",
      text: "No podrás recuperar la información del contacto",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log("PPPPPP");
        fetchEliminarContacto(contactoo);
      }
    });
  };

  return (
    <>
      <div className="body">
        <div className="Titulo">
          <h1>CONTACTOS</h1>
        </div>
        <br></br>

        <h3 className="Contactos">Contactos De: {NombreUsuario}</h3>

        <br></br>
        <div className="CentrarBotonAgregarUsuario">
          <Link to="/usuarios">
            <button type="submit" className="btn btn-lg BotonAgregarUsuario">
              <IoArrowBack />
            </button>
          </Link>
          <button
            type="submit"
            className="btn btn-lg BotonAgregarUsuario"
            onClick={() => OpenModal(1, null)}
          >
            <RiAddLargeLine />
          </button>
        </div>
        <div className="ListaUsuarios">
          <table className="table">
            <thead className="table table-dark">
              <tr className="TablaTitulo">
                <th scope="col">Alias</th>
                <th scope="col">Nombres</th>
                <th scope="col">Apellidos</th>
                <th scope="col">Correo</th>
                <th scope="col">Teléfono</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((contacto) => (
                <tr key={contacto.id} className="Tuplas">
                  <td className="RemarcarCasilla">{contacto.alias}</td>
                  <td>{contacto.nombres}</td>
                  <td>{contacto.apellidos}</td>
                  <td>{contacto.correo}</td>
                  <td>{contacto.telefono}</td>
                  <td>
                    <button
                      type="button"
                      className="btn BotonesUsuario"
                      onClick={() => OpenModal(2, contacto)}
                    >
                      <BsFillPencilFill />
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn BotonesUsuario"
                      onClick={() => EliminarContacto(contacto)}
                    >
                      <FaTrash />
                    </button>
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
          {op === 1 && (
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Seleccionar Nuevo Contacto
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {usuarios.map((noComun) => (
                  <Dropdown.Item
                    key={noComun.id}
                    value={noComun.id}
                    onClick={() => setIdContacto(noComun.id)}
                  >
                    {noComun.nombres}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label className="ModalLabel">Alias</Form.Label>
              <Form.Control
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
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
