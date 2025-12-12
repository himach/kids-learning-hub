import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "ready" | "playing" | "gameOver" | "victory";
export type PlayerMovement = "left" | "right" | null;

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: number; // 1 for player bullets (up), -1 for enemy bullets (down)
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: number; // 0, 1, 2 for different enemy types
  points: number;
}

export interface BonusShip {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  points: number;
  direction: number; // 1 for right, -1 for left
}

interface SpaceInvadersState {
  gameState: GameState;
  score: number;
  lives: number;
  level: number;
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  bonusShip: BonusShip | null;
  lastBonusShip: number;
  bonusShipInterval: number;
  playerMovement: PlayerMovement;
  lastShot: number;
  shootCooldown: number;
  enemyDirection: number; // 1 for right, -1 for left
  enemyDropDistance: number;
  enemySpeed: number;
  
  // Actions
  start: () => void;
  restart: () => void;
  setGameState: (state: GameState) => void;
  setPlayerMoving: (direction: PlayerMovement) => void;
  shoot: () => void;
  updatePlayer: (deltaTime: number) => void;
  updateBullets: (deltaTime: number) => void;
  updateEnemies: (deltaTime: number) => void;
  updateBonusShip: (deltaTime: number) => void;
  spawnBonusShip: () => void;
  checkCollisions: () => void;
  addScore: (points: number) => void;
  loseLife: () => void;
  spawnEnemies: () => void;
  nextLevel: () => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const createInitialPlayer = (): Player => ({
  x: CANVAS_WIDTH / 2 - 25,
  y: CANVAS_HEIGHT - 60,
  width: 50,
  height: 30,
  speed: 300,
});

const createEnemyGrid = (level: number): Enemy[] => {
  const enemies: Enemy[] = [];
  const rows = Math.min(5, 3 + Math.floor(level / 3));
  const cols = Math.min(11, 8 + Math.floor(level / 2));
  const enemyWidth = 40;
  const enemyHeight = 30;
  const spacing = 50;
  const startX = (CANVAS_WIDTH - (cols * spacing)) / 2;
  const startY = 80;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const enemyType = row < 1 ? 2 : row < 3 ? 1 : 0; // Top rows are worth more
      const points = enemyType === 2 ? 30 : enemyType === 1 ? 20 : 10;
      
      enemies.push({
        id: `enemy-${row}-${col}`,
        x: startX + col * spacing,
        y: startY + row * spacing,
        width: enemyWidth,
        height: enemyHeight,
        type: enemyType,
        points,
      });
    }
  }

  return enemies;
};

export const useSpaceInvaders = create<SpaceInvadersState>()(
  subscribeWithSelector((set, get) => ({
    gameState: "ready",
    score: 0,
    lives: 5,
    level: 1,
    player: createInitialPlayer(),
    bullets: [],
    enemies: [],
    bonusShip: null,
    lastBonusShip: 0,
    bonusShipInterval: 15000, // 15 seconds
    playerMovement: null,
    lastShot: 0,
    shootCooldown: 250, // milliseconds
    enemyDirection: 1,
    enemyDropDistance: 20,
    enemySpeed: 30,

    start: () => {
      set((state) => ({
        gameState: "playing",
        score: 0,
        lives: 5,
        level: 1,
        player: createInitialPlayer(),
        bullets: [],
        enemies: createEnemyGrid(1),
        bonusShip: null,
        lastBonusShip: Date.now(),
        playerMovement: null,
        lastShot: 0,
        enemyDirection: 1,
        enemySpeed: 30,
      }));
    },

    restart: () => {
      get().start();
    },

    setGameState: (gameState) => set({ gameState }),

    setPlayerMoving: (direction) => {
      console.log("Player moving:", direction);
      set({ playerMovement: direction });
    },

    shoot: () => {
      const now = Date.now();
      const { lastShot, shootCooldown, player, bullets, gameState } = get();
      
      if (gameState !== "playing" || now - lastShot < shootCooldown) return;

      const newBullet: Bullet = {
        id: `bullet-${now}`,
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 500,
        direction: 1, // Player bullets go up
      };

      console.log("Shooting bullet:", newBullet);
      
      set({
        bullets: [...bullets, newBullet],
        lastShot: now,
      });
    },

    updatePlayer: (deltaTime) => {
      const { player, playerMovement } = get();
      if (!playerMovement) return;

      const newX = playerMovement === "left" 
        ? Math.max(0, player.x - player.speed * deltaTime)
        : Math.min(CANVAS_WIDTH - player.width, player.x + player.speed * deltaTime);

      set({
        player: { ...player, x: newX }
      });
    },

    updateBullets: (deltaTime) => {
      const { bullets } = get();
      
      const updatedBullets = bullets
        .map(bullet => ({
          ...bullet,
          y: bullet.y - bullet.speed * bullet.direction * deltaTime
        }))
        .filter(bullet => bullet.y > -bullet.height && bullet.y < CANVAS_HEIGHT + bullet.height);

      set({ bullets: updatedBullets });
    },

    updateEnemies: (deltaTime) => {
      const { enemies, enemyDirection, enemySpeed } = get();
      if (enemies.length === 0) return;

      // Move enemies horizontally
      let newEnemies = enemies.map(enemy => ({
        ...enemy,
        x: enemy.x + enemySpeed * enemyDirection * deltaTime
      }));

      // Check if any enemy hit the edge
      const leftmostEnemy = newEnemies.reduce((min, enemy) => enemy.x < min.x ? enemy : min);
      const rightmostEnemy = newEnemies.reduce((max, enemy) => enemy.x > max.x ? enemy : max);

      let newDirection = enemyDirection;
      
      if (rightmostEnemy.x + rightmostEnemy.width >= CANVAS_WIDTH || leftmostEnemy.x <= 0) {
        // Reverse direction and drop down
        newDirection = -enemyDirection;
        newEnemies = newEnemies.map(enemy => ({
          ...enemy,
          y: enemy.y + get().enemyDropDistance
        }));

        // Check if enemies reached the bottom
        const lowestEnemy = newEnemies.reduce((max, enemy) => enemy.y > max.y ? enemy : max);
        if (lowestEnemy.y + lowestEnemy.height >= get().player.y) {
          set({ gameState: "gameOver" });
          return;
        }
      }

      set({
        enemies: newEnemies,
        enemyDirection: newDirection
      });
    },

    checkCollisions: () => {
      const { bullets, enemies, bonusShip, player, lives } = get();
      let newBullets = [...bullets];
      let newEnemies = [...enemies];
      let newBonusShip = bonusShip;
      let scoreToAdd = 0;
      let hitDetected = false;

      // Check bullet-enemy collisions
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        if (bullet.direction !== 1) continue; // Only check player bullets

        // Check bonus ship collision first
        if (newBonusShip) {
          if (bullet.x < newBonusShip.x + newBonusShip.width &&
              bullet.x + bullet.width > newBonusShip.x &&
              bullet.y < newBonusShip.y + newBonusShip.height &&
              bullet.y + bullet.height > newBonusShip.y) {
            
            console.log("Bonus ship hit! +" + newBonusShip.points + " points");
            newBullets.splice(i, 1);
            scoreToAdd += newBonusShip.points;
            newBonusShip = null;
            hitDetected = true;
            
            // Play success sound for bonus ship
            import("./useAudio").then(({ useAudio }) => {
              useAudio.getState().playSuccess();
            });
            continue;
          }
        }

        // Check regular enemy collisions
        for (let j = enemies.length - 1; j >= 0; j--) {
          const enemy = enemies[j];
          
          if (bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y) {
            
            // Collision detected
            console.log("Enemy hit:", enemy.id);
            newBullets.splice(i, 1);
            newEnemies.splice(j, 1);
            scoreToAdd += enemy.points;
            hitDetected = true;
            break;
          }
        }
      }

      // Play hit sound if regular enemies were hit
      if (hitDetected && newBonusShip === bonusShip) {
        import("./useAudio").then(({ useAudio }) => {
          useAudio.getState().playHit();
        });
      }

      // Check if all enemies destroyed
      if (newEnemies.length === 0) {
        import("./useAudio").then(({ useAudio }) => {
          useAudio.getState().playSuccess();
        });
        get().nextLevel();
        return;
      }

      set({
        bullets: newBullets,
        enemies: newEnemies,
        bonusShip: newBonusShip,
        score: get().score + scoreToAdd
      });
    },

    addScore: (points) => {
      set(state => ({ score: state.score + points }));
    },

    loseLife: () => {
      const newLives = get().lives - 1;
      if (newLives <= 0) {
        set({ gameState: "gameOver", lives: 0 });
      } else {
        set({ lives: newLives });
      }
    },

    spawnEnemies: () => {
      const { level } = get();
      set({ enemies: createEnemyGrid(level) });
    },

    nextLevel: () => {
      const newLevel = get().level + 1;
      set({
        level: newLevel,
        enemies: createEnemyGrid(newLevel),
        enemySpeed: Math.min(100, 30 + newLevel * 5), // Increase enemy speed each level
        shootCooldown: Math.max(150, 250 - newLevel * 10) // Decrease shoot cooldown
      });
    },

    spawnBonusShip: () => {
      const now = Date.now();
      const { lastBonusShip, bonusShipInterval, bonusShip } = get();
      
      if (bonusShip || now - lastBonusShip < bonusShipInterval) return;

      const direction = Math.random() > 0.5 ? 1 : -1;
      const startX = direction === 1 ? -80 : CANVAS_WIDTH + 80;
      
      const newBonusShip: BonusShip = {
        id: `bonus-${now}`,
        x: startX,
        y: 40,
        width: 60,
        height: 25,
        speed: 150,
        points: 500,
        direction: direction
      };

      console.log("Bonus ship spawned!");
      
      set({
        bonusShip: newBonusShip,
        lastBonusShip: now
      });
    },

    updateBonusShip: (deltaTime) => {
      const { bonusShip } = get();
      if (!bonusShip) return;

      const newX = bonusShip.x + bonusShip.speed * bonusShip.direction * deltaTime;
      
      // Remove bonus ship if it goes off screen
      if (newX < -100 || newX > CANVAS_WIDTH + 100) {
        set({ bonusShip: null });
        return;
      }

      set({
        bonusShip: { ...bonusShip, x: newX }
      });
    }
  }))
);
