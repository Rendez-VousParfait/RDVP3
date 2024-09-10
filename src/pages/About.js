import React, { useEffect, useRef, useState } from "react";
import {
  FaUsers,
  FaBullseye,
  FaHeart,
  FaRocket,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaGlobe,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./About.module.css";
import backgroundImage from "../assets/selon-une-etude-voici-combien-fois-par-semaine-nous-devrions-voir-nos-amis-pour-etre-heureux.jpeg";
import tourEiffelImage from "../assets/toureiffel-intro-shutterstock.jpg";

const About = () => {
  const navigate = useNavigate();
  const timelineRef = useRef(null);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll(
      `.${styles["animate-on-scroll"]}`,
    );
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div className={styles["about-container"]}>
      <header className={styles["about-header"]}>
        <img
          src={backgroundImage}
          alt="Background"
          className={styles["parallax-bg"]}
        />
        <div className={styles["header-content"]}>
          <h1 className={styles["animated-title"]}>Rendez-Vous Parfait</h1>
          <p className={styles["intro-text"]}>
            Créons ensemble des moments inoubliables
          </p>
        </div>
      </header>

      <section
        id="our-story"
        className={`${styles["our-story"]} ${styles["animate-on-scroll"]} ${isVisible["our-story"] ? styles["visible"] : ""}`}
      >
        <h2 className={styles["section-title"]}>Notre Histoire</h2>
        <div className={styles["story-content"]}>
          <div className={styles["story-text"]}>
            <p>
              Fondée en 2024 par 4 jeunes Bordelais, Rendez-Vous Parfait est née
              d'une vision audacieuse : révolutionner la reservation grâce à la
              personnalisation. Notre plateforme innovante combine technologie
              de pointe et compréhension profonde des désirs humains pour créer
              des expériences sur mesure.
            </p>
          </div>
          <div className={styles["story-image"]}>
            <img
              src={tourEiffelImage}
              alt="Tour Eiffel"
              className={styles["story-image-content"]}
            />
          </div>
        </div>
      </section>

      <div
        id="values"
        className={`${styles["values-container"]} ${styles["animate-on-scroll"]} ${isVisible["values"] ? styles["visible"] : ""}`}
      >
        <div className={styles["value-card"]}>
          <FaUsers className={styles["value-icon"]} />
          <h2 className={styles["value-title"]}>Connexion</h2>
          <p>
            Limitez les multiples plateformes, et centralisez l'ensemble de vos
            recherches.
          </p>
        </div>

        <div className={styles["value-card"]}>
          <FaBullseye className={styles["value-icon"]} />
          <h2 className={styles["value-title"]}>Innovation</h2>
          <p>
            Nous repoussons constamment les limites de la technologie pour
            améliorer vos expériences.
          </p>
        </div>

        <div className={styles["value-card"]}>
          <FaHeart className={styles["value-icon"]} />
          <h2 className={styles["value-title"]}>Passion</h2>
          <p>
            Chaque détail de notre service est imprégné de notre amour pour le
            parcours client.
          </p>
        </div>
      </div>

      <section
        id="timeline"
        className={`${styles["timeline"]} ${styles["animate-on-scroll"]} ${isVisible["timeline"] ? styles["visible"] : ""}`}
        ref={timelineRef}
      >
        <h2 className={styles["section-title"]}>Notre Évolution</h2>
        <div className={styles["timeline-container"]}>
          <div className={styles["timeline-line"]}></div>
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className={styles["timeline-item"]}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className={styles["timeline-content"]}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className={styles["timeline-icon"]}>{item.icon}</div>
              <div className={styles["timeline-date"]}>{item.date}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="cta"
        className={`${styles["cta-section"]} ${styles["animate-on-scroll"]} ${isVisible["cta"] ? styles["visible"] : ""}`}
      >
        <h2 className={styles["section-title"]}>Rejoignez l'Aventure</h2>
        <p>Prêt à transformer vos sorties en expériences extraordinaires ?</p>
        <button className={styles["cta-button"]} onClick={handleContactClick}>
          <FaRocket /> Commencez Maintenant
        </button>
      </section>
    </div>
  );
};

const timelineData = [
  {
    date: "2024",
    title: "Lancement de Rendez-Vous Parfait",
    description:
      "Début de notre aventure pour révolutionner la réservation personnalisée.",
    icon: <FaRocket />,
  },
  {
    date: "2026",
    title: "Expansion dans 10 nouvelles villes",
    description: "Notre service s'étend pour couvrir plus de destinations.",
    icon: <FaMapMarkedAlt />,
  },
  {
    date: "2026",
    title: "Lancement de notre application mobile",
    description:
      "Rendez-Vous Parfait devient accessible partout, à tout moment.",
    icon: <FaMobileAlt />,
  },
  {
    date: "2028",
    title: "Expansion internationale",
    description: "Nous franchissons les frontières pour une présence mondiale.",
    icon: <FaGlobe />,
  },
];

export default About;
