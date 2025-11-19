import { Grid } from './Grid.js';
import { Tile } from './Tile.js';
import { TILE_TYPE } from '../constants.js';

export class Stage {
    constructor(data) {
        this.data = data; // Store original data for reset
        this.name = data.name;
        this.grid = new Grid(data.gridSize.width, data.gridSize.height);
        this.inputs = data.inputs;
        this.outputs = data.outputs;

        this.initializeGrid();
    }

    /**
     * Initialize grid from data
     */
    initializeGrid() {
        // Inputs and Outputs are now external, not tiles on the grid.

        // Place pipe tiles
        this.data.tiles.forEach(tileData => {
            this.grid.setTile(tileData.pos.x, tileData.pos.y, new Tile({
                type: TILE_TYPE.PIPE,
                shape: tileData.shape,
                operator: tileData.operator,
                operand: tileData.operand,
                rotation: tileData.rotation,
                fixed: tileData.fixed
            }));
        });
    }

    /**
     * Reset stage to initial state
     */
    reset() {
        // Re-initialize grid to restore initial rotations
        this.grid = new Grid(this.data.gridSize.width, this.data.gridSize.height);
        this.initializeGrid();
    }

    /**
     * Get all input definitions
     * @returns {Array}
     */
    getInputs() {
        // Return inputs with x,y flattened for easier access
        return this.inputs.map(i => ({
            x: i.pos.x,
            y: i.pos.y,
            value: i.value
        }));
    }

    /**
     * Get output definition at specific position
     * @param {number} x 
     * @param {number} y 
     * @returns {Object|null}
     */
    getOutputAt(x, y) {
        return this.outputs.find(o => o.pos.x === x && o.pos.y === y) || null;
    }
}
