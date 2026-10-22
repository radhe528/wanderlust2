import { createContext, useContext, useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {
    try {
      const res = await fetch(`${backendUrl}/auth/me`,
        { credentials: "include" }
      );

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
         setUser(data.user);

     } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
return useContext(AuthContext);
}