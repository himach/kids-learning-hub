import { useEffect } from "react";
import GameCanvas from "./GameCanvas";
import { useSpaceInvaders } from "./useSpaceInvaders";
import { useAudio } from "./useAudio";

export default function SpaceInvaders() {
  const { gameState, score, lives, restart } = useSpaceInvaders();
  const { setHitSound, setSuccessSound, toggleMute, isMuted } = useAudio();

  // Initialize audio
  useEffect(() => {
    const hitAudio = new Audio("/sounds/hit.mp3");
    const successAudio = new Audio("/sounds/success.mp3");
    
    hitAudio.preload = "auto";
    successAudio.preload = "auto";
    hitAudio.volume = 0.3;
    successAudio.volume = 0.5;
    
    setHitSound(hitAudio);
    setSuccessSound(successAudio);
  }, [setHitSound, setSuccessSound]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Game Canvas */}
      <GameCanvas />
      
      {/* Game UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Top HUD */}
        <div className="flex justify-between items-center p-4 text-white font-mono">
          <div className="text-xl">Score: {score.toLocaleString()}</div>
          <div className="text-xl">Lives: {lives}</div>
        </div>

        {/* Audio Control */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-16 text-white text-2xl pointer-events-auto bg-black bg-opacity-50 p-2 rounded hover:bg-opacity-75 transition-all"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        {/* Game Over Screen */}
        {gameState === "gameOver" && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white pointer-events-auto">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4 text-red-500">GAME OVER</h1>
              <p className="text-2xl mb-2">Final Score: {score.toLocaleString()}</p>
              <button
                onClick={restart}
                className="mt-8 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {gameState === "victory" && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white pointer-events-auto">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4 text-yellow-500">VICTORY!</h1>
              <p className="text-2xl mb-2">All invaders destroyed!</p>
              <p className="text-xl mb-8">Final Score: {score.toLocaleString()}</p>
              <button
                onClick={restart}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {gameState === "ready" && (
          <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white pointer-events-auto">
            <div className="text-center">
              <h1 className="text-8xl font-bold mb-8 text-green-500">SPACE INVADERS</h1>
              <div className="text-xl mb-8 space-y-2">
                <p>Use ← → arrows or A/D to move</p>
                <p>Press SPACEBAR to shoot</p>
                <p>Click/Touch to shoot on mobile</p>
              </div>
              <button
                onClick={() => useSpaceInvaders.getState().start()}
                className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white text-2xl font-bold rounded transition-colors"
              >
                START GAME
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch Controls for Mobile */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 pointer-events-auto md:hidden">
        <button
          onTouchStart={() => useSpaceInvaders.getState().setPlayerMoving("left")}
          onTouchEnd={() => useSpaceInvaders.getState().setPlayerMoving(null)}
          className="w-16 h-16 bg-blue-600 bg-opacity-70 text-white text-2xl rounded-full flex items-center justify-center active:bg-opacity-90"
        >
          ←
        </button>
        <button
          onTouchStart={() => useSpaceInvaders.getState().shoot()}
          className="w-20 h-20 bg-red-600 bg-opacity-70 text-white text-xl rounded-full flex items-center justify-center active:bg-opacity-90"
        >
          FIRE
        </button>
        <button
          onTouchStart={() => useSpaceInvaders.getState().setPlayerMoving("right")}
          onTouchEnd={() => useSpaceInvaders.getState().setPlayerMoving(null)}
          className="w-16 h-16 bg-blue-600 bg-opacity-70 text-white text-2xl rounded-full flex items-center justify-center active:bg-opacity-90"
        >
          →
        </button>
      </div>
    </div>
  );
}
