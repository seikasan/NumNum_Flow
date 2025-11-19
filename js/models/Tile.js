import { TILE_TYPE } from '../constants.js';

export class Tile {
    constructor(data) {
        this.type = data.type || TILE_TYPE.PIPE;
        this.shape = data.shape || 'I'; // I, L, T, +
        this.operator = data.operator || 'NONE';
        this.operand = data.operand || 0;
        this.rotation = data.rotation || 0; // 0, 90, 180, 270
        this.fixed = data.fixed || false;
    }

    /**
     * Rotate the tile 90 degrees clockwise
     */
    rotate() {
        if (this.fixed) return;
        this.rotation = (this.rotation + 90) % 360;
    }

    /**
     * Get output directions based on input direction
     * @param {string} fromDir - Direction the signal came FROM (N, E, S, W)
     * @returns {string[]} - Array of output directions (N, E, S, W)
     */
    getOutputDirections(fromDir) {
        // Define connections for each shape at 0 rotation (North is Up)
        // Connections are defined as if looking at the tile.
        // 'I': North <-> South
        // 'L': North <-> East
        // 'T': North <-> East <-> West (South is blocked)
        // '+': All connected

        const baseConnections = {
            'I': ['N', 'S'],
            'L': ['N', 'E'],
            'T': ['N', 'E', 'W'],
            '+': ['N', 'E', 'S', 'W']
        };

        // Normalize rotation to 0-3 index (0=0, 1=90, 2=180, 3=270)
        const rotIndex = this.rotation / 90;
        const dirs = ['N', 'E', 'S', 'W'];

        // Get rotated connections
        const currentConnections = baseConnections[this.shape].map(dir => {
            const dirIndex = dirs.indexOf(dir);
            return dirs[(dirIndex + rotIndex) % 4];
        });

        // Check if we can enter from 'fromDir'
        // Note: fromDir is the direction the signal is moving, so it enters the tile from the OPPOSITE side.
        // BUT, the simulation engine passes 'fromDir' as the direction relative to the tile?
        // Let's check Signal.js usage in SimulationEngine.
        // SimulationEngine says: "fromDir: どの方向から現在のタイルに入ってきたか" (Which direction it entered FROM)
        // If I move East from (0,0) to (1,0), I enter (1,0) from 'W'.
        // So if fromDir is 'W', the tile must have a connection to 'W'.

        if (!currentConnections.includes(fromDir)) {
            return []; // Cannot enter from this direction
        }

        // Return all OTHER connections
        return currentConnections.filter(d => d !== fromDir);
    }

    /**
     * Check if tile accepts input from a direction
     * @param {string} fromDir - Direction entering FROM
     */
    canAcceptFrom(fromDir) {
        const dirs = ['N', 'E', 'S', 'W'];
        const rotIndex = this.rotation / 90;

        const baseConnections = {
            'I': ['N', 'S'],
            'L': ['N', 'E'],
            'T': ['N', 'E', 'W'],
            '+': ['N', 'E', 'S', 'W']
        };

        const currentConnections = baseConnections[this.shape].map(dir => {
            const dirIndex = dirs.indexOf(dir);
            return dirs[(dirIndex + rotIndex) % 4];
        });

        return currentConnections.includes(fromDir);
    }

    /**
     * Apply operator to a value
     * @param {number} value 
     * @returns {number}
     */
    applyOperator(value) {
        switch (this.operator) {
            case 'ADD': return value + this.operand;
            case 'SUB': return value - this.operand;
            case 'MUL': return value * this.operand;
            case 'DIV': return Math.floor(value / this.operand);
            case 'MOD': return value % this.operand;
            case 'POW': return Math.pow(value, this.operand);
            default: return value;
        }
    }

    /**
     * Get display string for operator
     */
    getOperatorDisplay() {
        if (this.operator === 'NONE') return '';

        const opSymbols = {
            'ADD': '+',
            'SUB': '-',
            'MUL': '×',
            'DIV': '÷',
            'MOD': 'MOD',
            'POW': '^'
        };

        return `${opSymbols[this.operator] || ''}${this.operand}`;
    }
}
