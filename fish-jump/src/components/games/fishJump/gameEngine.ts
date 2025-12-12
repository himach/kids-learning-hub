import { useFishJump, Fish, Obstacle } from './useFishJump';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private lastTime = 0;
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private gameLoop = (currentTime: number) => {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000; // in seconds
    this.lastTime = currentTime;

    useFishJump.getState().update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private render() {
    const { fish, obstacles, gameState } = useFishJump.getState();

    this.ctx.fillStyle = '#70c5ce';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (gameState !== 'playing' && gameState !== 'gameOver') return;

    obstacles.forEach(obstacle => this.drawObstacle(obstacle));
    this.drawFish(fish);
  }

  private drawFish(fish: Fish) {
    this.ctx.fillStyle = 'orange';
    this.ctx.beginPath();
    this.ctx.ellipse(fish.x + fish.width / 2, fish.y + fish.height / 2, fish.width / 2, fish.height / 2, 0, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(fish.x + fish.width * 0.7, fish.y + fish.height * 0.4, 5, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(fish.x + fish.width * 0.72, fish.y + fish.height * 0.4, 2, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  private drawObstacle(obstacle: Obstacle) {
    this.ctx.fillStyle = '#008000';
    this.ctx.fillRect(obstacle.top.x, obstacle.top.y, obstacle.top.width, obstacle.top.height);
    this.ctx.fillRect(obstacle.bottom.x, obstacle.bottom.y, obstacle.bottom.width, obstacle.bottom.height);
  }
}