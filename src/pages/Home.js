import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faCalendarAlt, faUsers, faStar, faChevronLeft, faChevronRight, faPencil } from "@fortawesome/free-solid-svg-icons";
import styles from "./Home.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const heroVideo = "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-the-beach-1089-large.mp4";
const parisImage = "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const marseilleImage = "https://images.pexels.com/photos/4353229/pexels-photo-4353229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const bordeauxImage = "https://images.pexels.com/photos/6033986/pexels-photo-6033986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const lilleImage = "https://images.pexels.com/photos/16140703/pexels-photo-16140703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

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
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    updateVH();
    window.addEventListener('resize', updateVH);
    return () => window.removeEventListener('resize', updateVH);
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
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '40px',
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '40px',
        }
      }
    ]
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
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Découvrez Rendez-Vous Parfait</h1>
          <p className={styles.heroSubtitle}>Individuellement ou en Groupe, créez vos Expériences Sur Mesure selon vos envies du moment</p>
          <Link to="/search" className={styles.ctaButton}>Démarrez l'Aventure</Link>
        </div>
      </header>

      <section className={styles.howItWorks}>
        <h2>Notre Processus en 3 Étapes</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <FontAwesomeIcon icon={faPencil} className={styles.stepIcon} />
            <h3>Personnalisez Votre Profil</h3>
            <p>Exprimez vos Envies et Goûts Personnels, en Solo ou en Groupe</p>
          </div>
          <div className={styles.step}>
            <FontAwesomeIcon icon={faCalendarAlt} className={styles.stepIcon} />
            <h3>Choisissez Vos Dates</h3>
            <p>Sélectionnez les Dates qui Correspondent Parfaitement à Votre Planning</p>
          </div>
          <div className={styles.step}>
            <FontAwesomeIcon icon={faStar} className={styles.stepIcon} />
            <h3>Fixez Vos Préférences</h3>
            <p>Définissez Vos Préférences en Quelques Clics</p>
          </div>
        </div>
      </section>

      <section className={styles.popularDestinations}>
        <h2>Destinations Incontournables</h2>
        <div className={styles.sliderContainer}>
          <Slider {...destinationSettings}>
            {[
              { name: "Paris", image: parisImage, description: "Vivez la Magie de la Ville de l'Amour" },
              { name: "Marseille", image: marseilleImage, description: "Plongez dans les Eaux Turquoises du Sud" },
              { name: "Bordeaux", image: bordeauxImage, description: "Profitez de l'Énergie des Vignobles" },
              { name: "Lille", image: lilleImage, description: "Découvrez les Charmes du Nord" }
            ].map((destination, index) => (
              <div key={index} className={styles.destinationItem}>
                <Link to={`/search?destination=${destination.name}`} className={styles.destinationLink}>
                  <img src={destination.image} alt={destination.name} className={styles.destinationImage} />
                  <h3>{destination.name}</h3>
                  <p>{destination.description}</p>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2>Ce que Disent nos Voyageurs</h2>
        <Slider {...testimonialSettings}>
          <div className={styles.testimonialItem}>
            <p className={styles.testimonialText}>
              "Rendez-Vous Parfait a rendu notre escapade romantique à Paris inoubliable. Chaque activité était parfaitement adaptée à nos goûts !"
            </p>
            <div className={styles.testimonialAuthor}>
              <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Marie et Thomas" className={styles.authorImage} />
              <span>Marie et Thomas, 28 ans</span>
            </div>
            <div className={styles.testimonialRating}>
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
          </div>
          <div className={styles.testimonialItem}>
            <p className={styles.testimonialText}>
              "J'ai découvert des trésors cachés à Bordeaux que je n'aurais jamais trouvés seul. Merci pour cette aventure unique !"
            </p>
            <div className={styles.testimonialAuthor}>
              <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Lucas" className={styles.authorImage} />
              <span>Lucas, 35 ans</span>
            </div>
            <div className={styles.testimonialRating}>
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
          </div>
        </Slider>
      </section>

      <section className={styles.blogSection}>
        <h2>Idées de Voyages Inspirantes</h2>
        <div className={styles.blogPosts}>
          <div className={styles.blogPost}>
            <img src="https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog post 1" />
            <h3>Les 10 Lieux Incontournables à Paris</h3>
            <p>Explorez les Trésors Cachés de la Ville Lumière...</p>
            <Link to="/blog/post1" className={styles.readMore}>Découvrir Plus</Link>
          </div>
          <div className={styles.blogPost}>
            <img src="https://images.pexels.com/photos/1573471/pexels-photo-1573471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog post 2" />
            <h3>Les Plus Belles Plages de Marseille</h3>
            <p>Plongez dans les Criques Paradisiaques de la Côte Méditerranéenne...</p>
            <Link to="/blog/post2" className={styles.readMore}>Découvrir Plus</Link>
          </div>
          <div className={styles.blogPost}>
            <img src="https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog post 3" />
            <h3>Guide des Vins de Bordeaux</h3>
            <p>Initiez-vous à l'Art de la Dégustation dans la Capitale du Vin...</p>
            <Link to="/blog/post3" className={styles.readMore}>Découvrir Plus</Link>
          </div>
        </div>
      </section>

      <section className={styles.partners}>
        <h2>Nos Partenaires de Confiance</h2>
        <div className={styles.partnerLogos}>
          <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/e/e7/Logo_big_mamma.png/640px-Logo_big_mamma.png" alt="Accor" />
          <img src="https://logos-world.net/wp-content/uploads/2020/03/Ryanair-Logo-700x394.png" alt="Ryanair" />
          <img src="https://e7.pngegg.com/pngimages/248/721/png-clipart-airbnb-rebrand-logo-online-marketplace-rebranding-airbnb-logo-text-service-thumbnail.png" alt="Avis" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/2560px-Booking.com_logo.svg.png" alt="Booking.com" />
        </div>
      </section>

      <section className={styles.newsletter}>
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
          <button type="submit" className={styles.newsletterButton}>
            S'abonner
          </button>
        </form>
      </section>

      <div className={styles.floatingCTA}>
        <Link to="/search" className={styles.ctaButton}>
          Réservation Personnalisée
        </Link>
      </div>
    </div>
  );
}

export default Home;