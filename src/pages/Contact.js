import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCommentAlt,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import styles from "./Contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.contactContainer}>
        <h1 className={styles.contactTitle}>Contactez-nous</h1>
        <p className={styles.contactDescription}>
          N'hésitez pas à nous contacter pour toute question ou suggestion.
        </p>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Votre email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <FaCommentAlt className={styles.inputIcon} />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Votre message"
              required
            ></textarea>
          </div>
          <button type="submit" className={styles.submitBtn}>
            Envoyer
          </button>
        </form>
        <div className={styles.contactInfo}>
          <h2>Informations de contact</h2>
          <p>
            <FaMapMarkerAlt /> 123 Rue du Bonheur, 75000 Paris
          </p>
          <p>
            <FaPhone /> +33 1 23 45 67 89
          </p>
          <p>
            <FaEnvelope /> info@rendezvousparfait.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
