import { create } from 'zustand';

// --- Game Constants ---
const FISH_WIDTH = 50;
const FISH_HEIGHT = 30;
const FISH_SPEED = 300; // pixels per second
const OBSTACLE_WIDTH = 80;
const OBSTACLE_GAP = 200; // Vertical gap between obstacles
const OBSTACLE_SPEED = 200; // pixels per second

// --- Types ---
export type GameState = 'ready' | 'playing' | 'gameOver';

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Fish extends GameObject {}

export interface Obstacle {
  top: GameObject;
  bottom: GameObject;
}

interface FishJumpState {
  gameState: GameState;
  score: number;
  lives: number;
  fish: Fish;
  moving: 'up' | 'down' | null;
  obstacles: Obstacle[];
  canvasWidth: number;
  canvasHeight: number;

  // Actions
  init: (width: number, height: number) => void;
  start: () => void;
  restart: () => void;
  setMoving: (direction: 'up' | 'down' | null) => void;
  update: (deltaTime: number) => void;
}

const createInitialState = (width: number, height: number) => {
  return {
    gameState: 'ready' as GameState,
    score: 0,
    lives: 3,
    fish: {
      x: 50,
      y: height / 2,
      width: FISH_WIDTH,
      height: FISH_HEIGHT,
    },
    moving: null,
    obstacles: [],
    canvasWidth: width,
    canvasHeight: height,
  };
};

export const useFishJump = create<FishJumpState>((set, get) => ({
  ...createInitialState(800, 600), // Default state

  init: (width, height) => {
    set(createInitialState(width, height));
  },

  start: () => {
    const { gameState } = get();
    if (gameState === 'ready') {
      set({ gameState: 'playing' });
    }
  },

  restart: () => {
    const { canvasWidth, canvasHeight } = get();
    set(createInitialState(canvasWidth, canvasHeight));
  },

  setMoving: (direction) => set({ moving: direction }),

  update: (deltaTime) => {
    if (get().gameState !== 'playing') return;

    set(state => {
      // --- Update fish position ---
      let newY = state.fish.y;
      if (state.moving === 'up') {
        newY -= FISH_SPEED * deltaTime;
      } else if (state.moving === 'down') {
        newY += FISH_SPEED * deltaTime;
      }

      // Clamp fish position to be within canvas bounds
      newY = Math.max(0, Math.min(newY, state.canvasHeight - state.fish.height));
      const newFish = { ...state.fish, y: newY };

      // Update obstacles
      let newObstacles = state.obstacles
        .map(obstacle => ({
          top: { ...obstacle.top, x: obstacle.top.x - OBSTACLE_SPEED * deltaTime },
          bottom: { ...obstacle.bottom, x: obstacle.bottom.x - OBSTACLE_SPEED * deltaTime },
        }))
        .filter(obstacle => obstacle.top.x + OBSTACLE_WIDTH > 0);

      // Spawn new obstacles
      const lastObstacle = newObstacles[newObstacles.length - 1];
      if (!lastObstacle || lastObstacle.top.x < state.canvasWidth - 300) {
        const gapY = Math.random() * (state.canvasHeight - OBSTACLE_GAP - 100) + 50;
        newObstacles.push({
          top: { x: state.canvasWidth, y: 0, width: OBSTACLE_WIDTH, height: gapY },
          bottom: { x: state.canvasWidth, y: gapY + OBSTACLE_GAP, width: OBSTACLE_WIDTH, height: state.canvasHeight - gapY - OBSTACLE_GAP },
        });
      }

      // --- Check for collisions ---
      let newLives = state.lives;
      let newGameState = state.gameState;

      // Obstacle collision
      for (const obstacle of newObstacles) {
        const collides = (rect1: GameObject, rect2: GameObject) =>
          rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
          rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;

        if (collides(newFish, obstacle.top) || collides(newFish, obstacle.bottom)) {
          newLives--;
          newObstacles = newObstacles.filter(o => o !== obstacle);
          break;
        }
      }
      
      if (newLives <= 0) newGameState = 'gameOver';

      const passedObstacles = state.obstacles.filter(o => o.top.x + o.top.width < newFish.x).length;
      const newScore = passedObstacles;

      return { fish: newFish, obstacles: newObstacles, lives: newLives, gameState: newGameState, score: newScore };
    });
  },
}));