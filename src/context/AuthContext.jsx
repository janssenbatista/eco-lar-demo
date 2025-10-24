import { createContext, useContext, useState, useEffect } from "react";
import createBrowserClient from "@/api/client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const AuthContext = createContext();
const supabase = createBrowserClient();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        setCurrentUser(user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [loading]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate(createPageUrl("Login"));
  };

  const value = {
    currentUser,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
