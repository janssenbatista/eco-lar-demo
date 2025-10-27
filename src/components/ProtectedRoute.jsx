import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { createPageUrl } from "@/utils";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600 mx-auto" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={createPageUrl("Login")} replace />;
  }

  return children;
}
