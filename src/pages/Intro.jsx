import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { createPageUrl } from "@/utils";

// LocalStorage key para rastrear se a animação foi assistida
const INTRO_WATCHED_KEY = "ecolar_intro_watched";

const slides = [
	"Nosso planeta está em um ponto de virada.",
	"Cada escolha, por menor que seja, tem impacto.",
	"E se sua casa pudesse regenerar o mundo?",
	"Mudanças reais começam dentro de casa.",
	"Você tem o poder de inspirar sua vizinhança.",
	"Vamos juntos transformar pequenos hábitos em grandes resultados.",
];

export default function Intro() {
	const navigate = useNavigate();
	const videoRef = useRef(null);
	const [showHint, setShowHint] = useState(false);
	const [step, setStep] = useState(0);

	// Check se a intro já foi assistida - se sim, vai direto para login
	// Se houver cadastro salvo no localStorage, vai direto para Dashboard
	useEffect(() => {
		const introWatched = localStorage.getItem(INTRO_WATCHED_KEY);

		// Verifica se existe cadastro salvo no localStorage (dados da API)
		const savedData = localStorage.getItem("eco-lar-demo-db");
		if (savedData) {
			try {
				const db = JSON.parse(savedData);
				// Se o usuário já tem onboarding completo, vai direto para Dashboard
				if (db.user && db.user.onboarding_completed) {
					navigate(createPageUrl("Dashboard"));
					return;
				}
			} catch (e) {
				console.error("Erro ao parsear localStorage:", e);
			}
		}

		// Se a intro já foi assistida, vai para Login
		if (introWatched === "true") {
			navigate(createPageUrl("Login"));
		}
	}, [navigate]);

	// Handle quando o video termina
	const handleVideoEnd = () => {
		// Não fazer nada - deixar as frases continuarem
	};

	// Handle click no video
	const handleVideoClick = () => {
		localStorage.setItem(INTRO_WATCHED_KEY, "true");
		navigate(createPageUrl("Login"));
	};

	// Show hint após 5 segundos de video
	useEffect(() => {
		const hintTimer = setTimeout(() => setShowHint(true), 5000);
		return () => clearTimeout(hintTimer);
	}, []);

	// Auto-avançar as frases a cada 3 segundos
	useEffect(() => {
		if (step < slides.length) {
			const timer = setTimeout(() => setStep((prev) => prev + 1), 3000);
			return () => clearTimeout(timer);
		} else if (step === slides.length) {
			// Quando todas as frases passaram, mostra "Vamos começar sua jornada" por mais tempo
			const timer = setTimeout(() => {
				localStorage.setItem(INTRO_WATCHED_KEY, "true");
				navigate(createPageUrl("Login"));
			}, 4000); // Aguarda 4s antes de navegar (tempo suficiente para ver a frase final)
			return () => clearTimeout(timer);
		}
	}, [step, navigate]);

	return (
		<div
			className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black text-white cursor-pointer"
			onClick={handleVideoClick}
		>
			{/* Video de fundo */}
			<video
				ref={videoRef}
				onEnded={handleVideoEnd}
				className="absolute inset-0 h-full w-full object-cover"
				autoPlay
				muted
				loop
				playsInline
			>
				<source src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4" type="video/mp4" />
			</video>

			<div className="absolute inset-0 bg-black/30 pointer-events-none" />

			{/* Frases do slide */}
			<div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center pointer-events-none">
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
			</div>

			{/* Hint para clicar */}
			{showHint && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-3 px-4 text-center pointer-events-none"
				>
					<p className="flex items-center gap-2 text-emerald-200 text-lg">
						<Sparkles className="h-5 w-5 animate-pulse" /> Clique em qualquer lugar para continuar
					</p>
				</motion.div>
			)}
		</div>
	);
}
