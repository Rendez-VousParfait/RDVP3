import React from "react";
import Swiper from "../components/Swiper";
import styles from "./SwiperPage.module.css";

const SwiperPage = ({ formData, handleInputChange, nextStep }) => {
  return (
    <div className={styles.swiperPage}>
      <h1>Découvrez Bordeaux</h1>
      <Swiper
        formData={formData}
        handleInputChange={handleInputChange}
        nextStep={nextStep}
      />
    </div>
  );
};

export default SwiperPage;