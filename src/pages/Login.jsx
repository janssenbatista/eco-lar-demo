import createBrowserClient from "@/api/createClient";
import { createPageUrl } from "@/utils";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const supabase = createBrowserClient();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const verifyCredentials = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        navigate(createPageUrl("Dashboard"));
      }
    };

    verifyCredentials();
  });

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (!error) {
      navigate(createPageUrl("Dashboard"));
    }

    setErrorMessage("Credenciais inválidas!");
  };

  return (
    <div>
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          min={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>
          Entrar
        </button>
      </form>
      {errorMessage && <span className="text-red-500">{errorMessage}</span>}
      <Link to={""}>
        Não possui uma conta? <span className="font-medium">Cadastre-se</span>
      </Link>
    </div>
  );
}
