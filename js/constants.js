export const CELL_SIZE = 60;
export const ANIMATION_SPEED = 500; // ms per step
export const MAX_SIMULATION_STEPS = 100;

export const TILE_TYPE = {
  EMPTY: 'empty',
  PIPE: 'pipe',
  INPUT: 'input',
  OUTPUT: 'output'
};

export const GAME_STATE = {
  IDLE: 'idle',
  SIMULATING: 'simulating',
  SUCCESS: 'success',
  FAILURE: 'failure'
};

export const COLORS = {
  GRID_LINE: '#333',
  TILE_BG: '#222',
  PIPE: '#4a90e2',
  INPUT: '#ffd700',
  OUTPUT: '#ff4444',
  SIGNAL: '#00ff88',
  TEXT: '#fff',
  TEXT_MUTED: '#888'
};

export const DIR_OFFSETS = {
  'N': { x: 0, y: -1 },
  'E': { x: 1, y: 0 },
  'S': { x: 0, y: 1 },
  'W': { x: -1, y: 0 }
};

export const OPPOSITE_DIR = {
  'N': 'S',
  'E': 'W',
  'S': 'N',
  'W': 'E'
};
