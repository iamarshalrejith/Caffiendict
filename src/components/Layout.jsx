import Authentication from "./Authentication";
import Modal from "./Modal";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const [showModal, setShowModal] = useState(false);
  const { globalUser, logout } = useAuth();

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const header = (
    <header>
      <div>
        <h1 className="text-gradient">CAFFIENDICT</h1>
        <p>For coffee Insatiates</p>
      </div>
      {globalUser ? (
        <button onClick={logout}>
          <p>Logout</p>
        </button>
      ) : (
        <button onClick={() => setShowModal(true)}>
          <p>Sign up free</p>
          <i className="fa-solid fa-mug-hot"></i>
        </button>
      )}
    </header>
  );

  const footer = (
    <footer>
      <p>
        <span className="text-gradient">CAFFIENDICT</span> was made by{" "}
        <a href="#">Arshal Rejith S</a>
      </p>
    </footer>
  );

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
