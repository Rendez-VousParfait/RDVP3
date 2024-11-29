import React from 'react';
import { motion } from 'framer-motion';
import styles from '../pages/Dashboard.module.css';

const VersusSection = ({ versusPair, onChoice, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.versusContainer}
    >
      <div className={styles.versusCards}>
        <div 
          className={styles["versus-card"]} 
          onClick={() => onChoice(0)}
          data-index="0"
        >
          {renderVersusCard(versusPair[0])}
        </div>
        <div className={styles.versusDivider}>VS</div>
        <div 
          className={styles["versus-card"]} 
          onClick={() => onChoice(1)}
          data-index="1"
        >
          {renderVersusCard(versusPair[1])}
        </div>
      </div>
      <Button onClick={onBack} startIcon={<ArrowBack />}>
        Retour au questionnaire
      </Button>
    </motion.div>
  );
};

export default VersusSection; 