import React from 'react';
import { FaUsers, FaBullseye, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="about-container">
      <header className="about-header">
        <h1 className="animated-title">À propos de nous</h1>
        <p className="intro-text">Découvrez l'histoire et les valeurs qui font de nous ce que nous sommes.</p>
      </header>

      <section className="our-story">
        <h2 className="section-title">Notre Histoire</h2>
        <p>Contenu de l'histoire...</p>
      </section>

      <div className="cards-container">
        <div className="card">
          <FaUsers className="card-icon" />
          <h2 className="card-title">Notre Équipe</h2>
          <p>Description de l'équipe...</p>
        </div>

        <div className="card">
          <FaBullseye className="card-icon" />
          <h2 className="card-title">Notre Mission</h2>
          <p>Description de la mission...</p>
        </div>

        <div className="card">
          <FaHeart className="card-icon" />
          <h2 className="card-title">Nos Valeurs</h2>
          <p>Description des valeurs...</p>
        </div>
      </div>

      <section className="cta-section">
        <h2 className="section-title">Rejoignez-nous dans cette aventure</h2>
        <button className="cta-button" onClick={handleContactClick}>Contactez-nous</button>
      </section>
    </div>
  );
};

export default About;