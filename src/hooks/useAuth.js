import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      if (authContext && authContext.setUser) {
        authContext.setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [authContext]);

  return { user, isLoading };
};