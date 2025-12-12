import { useEffect, useRef } from "react";
import { useSpaceInvaders } from "./useSpaceInvaders";
import { GameEngine } from "./gameEngine";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const { gameState, setPlayerMoving, shoot } = useSpaceInvaders();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas);
    gameEngineRef.current.start();

    // Keyboard controls
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState !== "playing") return;
      switch (event.code) {
        case "ArrowLeft":
        case "KeyA":
          event.preventDefault();
          setPlayerMoving("left");
          break;
        case "ArrowRight":
        case "KeyD":
          event.preventDefault();
          setPlayerMoving("right");
          break;
        case "Space":
          event.preventDefault();
          shoot();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (gameState !== "playing") return;
      switch (event.code) {
        case "ArrowLeft":
        case "KeyA":
        case "ArrowRight":
        case "KeyD":
          event.preventDefault();
          setPlayerMoving(null);
          break;
      }
    };

    // Touch/Click controls
    const handleCanvasClick = (event: MouseEvent | TouchEvent) => {
      if (gameState !== "playing") return;
      event.preventDefault();
      shoot();
    };

    // Resize canvas to match its displayed size
    const resizeCanvas = () => {
      if (canvas) {
        const parent = canvas.parentElement;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          // Set both the canvas width/height attributes and style
          canvas.width = rect.width;
          canvas.height = rect.height;
          canvas.style.width = `${rect.width}px`;
          canvas.style.height = `${rect.height}px`;
          gameEngineRef.current?.resize(rect.width, rect.height);
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("touchstart", handleCanvasClick, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("touchstart", handleCanvasClick);
      window.removeEventListener("resize", resizeCanvas);
      gameEngineRef.current?.stop();
    };
  }, [gameState, setPlayerMoving, shoot]);

  return (
    <div style={{ width: "100%", height: "60vh", position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", background: "black" }}
      />
    </div>
  );
}