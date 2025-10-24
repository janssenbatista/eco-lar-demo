import { createContext, useContext, useState, useEffect } from "react";
import createBrowserClient from "@/api/client";

// 1. Criar o Contexto
// Este é o objeto que será compartilhado
const AuthContext = createContext();
const supabase = createBrowserClient();

// 2. Criar o Provedor (AuthProvider)
// Este é o componente que "envolve" sua aplicação e fornece os dados
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Tenta pegar a sessão inicial (se o usuário já estava logado)

    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        console.log(user);

        setCurrentUser(user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [loading]); // Adicionado loading como dependência para garantir

  // Os valores que o provedor vai fornecer para os "filhos"
  const value = {
    currentUser,
    loading,
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
