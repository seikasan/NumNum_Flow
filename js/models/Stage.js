import { Grid } from './Grid.js';
import { Tile } from './Tile.js';
import { TILE_TYPE } from '../constants.js';

export class Stage {
    constructor(stageData) {
        this.name = stageData.name || 'Unnamed Stage';
        this.gridSize = stageData.gridSize || { width: 5, height: 5 };
        this.inputs = stageData.inputs || [];
        this.outputs = stageData.outputs || [];

        // Create grid
        this.grid = new Grid(this.gridSize.width, this.gridSize.height);

        // Populate with tiles
        this.loadTiles(stageData.tiles || []);

        // Store initial state for reset
        this.initialState = this.captureState();
    }

    /**
     * Load tiles into grid from stage data
     * @param {Array} tilesData
     */
    loadTiles(tilesData) {
        tilesData.forEach(tileData => {
            const tile = new Tile({
                type: TILE_TYPE.PIPE,
                shape: tileData.shape,
                operator: tileData.operator,
                operand: tileData.operand,
                rotation: tileData.rotation || 0,
                fixed: tileData.fixed || false
            });

            this.grid.setTile(tileData.pos.x, tileData.pos.y, tile);
        });

        // Mark INPUT and OUTPUT positions
        this.inputs.forEach(input => {
            const tile = new Tile({
                type: TILE_TYPE.INPUT,
                shape: '+' // Input can output in all directions
            });
            this.grid.setTile(input.pos.x, input.pos.y, tile);
        });

        this.outputs.forEach(output => {
            const tile = new Tile({
                type: TILE_TYPE.OUTPUT,
                shape: '+' // Output can accept from all directions
            });
            this.grid.setTile(output.pos.x, output.pos.y, tile);
        });
    }

    /**
     * Capture current state of all tiles for reset
     * @returns {Object}
     */
    captureState() {
        const state = [];
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const tile = this.grid.getTile(x, y);
                if (tile && tile.type === TILE_TYPE.PIPE) {
                    state.push({
                        x,
                        y,
                        rotation: tile.rotation
                    });
                }
            }
        }
        return state;
    }

    /**
     * Reset stage to initial state
     */
    reset() {
        this.initialState.forEach(tileState => {
            const tile = this.grid.getTile(tileState.x, tileState.y);
            if (tile) {
                tile.rotation = tileState.rotation;
            }
        });
    }

    /**
     * Check if position is an OUTPUT
     * @param {number} x
     * @param {number} y
     * @returns {Object|null} - Output config if found
     */
    getOutputAt(x, y) {
        return this.outputs.find(out => out.pos.x === x && out.pos.y === y) || null;
    }

    /**
     * Get all input positions and values
     * @returns {Array}
     */
    getInputs() {
        return this.inputs.map(input => ({
            x: input.pos.x,
            y: input.pos.y,
            value: input.value
        }));
    }
}
