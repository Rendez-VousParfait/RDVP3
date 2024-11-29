/* eslint-disable quotes */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaHeart, FaUser, FaHistory } from 'react-icons/fa';
import { IoMenuOutline } from 'react-icons/io5';
import styles from './Swiper.module.css';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: <FaHome />, text: 'Accueil', path: '/' },
    { icon: <FaSearch />, text: 'Recherche', path: '/search' },
    { icon: <FaHeart />, text: 'Favoris', path: '/catalog' },
    { icon: <FaHistory />, text: 'Historique', path: '/history' },
    { icon: <FaUser />, text: 'Profil', path: '/profile' },
  ];

  return (
    <>
      <div className={styles['burger-menu']} onClick={toggleMenu}>
        <IoMenuOutline className={styles['burger-icon']} />
      </div>
      <div className={`${styles['menu-overlay']} ${isOpen ? styles.active : ''}`}>
        <div className={styles['menu-items']}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={styles['menu-item']}
              onClick={() => setIsOpen(false)}
            >
              <span className={styles['menu-item-icon']}>{item.icon}</span>
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BurgerMenu; 