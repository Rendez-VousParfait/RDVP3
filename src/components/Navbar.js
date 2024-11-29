import { Link } from 'react-router-dom';

const Navbar = () => {
  // ... code existant ...

  return (
    <AppBar position="static">
      <Toolbar>
        {/* ... autres éléments de la barre de navigation ... */}
        
        {/* Ajoutez ce lien pour le tableau de bord B2B */}
        <Button color="inherit" component={Link} to="/b2b-dashboard">
          Tableau de bord B2B
        </Button>
        
        {/* ... autres éléments de la barre de navigation ... */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;