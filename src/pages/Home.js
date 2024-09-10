import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faUsers,
  faStar,
  faChevronLeft,
  faChevronRight,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Home.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";

const heroVideo =
  "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-the-beach-1089-large.mp4";
const parisImage =
  "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const marseilleImage =
  "https://images.pexels.com/photos/4353229/pexels-photo-4353229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const bordeauxImage =
  "https://images.pexels.com/photos/6033986/pexels-photo-6033986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const lilleImage =
  "https://images.pexels.com/photos/16140703/pexels-photo-16140703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const NextArrow = ({ onClick }) => (
  <div className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick}>
    <FontAwesomeIcon icon={faChevronRight} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick}>
    <FontAwesomeIcon icon={faChevronLeft} />
  </div>
);

function Home() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    function updateVH() {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
    }
    updateVH();
    window.addEventListener("resize", updateVH);
    return () => window.removeEventListener("resize", updateVH);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email soumis:", email);
    setEmail("");
    alert("Merci de vous être inscrit à notre newsletter!");
  };

  const destinationSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className={styles.home}>
      <header className={styles.hero}>
        <video autoPlay muted loop className={styles.heroVideo}>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.heroTitle}>Découvrez Rendez-Vous Parfait</h1>
          <p className={styles.heroSubtitle}>
            Individuellement ou en Groupe, créez vos Expériences Sur Mesure
            selon vos envies du moment
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/search" className={styles.ctaButton}>
              Démarrez l'Aventure
            </Link>
          </motion.div>
        </motion.div>
      </header>

      <section className={styles.howItWorks}>
        <h2>Notre Processus en 3 Étapes</h2>
        <div className={styles.steps}>
          {[
            {
              icon: faPencil,
              title: "Personnalisez Votre Profil",
              description: "Exprimez vos Envies et Goûts Personnels, en Solo ou en Groupe",
            },
            {
              icon: faCalendarAlt,
              title: "Choisissez Vos Dates",
              description: "Sélectionnez les Dates qui Correspondent Parfaitement à Votre Planning",
            },
            {
              icon: faStar,
              title: "Fixez Vos Préférences",
              description: "Définissez Vos Préférences en Quelques Clics",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              className={styles.step}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FontAwesomeIcon icon={step.icon} className={styles.stepIcon} />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.popularDestinations}>
        <h2>Destinations Incontournables</h2>
        <Slider {...destinationSettings}>
          {[
            {
              name: "Paris",
              image: parisImage,
              description: "Vivez la Magie de la Ville de l'Amour",
            },
            {
              name: "Marseille",
              image: marseilleImage,
              description: "Plongez dans les Eaux Turquoises du Sud",
            },
            {
              name: "Bordeaux",
              image: bordeauxImage,
              description: "Profitez de l'Énergie des Vignobles",
            },
            {
              name: "Lille",
              image: lilleImage,
              description: "Découvrez les Charmes du Nord",
            },
          ].map((destination, index) => (
            <motion.div
              key={index}
              className={styles.destinationItem}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={`/search?destination=${destination.name}`}
                className={styles.destinationLink}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className={styles.destinationImage}
                />
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
              </Link>
            </motion.div>
          ))}
        </Slider>
      </section>

      <section className={styles.testimonials}>
        <h2>Ce que Disent nos Voyageurs</h2>
        <Slider {...testimonialSettings}>
          <div className={styles.testimonialItem}>
            <p className={styles.testimonialText}>
              "Rendez-Vous Parfait a rendu notre escapade romantique à Paris
              inoubliable. Chaque activité était parfaitement adaptée à nos
              goûts !"
            </p>
            <div className={styles.testimonialAuthor}>
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Marie et Thomas"
                className={styles.authorImage}
              />
              <span>Marie et Thomas, 28 ans</span>
            </div>
            <div className={styles.testimonialRating}>
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} />
              ))}
            </div>
          </div>
          <div className={styles.testimonialItem}>
            <p className={styles.testimonialText}>
              "J'ai découvert des trésors cachés à Bordeaux que je n'aurais
              jamais trouvés seul. Merci pour cette aventure unique !"
            </p>
            <div className={styles.testimonialAuthor}>
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Lucas"
                className={styles.authorImage}
              />
              <span>Lucas, 35 ans</span>
            </div>
            <div className={styles.testimonialRating}>
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} />
              ))}
            </div>
          </div>
        </Slider>
      </section>

      <section className={styles.newsletter}>
        <motion.div
          className={styles.newsletterCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Restez Informé de nos Dernières Offres</h2>
          <p>Abonnez-vous à notre Newsletter pour ne Rien Manquer !</p>
          <form onSubmit={handleSubmit} className={styles.newsletterForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre Adresse E-mail"
              required
              className={styles.newsletterInput}
            />
            <motion.button
              type="submit"
              className={styles.newsletterButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              S'abonner
            </motion.button>
          </form>
        </motion.div>
      </section>

      <motion.div
        className={styles.floatingCTA}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Link to="/search" className={styles.ctaButton}>
          Réservation Personnalisée
        </Link>
      </motion.div>
    </div>
  );
}

export default Home;