import { AnimatePresence, useLocation } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import { useLocation as useLocationHook } from 'react-router-dom';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ... vos routes existantes ... */}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;