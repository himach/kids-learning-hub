import { useEffect, useRef } from 'react';
import { useFishJump } from './useFishJump';
import { GameEngine } from './gameEngine';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const { init, setMoving } = useFishJump();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    init(rect.width, rect.height);
    canvas.width = rect.width;
    canvas.height = rect.height;

    gameEngineRef.current = new GameEngine(canvas);
    gameEngineRef.current.start();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (useFishJump.getState().gameState !== 'playing') return;
      if (event.code === 'ArrowUp') {
        event.preventDefault();
        setMoving('up');
      } else if (event.code === 'ArrowDown') {
        event.preventDefault();
        setMoving('down');
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (useFishJump.getState().gameState !== 'playing') return;
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        event.preventDefault();
        setMoving(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gameEngineRef.current?.stop();
    };
  }, [init, setMoving]);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
}