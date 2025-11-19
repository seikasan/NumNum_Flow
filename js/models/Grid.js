import { Tile } from './Tile.js';
import { TILE_TYPE } from '../constants.js';

export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = this.createEmptyGrid();
    }

    /**
     * Create an empty 2D grid
     * @returns {Tile[][]}
     */
    createEmptyGrid() {
        const grid = [];
        for (let y = 0; y < this.height; y++) {
            grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                grid[y][x] = new Tile({ type: TILE_TYPE.EMPTY });
            }
        }
        return grid;
    }

    /**
     * Get tile at coordinates
     * @param {number} x
     * @param {number} y
     * @returns {Tile|null}
     */
    getTile(x, y) {
        if (!this.isInBounds(x, y)) {
            return null;
        }
        return this.tiles[y][x];
    }

    /**
     * Set tile at coordinates
     * @param {number} x
     * @param {number} y
     * @param {Tile} tile
     */
    setTile(x, y, tile) {
        if (!this.isInBounds(x, y)) {
            return;
        }
        this.tiles[y][x] = tile;
    }

    /**
     * Check if coordinates are within grid bounds
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isInBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    /**
     * Rotate tile at coordinates
     * @param {number} x
     * @param {number} y
     */
    rotateTile(x, y) {
        const tile = this.getTile(x, y);
        if (tile && tile.type === TILE_TYPE.PIPE) {
            tile.rotate();
        }
    }

    /**
     * Reset all tiles to their initial rotation (for reset functionality)
     * Note: This would need initial state tracking in a real implementation
     */
    reset() {
        // This will be implemented when we add state management
    }
}
