import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faCalendarAlt, faUsers, faStar, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
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
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
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
          <h1 className={styles.heroTitle}>Découvrez votre prochaine aventure</h1>
          <p className={styles.heroSubtitle}>Personnalisez vos voyages selon vos envies</p>
          <Link to="/search" className={styles.ctaButton}>Commencer l'aventure</Link>
        </div>
      </header>

      <section className={styles.howItWorks}>
        <h2>Comment ça marche</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.stepIcon} />
            <h3>Choisissez votre destination</h3>
            <p>Sélectionnez parmi nos nombreuses destinations</p>
          </div>
          <div className={styles.step}>
            <FontAwesomeIcon icon={faCalendarAlt} className={styles.stepIcon} />
            <h3>Sélectionnez vos dates</h3>
            <p>Choisissez les dates qui vous conviennent le mieux</p>
          </div>
          <div className={styles.step}>
            <FontAwesomeIcon icon={faUsers} className={styles.stepIcon} />
            <h3>Personnalisez votre voyage</h3>
            <p>Adaptez votre itinéraire selon vos préférences</p>
          </div>
        </div>
      </section>

      <section className={styles.popularDestinations}>
        <h2>Destinations populaires</h2>
        <div className={styles.sliderContainer}>
          <Slider {...destinationSettings}>
            <div className={styles.destinationItem}>
              <img src={parisImage} alt="Paris" className={styles.destinationImage} />
              <h3>Paris</h3>
              <p>Découvrez la ville de l'amour</p>
              <Link to="/search?destination=Paris" className={styles.destinationLink}>Explorer</Link>
            </div>
            <div className={styles.destinationItem}>
              <img src={marseilleImage} alt="Marseille" className={styles.destinationImage} />
              <h3>Marseille</h3>
              <p>Plongez dans les eaux turquoises du sud</p>
              <Link to="/search?destination=Marseille" className={styles.destinationLink}>Explorer</Link>
            </div>
            <div className={styles.destinationItem}>
              <img src={bordeauxImage} alt="Bordeaux" className={styles.destinationImage} />
              <h3>Bordeaux</h3>
              <p>Vivez l'énergie des vignobles</p>
              <Link to="/search?destination=Bordeaux" className={styles.destinationLink}>Explorer</Link>
            </div>
            <div className={styles.destinationItem}>
              <img src={lilleImage} alt="Lille" className={styles.destinationImage} />
              <h3>Lille</h3>
              <p>Explorez les charmes du Nord</p>
              <Link to="/search?destination=Lille" className={styles.destinationLink}>Explorer</Link>
            </div>
          </Slider>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2>Ce que disent nos voyageurs</h2>
        <Slider {...testimonialSettings}>
          <div className={styles.testimonialItem}>
            <p className={styles.testimonialText}>
              "Grâce à Rendez-Vous Parfait, notre week-end en amoureux à Paris était magique. Chaque activité correspondait parfaitement à nos goûts !"
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
              "J'ai découvert des endroits incroyables à Bordeaux que je n'aurais jamais trouvés seul. Merci pour cette expérience unique !"
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
        <h2>Inspirations de voyage</h2>
        <div className={styles.blogPosts}>
          <div className={styles.blogPost}>
            <img src="https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog post 1" />
            <h3>10 lieux incontournables à Paris</h3>
            <p>Découvrez les secrets cachés de la Ville Lumière...</p>
            <Link to="/blog/post1" className={styles.readMore}>Lire plus</Link>
          </div>
          <div className={styles.blogPost}>
            <img src="https://images.pexels.com/photos/1573471/pexels-photo-1573471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog post 2" />
            <h3>Les meilleures plages de Marseille</h3>
            <p>Explorez les criques paradisiaques de la côte méditerranéenne...</p>
            <Link to="/blog/post2" className={styles.readMore}>Lire plus</Link>
          </div>
          <div className={styles.blogPost}>
            <img src="https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog post 3" />
            <h3>Guide des vins de Bordeaux</h3>
            <p>Initiez-vous à l'art de la dégustation dans la capitale du vin...</p>
            <Link to="/blog/post3" className={styles.readMore}>Lire plus</Link>
          </div>
        </div>
      </section>

      <section className={styles.partners}>
        <h2>Nos partenaires de confiance</h2>
        <div className={styles.partnerLogos}>
          <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/e/e7/Logo_big_mamma.png/640px-Logo_big_mamma.png" alt="Accor" />
          <img src="https://logos-world.net/wp-content/uploads/2020/03/Ryanair-Logo-700x394.png" alt="Ryanair" />
          <img src="https://e7.pngegg.com/pngimages/248/721/png-clipart-airbnb-rebrand-logo-online-marketplace-rebranding-airbnb-logo-text-service-thumbnail.png" alt="Avis" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/2560px-Booking.com_logo.svg.png" alt="Booking.com" />
        </div>
      </section>

      <section className={styles.newsletter}>
        <h2>Restez informé de nos dernières offres</h2>
        <p>Inscrivez-vous à notre newsletter pour ne rien manquer !</p>
        <form onSubmit={handleSubmit} className={styles.newsletterForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
            required
            className={styles.newsletterInput}
          />
          <button type="submit" className={styles.newsletterButton}>
            S'inscrire
          </button>
        </form>
      </section>

      <div className={styles.floatingCTA}>
        <Link to="/search" className={styles.ctaButton}>
          Planifier mon voyage
        </Link>
      </div>
    </div>
  );
}

export default Home;