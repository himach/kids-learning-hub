import GameCanvas from './GameCanvas';
import { useFishJump } from './useFishJump';

export default function FishJump() {
  const { gameState, score, lives, restart, start } = useFishJump();

  return (
    <div className="relative w-full h-screen bg-gray-800 overflow-hidden font-sans">
      <GameCanvas />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none text-white">
        {/* In-Game HUD */}
        {gameState === 'playing' && (
          <div className="flex justify-between items-center p-4">
            <div className="text-2xl font-bold">Score: {score}</div>
            <div className="text-2xl font-bold">Lives: {lives}</div>
          </div>
        )}

        {/* Ready Screen */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center pointer-events-auto">
            <h1 className="text-6xl font-bold mb-4 text-cyan-400">Fish Jump</h1>
            <p className="text-xl mb-8">Use ↑ and ↓ arrow keys to move.</p>
            <button
              onClick={start}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center pointer-events-auto">
            <h1 className="text-6xl font-bold mb-4 text-red-500">Game Over</h1>
            <p className="text-2xl mb-8">Final Score: {score}</p>
            <button
              onClick={restart}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}