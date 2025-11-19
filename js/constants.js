// Game constants and enums

export const DIRECTIONS = {
  NORTH: 'N',
  EAST: 'E',
  SOUTH: 'S',
  WEST: 'W'
};

export const OPPOSITE_DIR = {
  N: 'S',
  S: 'N',
  E: 'W',
  W: 'E'
};

export const DIR_OFFSETS = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 }
};

export const TILE_SHAPES = {
  STRAIGHT: 'I',
  L_SHAPE: 'L',
  T_SHAPE: 'T',
  CROSS: '+'
};

// Define which directions connect for each shape at rotation 0
// These will be rotated at runtime based on tile.rotation
export const SHAPE_CONNECTIONS = {
  'I': ['N', 'S'],      // Straight vertical
  'L': ['N', 'E'],      // L-shape corner
  'T': ['N', 'E', 'W'], // T-shape (3 exits)
  '+': ['N', 'E', 'S', 'W'] // Cross (4 exits)
};

export const OPERATOR_TYPES = {
  ADD: 'ADD',
  SUB: 'SUB',
  MUL: 'MUL',
  DIV: 'DIV',
  MOD: 'MOD',
  POW: 'POW',
  NEG: 'NEG',
  NONE: 'NONE'
};

export const TILE_TYPE = {
  EMPTY: 'EMPTY',
  PIPE: 'PIPE',
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT'
};

export const GAME_STATE = {
  IDLE: 'IDLE',
  SIMULATING: 'SIMULATING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
};

export const MAX_SIMULATION_STEPS = 1000;

export const CELL_SIZE = 60; // pixels per grid cell
export const ANIMATION_SPEED = 300; // ms per step

// Visual constants
export const COLORS = {
  GRID_LINE: 'rgba(123, 47, 247, 0.2)',
  TILE_BG: 'rgba(255, 255, 255, 0.05)',
  TILE_BORDER: 'rgba(123, 47, 247, 0.4)',
  PIPE: '#00d4ff',
  INPUT: '#00ff88',
  OUTPUT: '#ff3366',
  SIGNAL: '#ffaa00',
  TEXT: '#e0e7ff',
  TEXT_MUTED: '#8892b0'
};
