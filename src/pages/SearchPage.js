// src/pages/SearchPage.js
import React from 'react';
import SearchForm from '../components/SearchForm';
import styles from './SearchPage.module.css';

const SearchPage = () => {
  return (
    <div className={styles.searchPage}>
      <h1 className={styles.title}>Trouvez votre expérience parfaite</h1>
      <SearchForm />
    </div>
  );
};

export default SearchPage;