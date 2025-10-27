import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/layout/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AddRecord from "@/pages/AddRecord";
import Goals from "@/pages/Goals";
import Tips from "@/pages/Tips";
import Calculator from "@/pages/Calculator";
import Game from "@/pages/Game";
import Profile from "@/pages/Profile";
import Intro from "@/pages/Intro";
import Onboarding from "@/pages/Onboarding";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createPageUrl } from "@/utils";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={createPageUrl("Intro")} replace />}
      />
      <Route path={createPageUrl("Intro")} element={<Intro />} />
      <Route path={createPageUrl("Login")} element={<Login />} />
      <Route
        path={createPageUrl("Onboarding")}
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      {/* Rotas com Layout (sidebar) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path={createPageUrl("Dashboard")} element={<Dashboard />} />
        <Route path={createPageUrl("AddRecord")} element={<AddRecord />} />
        <Route path={createPageUrl("Goals")} element={<Goals />} />
        <Route path={createPageUrl("Tips")} element={<Tips />} />
        <Route path={createPageUrl("Calculator")} element={<Calculator />} />
        <Route path={createPageUrl("Game")} element={<Game />} />
        <Route path={createPageUrl("Profile")} element={<Profile />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={createPageUrl("Intro")} replace />}
      />
    </Routes>
  );
}
