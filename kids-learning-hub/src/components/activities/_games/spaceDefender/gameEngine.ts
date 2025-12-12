import { useSpaceInvaders } from "./useSpaceInvaders";

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private lastTime = 0;
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D context");
    this.ctx = ctx;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private gameLoop = (currentTime: number) => {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    const gameState = useSpaceInvaders.getState();
    
    if (gameState.gameState === "playing") {
      gameState.updatePlayer(deltaTime);
      gameState.updateBullets(deltaTime);
      gameState.updateEnemies(deltaTime);
      gameState.updateBonusShip(deltaTime);
      
      // Try to spawn bonus ship
      gameState.spawnBonusShip();
      
      gameState.checkCollisions();
    }
  }

  private render() {
    const { gameState, player, bullets, enemies, bonusShip, score, lives } = useSpaceInvaders.getState();
    
    // Clear canvas
    this.ctx.fillStyle = "#000011";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (gameState !== "playing") return;

    // Draw stars background
    this.drawStars();

    // Draw bonus ship (behind everything else)
    if (bonusShip) {
      this.drawBonusShip(bonusShip);
    }

    // Draw player
    this.drawPlayer(player);

    // Draw bullets
    bullets.forEach(bullet => this.drawBullet(bullet));

    // Draw enemies
    enemies.forEach(enemy => this.drawEnemy(enemy));
  }

  private drawStars() {
    this.ctx.fillStyle = "#ffffff";
    // Simple static stars pattern
    for (let i = 0; i < 50; i++) {
      const x = (i * 137) % this.canvas.width;
      const y = (i * 211) % this.canvas.height;
      this.ctx.fillRect(x, y, 1, 1);
    }
  }

  private drawPlayer(player: any) {
    // Draw player as a triangle
    this.ctx.fillStyle = "#00ff00";
    this.ctx.beginPath();
    this.ctx.moveTo(player.x + player.width / 2, player.y);
    this.ctx.lineTo(player.x, player.y + player.height);
    this.ctx.lineTo(player.x + player.width, player.y + player.height);
    this.ctx.closePath();
    this.ctx.fill();

    // Add some detail
    this.ctx.fillStyle = "#00aa00";
    this.ctx.fillRect(player.x + player.width / 2 - 3, player.y + 5, 6, 10);
  }

  private drawBullet(bullet: any) {
    this.ctx.fillStyle = bullet.direction === 1 ? "#ffff00" : "#ff0000";
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    
    // Add glow effect
    this.ctx.shadowColor = bullet.direction === 1 ? "#ffff00" : "#ff0000";
    this.ctx.shadowBlur = 5;
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    this.ctx.shadowBlur = 0;
  }

  private drawEnemy(enemy: any) {
    // Different colors for different enemy types
    const colors = ["#ff0000", "#ff8800", "#ffff00"];
    this.ctx.fillStyle = colors[enemy.type] || "#ff0000";
    
    // Draw enemy as a rectangle with some details
    this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Add enemy details based on type
    this.ctx.fillStyle = "#ffffff";
    if (enemy.type === 0) {
      // Basic enemy - simple rectangle
      this.ctx.fillRect(enemy.x + 5, enemy.y + 5, 30, 20);
    } else if (enemy.type === 1) {
      // Medium enemy - with dots
      this.ctx.fillRect(enemy.x + 10, enemy.y + 8, 6, 6);
      this.ctx.fillRect(enemy.x + 24, enemy.y + 8, 6, 6);
    } else {
      // High value enemy - with cross pattern
      this.ctx.fillRect(enemy.x + 18, enemy.y + 5, 4, 20);
      this.ctx.fillRect(enemy.x + 10, enemy.y + 13, 20, 4);
    }
  }

  private drawBonusShip(bonusShip: any) {
    // Draw bonus ship with special styling
    this.ctx.fillStyle = "#ff00ff";
    this.ctx.fillRect(bonusShip.x, bonusShip.y, bonusShip.width, bonusShip.height);
    
    // Add glow effect
    this.ctx.shadowColor = "#ff00ff";
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(bonusShip.x, bonusShip.y, bonusShip.width, bonusShip.height);
    this.ctx.shadowBlur = 0;
    
    // Add distinctive details
    this.ctx.fillStyle = "#ffffff";
    // Draw a UFO-like shape
    this.ctx.fillRect(bonusShip.x + 10, bonusShip.y + 8, 40, 9);
    this.ctx.fillRect(bonusShip.x + 20, bonusShip.y + 3, 20, 19);
    
    // Add small lights
    this.ctx.fillStyle = "#00ffff";
    for (let i = 0; i < 4; i++) {
      this.ctx.fillRect(bonusShip.x + 12 + i * 9, bonusShip.y + 18, 3, 3);
    }
  }
}
