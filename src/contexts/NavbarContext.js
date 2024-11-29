import React, { createContext, useContext, useState } from 'react';

const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);

  return (
    <NavbarContext.Provider value={{ isNavbarExpanded, setIsNavbarExpanded }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar doit être utilisé dans un NavbarProvider');
  }
  return context;
}; 