import { Tile } from './Tile.js';
import { TILE_TYPE } from '../constants.js';

export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];

        // Initialize with empty tiles
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push(new Tile({ type: TILE_TYPE.EMPTY }));
            }
            this.tiles.push(row);
        }
    }

    /**
     * Get tile at coordinates
     * @param {number} x 
     * @param {number} y 
     * @returns {Tile|null}
     */
    getTile(x, y) {
        if (!this.isInBounds(x, y)) return null;
        return this.tiles[y][x];
    }

    /**
     * Set tile at coordinates
     * @param {number} x 
     * @param {number} y 
     * @param {Tile} tile 
     */
    setTile(x, y, tile) {
        if (this.isInBounds(x, y)) {
            this.tiles[y][x] = tile;
        }
    }

    /**
     * Rotate tile at coordinates
     * @param {number} x 
     * @param {number} y 
     */
    rotateTile(x, y) {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.rotate();
        }
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
}
