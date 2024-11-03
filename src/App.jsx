import React, { useState } from "react";
import useSound from "use-sound";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GRID_SIZE = 25;

const MemoryGame = () => {
	const [blackSquares, setBlackSquares] = useState([]);
	const [clickedSquares, setClickedSquares] = useState([]);
	const [gameState, setGameState] = useState("waiting"); // 'waiting', 'playing', 'won', 'lost'
	const [showBlackSquares, setShowBlackSquares] = useState(false);
	const [difficulty, setDifficulty] = useState(10); // Initial difficulty level

	const [playCorrect] = useSound("/correct.wav");
	const [playSuccess] = useSound("/success.wav");
	const [playFail] = useSound("/fail.wav");

	const winNotify = () => toast.success("😄 Yaaay! you won");
	const lostNotify = () => toast.error("😔 you lost, try again");

	const startGame = () => {
		const newBlackSquares = generateRandomSquares();
		setBlackSquares(newBlackSquares);
		setClickedSquares([]);
		setGameState("playing");
		setShowBlackSquares(true);

		// Hide black squares after 1 second
		setTimeout(() => {
			setShowBlackSquares(false);
		}, 1000);
	};

	// Function to generate random squares to turn black
	const generateRandomSquares = () => {
		const squares = new Set();
		while (squares.size < difficulty) {
			squares.add(Math.floor(Math.random() * GRID_SIZE));
		}
		return Array.from(squares);
	};

	// Function to handle square clicks
	const handleSquareClick = (index) => {
		if (gameState !== "playing") return;

		if (blackSquares.includes(index)) {
			playCorrect();
			setClickedSquares((prev) => [...prev, index]);
			if (clickedSquares.length + 1 === difficulty) {
				winNotify();
				playSuccess();
				setGameState("won");
			}
		} else {
			lostNotify();
			playFail();
			setGameState("lost");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
			<h1 className="text-4xl font-bold mb-8">Memory Game</h1>

			<div className="grid grid-cols-5 gap-2">
				{Array.from({ length: GRID_SIZE }, (_, index) => (
					<div
						key={index}
						className={`w-12 h-12 border border-gray-600 cursor-pointer transition-all duration-300 ${
							showBlackSquares && blackSquares.includes(index)
								? "bg-slate-300"
								: clickedSquares.includes(index)
								? "bg-green-500"
								: "bg-gray-800"
						}`}
						onClick={() => handleSquareClick(index)}
					></div>
				))}
			</div>
			{gameState != "playing" && (
				<div className="absolute flex flex-col items-center justify-center">
					<button
						onClick={startGame}
						className="mt-8 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-500 transition duration-300"
					>
						Start New Game
					</button>
					<div className="flex items-center mb-4">
						<label htmlFor="difficulty" className="mr-2">
							Difficulty:
						</label>
						<input
							type="range"
							id="difficulty"
							min="1"
							max="20"
							value={difficulty}
							onChange={(e) => setDifficulty(parseInt(e.target.value))}
							className="slider"
						/>
						<span className="ml-2">{difficulty}</span>
					</div>
					<p className="ml-2">
						{difficulty >= 1 && difficulty <= 5 && "Easy 😊"}
						{difficulty >= 6 && difficulty <= 10 && "Normal 🤔"}
						{difficulty >= 11 && difficulty <= 15 && "Serious? 🤨"}
						{difficulty >= 16 && difficulty <= 20 && "IMPOSSIBLE! 😨"}
					</p>
				</div>
			)}
			<ToastContainer position="top-center" draggable={true} theme="dark" />
		</div>
	);
};

export default MemoryGame;
