import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, ArrowRight } from "lucide-react";
import { base44 } from "@/api/mockClient";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // "login" ou "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.has_seen_intro) {
          navigate(user.onboarding_completed ? createPageUrl("Dashboard") : createPageUrl("Onboarding"));
        } else {
          setCheckingAuth(false);
        }
      } catch (e) {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // Verificar se email existe quando muda
  const handleEmailChange = (value) => {
    setEmail(value);
    setError("");
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setError("");
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Por favor, insira um email válido");
      return;
    }

    if (!password.trim()) {
      setError("Por favor, insira uma senha");
      return;
    }

    // Validações específicas para cadastro
    if (activeTab === "signup") {
      if (!confirmPassword.trim()) {
        setError("Por favor, confirme sua senha");
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não correspondem");
        return;
      }

      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres");
        return;
      }
    }

    setIsLoading(true);
    try {
      const user = await base44.auth.login(email.trim(), password);
      if (user) {
        navigate(user.onboarding_completed ? createPageUrl("Dashboard") : createPageUrl("Onboarding"));
      } else {
        setError("Email ou senha inválidos. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 py-8">
      {/* Background video overlay */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-10"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-0 bg-white/95 backdrop-blur shadow-2xl">
          <div className="flex flex-col items-center gap-6 p-8">
            {/* Logo */}
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-4"
            >
              <Leaf className="h-10 w-10 text-white" />
            </motion.div>

            {/* Title */}
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">EcoLar</h1>
              <p className="text-center text-sm text-gray-600">
                Transforme sua casa em um símbolo de sustentabilidade
              </p>
            </div>

            {/* Tabs */}
            <div className="w-full flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setError("");
                }}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  activeTab === "login"
                    ? "bg-white text-emerald-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setError("");
                }}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  activeTab === "signup"
                    ? "bg-white text-teal-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cadastro
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* Form Title */}
              <div className="text-center pb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {activeTab === "login" ? "Bem-vindo de volta!" : "Comece sua jornada"}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeTab === "login" 
                    ? "Faça login para continuar"
                    : "Crie uma nova conta para começar"}
                </p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-200 bg-gray-50 pl-10 placeholder-gray-400 focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-200 bg-gray-50 pl-10 placeholder-gray-400 focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Confirm Password Field - Only for Signup */}
              {activeTab === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      disabled={isLoading}
                      className={`border-gray-200 bg-gray-50 pl-10 placeholder-gray-400 focus:border-emerald-500 focus:bg-white ${
                        password && confirmPassword && password !== confirmPassword
                          ? "border-red-500 bg-red-50"
                          : ""
                      }`}
                    />
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-600 font-medium">As senhas não correspondem</p>
                  )}
                  {password && confirmPassword && password === confirmPassword && password.length >= 6 && (
                    <p className="text-xs text-green-600 font-medium">✓ Senhas correspondem</p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  isLoading || 
                  !email.trim() || 
                  !password.trim() ||
                  (activeTab === "signup" && (!confirmPassword.trim() || password !== confirmPassword))
                }
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-semibold text-white hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {activeTab === "login" ? "Entrando..." : "Criando conta..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {activeTab === "login" ? "Entrar" : "Criar Conta"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
