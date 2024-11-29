import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ message, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default Modal;