import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Home.css";
import heroImage from "../assets/selon-une-etude-voici-combien-fois-par-semaine-nous-devrions-voir-nos-amis-pour-etre-heureux.jpeg";
import parisImage from "../assets/toureiffel-intro-shutterstock.jpg";

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

  return (
    <div className="home" style={{ minHeight: "100vh" }}>
      <header
        className="hero"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "var(--vh, 1vh) * 100",
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            La solution sur-mesure pour une expérience inoubliable
          </h1>
          <p className="hero-subtitle">
            Personnalisez vos sorties en fonction de vos goûts et préférences
          </p>
          <Link to="/search" className="cta-button">
            Commencer l'aventure
          </Link>
        </div>
      </header>

      <section className="features">
        <h2>Pourquoi choisir Rendez-Vous Parfait ?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <FontAwesomeIcon
              icon="map-marked-alt"
              size="2x"
              style={{ color: "#ff6b6b" }}
            />
            <h3>Gagnez du temps</h3>
            <p>
              Planifiez votre prochaine sortie en un clin d'œil ! Notre
              application vous recommande des expériences sur mesure, pour
              trouver l'activité, le restaurant ou l'hébergement parfait sans
              perdre de temps.
            </p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon
              icon="piggy-bank"
              size="2x"
              style={{ color: "#ff6b6b" }}
            />
            <h3>Des expériences qui vous ressemblent</h3>
            <p>
              Obtenez des recommandations uniques qui correspondent parfaitement
              à vos goûts et vos envies. Avec des propositions adaptées à vos
              préférences, vivez des expériences qui reflètent véritablement ce
              que vous aimez.
            </p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon
              icon="users"
              size="2x"
              style={{ color: "#ff6b6b" }}
            />
            <h3>Une personnalisation qui s'adapte à tous</h3>
            <p>
              Recevez des recommandations qui tiennent compte des préférences de
              chaque membre du groupe, qu'il s'agisse de vos amis, de votre
              famille, de vos collègues, pour que chaque sortie soit une
              expérience unique et harmonieuse pour tous.
            </p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon
              icon="users"
              size="2x"
              style={{ color: "#ff6b6b" }}
            />
            <h3>Un guichet unique de réservation</h3>
            <p>
              Profitez de notre guichet unique de réservation pour simplifier
              vos démarches. Réservez facilement vos hébergements, activités et
              restaurants en un seul endroit, rendant la planification de vos
              sorties plus fluide et sans tracas.
            </p>
          </div>
        </div>
      </section>

      <section className="popular-destinations">
        <h2>Inspirations pour votre prochaine escapade</h2>
        <div className="destination-list">
          <div className="destination-item">
            <img src={parisImage} alt="Paris" className="destination-image" />
            <h3>Paris</h3>
            <p>
              Découvrez la ville de l'amour avec nos itinéraires spécial couples
            </p>
            <Link to="/search?destination=Paris" className="destination-link">
              Explorer
            </Link>
          </div>
          <div className="destination-item">
            <img
              src="https://www.wonderbox.fr/blog/wp-content/uploads/sites/4/2020/02/Visiter-Marseille-en-10-lieux-marseille-scaled-1-1.jpeg"
              alt="Marseille"
              className="destination-image"
            />
            <h3>Marseille</h3>
            <p>
              Plongez dans les eaux turquoises du sud, et avec nos itinéraires
              uniques
            </p>
            <Link
              to="/search?destination=Marseille"
              className="destination-link"
            >
              Explorer
            </Link>
          </div>
          <div className="destination-item">
            <img
              src="https://www.bordeaux-tourisme.com/sites/bordeaux_tourisme/files/styles/widget_slide/public/medias/widgets/misc/bourse-mobile.jpg.webp?itok=n-Cx_Wiy"
              alt="Bordeaux"
              className="destination-image"
            />
            <h3>Bordeaux</h3>
            <p>
              Vivez l'énergie des vignobles et du vin au coeur de la métropole
              Bordelaise
            </p>
            <Link
              to="/search?destination=Bordeaux"
              className="destination-link"
            >
              Explorer
            </Link>
          </div>
          <div className="destination-item">
            <img
              src="https://lessortiesdunelilloise.fr/wp-content/uploads/2020/07/grand-place-lille-scaled.jpg"
              alt="Lille"
              className="destination-image"
            />
            <h3>Lille</h3>
            <p>Explorez les charmes du Nord avec nos itinéraires spéciaux</p>
            <Link to="/search?destination=Lille" className="destination-link">
              Explorer
            </Link>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>Ce que disent nos voyageurs</h2>
        <div className="testimonial-list">
          <div className="testimonial-item">
            <p className="testimonial-text">
              "Grâce à Rendez-Vous Parfait, notre week-end en amoureux à Paris
              était magique. Chaque activité correspondait parfaitement à nos
              goûts !"
            </p>
            <span className="testimonial-author">
              - Marie et Thomas, 28 ans
            </span>
          </div>
          <div className="testimonial-item">
            <p className="testimonial-text">
              "J'ai découvert des endroits incroyables à Bordeaux que je
              n'aurais jamais trouvés seul. Merci pour cette expérience unique
              !"
            </p>
            <span className="testimonial-author">- Lucas, 35 ans</span>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <h2>Restez informé de nos meilleures offres</h2>
        <p>
          Recevez des inspirations de voyage et des offres exclusives
          directement dans votre boîte mail
        </p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="newsletter-input"
          />
          <button type="submit" className="newsletter-button">
            S'inscrire
          </button>
        </form>
      </section>
    </div>
  );
}

export default Home;
