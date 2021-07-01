import React from "react";
import { useState, useEffect } from "react";
import { store } from "./firebaseconfig";

function App() {
  const [modoedit, setModoEdit] = useState(null);
  const [iduser, setIdUser] = useState("");
  const [nombre, setNombre] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsuarios = async () => {
      const { docs } = await store.collection("agenda").get();
      const nvoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setUsers(nvoArray);
    };
    getUsuarios();
  }, []);

  const setUsuarios = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El campo nombre está vacío");
    } else if (!phone.trim()) {
      setError("El campo teléfono está vacío");
    }
    const usuario = {
      nombre: nombre,
      telefono: phone,
    };
    try {
      const data = await store.collection("agenda").add(usuario);
      const { docs } = await store.collection("agenda").get();
      const nvoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setUsers(nvoArray);
      alert("Usuario añadido");
    } catch (error) {
      console.log(error);
    }
    setNombre("");
    setPhone("");
  };

  const borrarUsuario = async (id) => {
    try {
      await store.collection('agenda').doc(id).delete()
      const { docs } = await store.collection("agenda").get();
      const nvoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setUsers(nvoArray);
    } catch (error) {
      console.log(error)
    }
  }

  const pulsarEditar = async (id) => {
    try {
      const data = await store.collection('agenda').doc(id).get();
      const {nombre, telefono} = data.data();
      setIdUser(id);
      setNombre(nombre);
      setPhone(telefono);
      setModoEdit(true)
      console.log(id);
    } catch (error) {
      console.log(error)
    }
  }

  const setUpdate = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setError("El campo nombre está vacío");
    } else if (!phone.trim()) {
      setError("El campo teléfono está vacío");
    }
    const userUpdate = {
      nombre: nombre,
      telefono: phone
    }
    try {
      await store.collection('agenda').doc(iduser).set(userUpdate)
      const { docs } = await store.collection("agenda").get();
      const nvoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setUsers(nvoArray);
      setIdUser('');
      setNombre('');
      setPhone('');
      setModoEdit(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Formulario de usuarios</h2>
          <form onSubmit={modoedit ? setUpdate : setUsuarios} className="form-group d-grid">
            <input
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
              }}
              className="form-control"
              type="text"
              placeholder="Introduce el nombre"
            />
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              className="form-control mt-3"
              type="text"
              placeholder="Introduce el teléfono"
            />
            {
              modoedit ?
              (
                <input
              type="submit"
              value="Editar"
              className="btn btn-dark mt-3"
            />
              )
              :
              (
                <input
              type="submit"
              value="Registrar"
              className="btn btn-dark mt-3"
            />
              )
            }
          </form>
          {error ? (
            <div className="alert alert-secondary mt-3" role="alert">
              {error}
            </div>
          ) : (
            <span></span>
          )}
        </div>
        <div className="col">
          <h2>Lista de Contactos</h2>
          <ul className="list-group">
          {users.length !== 0 ? (
            users.map(item => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>{item.nombre} -- {item.telefono}
              <div className="d-flex gap-3">
              <button onClick={(id)=>{pulsarEditar(item.id)}} className="btn btn-info ">Editar</button>
              <button onClick={(id)=>{borrarUsuario(item.id)}} className="btn btn-danger">Borrar</button>
              </div>
              </li>
            ))
          ) : (
            <div class="alert alert-info" role="alert">
              No hay usuarios en tu agenda
            </div>
          )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
