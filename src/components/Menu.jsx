import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebaseconfig";

const Menu = () => {
  const historial = useHistory();
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUsuario(user.email);
      }
    });
  }, []);

  const CerrarSesion = () => {
    auth.signOut();
    setUsuario(null);
    historial.push("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              {!usuario ? (
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              ) : (
                <span></span>
              )}
            </li>
            <li className="nav-item">
              {!usuario ? (
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              ) : (
                <span></span>
              )}
            </li>
          </ul>
          {usuario ? (
            <button onClick={CerrarSesion} className="btn btn-danger d-flex">
              Cerrar sesión
            </button>
          ) : (
            <span></span>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Menu;
