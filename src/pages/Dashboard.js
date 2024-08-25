import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faBlog, faCog } from '@fortawesome/free-solid-svg-icons';
import styles from './Dashboard.module.css';

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h1>Tableau de bord</h1>
      <div className={styles.quickLinks}>
        <Link to="/search" className={styles.quickLink}>
          <FontAwesomeIcon icon={faSearch} />
          <span>Rechercher</span>
        </Link>
        <Link to="/profile" className={styles.quickLink}>
          <FontAwesomeIcon icon={faUser} />
          <span>Profil</span>
        </Link>
        <Link to="/blog" className={styles.quickLink}>
          <FontAwesomeIcon icon={faBlog} />
          <span>Blog</span>
        </Link>
        <Link to="/parametres" className={styles.quickLink}>
          <FontAwesomeIcon icon={faCog} />
          <span>Paramètres</span>
        </Link>
      </div>
      <div className={styles.recentActivity}>
        <h2>Activité récente</h2>
        {/* Ici, vous pouvez ajouter une liste d'activités récentes */}
        <p>Aucune activité récente à afficher.</p>
      </div>
    </div>
  );
}

export default Dashboard;