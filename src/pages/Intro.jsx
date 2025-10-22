import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Sparkles } from "lucide-react";
import { base44 } from "@/api/mockClient";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/Button";

const slides = [
  "Nosso planeta está em um ponto de virada.",
  "Cada escolha, por menor que seja, tem impacto.",
  "E se sua casa pudesse regenerar o mundo?",
  "Mudanças reais começam dentro de casa.",
  "Você tem o poder de inspirar sua vizinhança.",
  "Vamos juntos transformar pequenos hábitos em grandes resultados."
];

export default function Intro() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const user = await base44.auth.me();
      if (user.has_seen_intro) {
        navigate(user.onboarding_completed ? createPageUrl("Dashboard") : createPageUrl("Onboarding"));
      }
    };
    checkStatus();
  }, [navigate]);

  useEffect(() => {
    if (step < slides.length) {
      const timer = setTimeout(() => setStep((prev) => prev + 1), 3000);
      return () => clearTimeout(timer);
    }
    const readyTimer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(readyTimer);
  }, [step]);

  const handleStart = async () => {
    setIsSaving(true);
    await base44.auth.updateMe({ has_seen_intro: true });
    navigate(createPageUrl("Onboarding"));
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-3xl font-bold md:text-5xl"
          >
            {slides[step] || "Vamos começar sua jornada."}
          </motion.h1>
        </AnimatePresence>

        {ready && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <Button
              onClick={handleStart}
              disabled={isSaving}
              className="h-16 rounded-full px-12 text-lg font-semibold"
            >
              {isSaving ? (
                "Carregando..."
              ) : (
                <span className="flex items-center gap-3">
                  <Leaf className="h-6 w-6" /> Quero fazer a diferença
                </span>
              )}
            </Button>
          </motion.div>
        )}

        {ready && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p className="flex items-center gap-2 text-emerald-200">
              <Sparkles className="h-4 w-4" /> Clique para iniciar sua jornada sustentável
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
