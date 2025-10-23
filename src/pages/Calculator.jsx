import { useState } from "react";
import { Leaf, TreeDeciduous, CloudRain } from "lucide-react";

export default function CO2Calculator() {
	const [co2Amount, setCo2Amount] = useState("");
	const [trees, setTrees] = useState(null);
	const [unit, setUnit] = useState("kg");

	// Uma árvore adulta absorve em média 22 kg de CO2 por ano
	const CO2_PER_TREE_YEAR = 22;

	const calculateTrees = () => {
		if (!co2Amount || isNaN(co2Amount) || parseFloat(co2Amount) <= 0) {
			return;
		}

		let co2InKg = parseFloat(co2Amount);

		// Converter para kg se necessário
		if (unit === "ton") {
			co2InKg = co2InKg * 1000;
		} else if (unit === "g") {
			co2InKg = co2InKg / 1000;
		}

		const treesNeeded = Math.ceil(co2InKg / CO2_PER_TREE_YEAR);
		setTrees(treesNeeded);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			calculateTrees();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<div className="flex items-center justify-center mb-6">
						<TreeDeciduous className="text-green-600 mr-3" size={40} />
						<h1 className="text-3xl font-bold text-gray-800">Calculadora de CO₂</h1>
					</div>

					<p className="text-gray-600 text-center mb-8">
						Descubra quantas árvores são necessárias para capturar o CO₂ emitido
					</p>

					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Quantidade de CO₂</label>
							<div className="flex gap-3">
								<input
									type="number"
									step="0.01"
									min="0"
									value={co2Amount}
									onChange={(e) => setCo2Amount(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder="Digite a quantidade"
									className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
								/>
								<select
									value={unit}
									onChange={(e) => setUnit(e.target.value)}
									className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
								>
									<option value="g">gramas (g)</option>
									<option value="kg">quilos (kg)</option>
									<option value="ton">toneladas (t)</option>
								</select>
							</div>
						</div>

						<button
							onClick={calculateTrees}
							className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
						>
							<Leaf size={20} />
							Calcular Árvores Necessárias
						</button>
					</div>

					{trees !== null && (
						<div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
							<div className="flex items-center justify-center mb-4">
								<CloudRain className="text-green-600 mr-2" size={32} />
								<h2 className="text-2xl font-bold text-gray-800">Resultado</h2>
							</div>

							<div className="text-center">
								<div className="mb-4">
									<p className="text-gray-700 mb-2">
										Para capturar{" "}
										<span className="font-bold text-green-700">
											{co2Amount} {unit}
										</span>{" "}
										de CO₂ por ano, você precisa de:
									</p>
									<div className="flex items-center justify-center gap-2 my-4">
										{[...Array(Math.min(trees, 10))].map((_, i) => (
											<TreeDeciduous key={i} className="text-green-600" size={24} />
										))}
										{trees > 10 && <span className="text-2xl text-green-600 font-bold">...</span>}
									</div>
									<p className="text-5xl font-bold text-green-600 my-4">{trees}</p>
									<p className="text-xl text-gray-700">{trees === 1 ? "árvore" : "árvores"}</p>
								</div>

								<div className="mt-6 pt-6 border-t border-green-200">
									<p className="text-sm text-gray-600">
										💡 <span className="font-semibold">Informação:</span> Uma árvore adulta absorve em média 22 kg de
										CO₂ por ano
									</p>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="mt-6 text-center text-sm text-gray-600">
					<p>🌍 Cada árvore plantada faz a diferença para o planeta!</p>
				</div>
			</div>
		</div>
	);
}
