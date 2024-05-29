import "./App.css";
import Usuarios from "./components/usuarios/Usuarios"; // Importamos el componente Usuarios
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contactos from "./components/contactos/Contactos"; // Importamos el componente Contactos

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Usuarios />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/contactos" element={<Contactos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
