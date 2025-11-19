import { SHAPE_CONNECTIONS, OPPOSITE_DIR, TILE_TYPE } from '../constants.js';

export class Tile {
    constructor(config = {}) {
        this.type = config.type || TILE_TYPE.PIPE;
        this.shape = config.shape || 'I';
        this.operator = config.operator || 'NONE';
        this.operand = config.operand || 0;
        this.rotation = config.rotation || 0; // 0, 90, 180, 270
        this.fixed = config.fixed || false;
    }

    /**
     * Rotate tile by 90 degrees clockwise
     */
    rotate() {
        if (this.fixed) return;
        this.rotation = (this.rotation + 90) % 360;
    }

    /**
     * Get the output directions based on input direction
     * @param {string} inputDir - Direction signal came from ('N', 'E', 'S', 'W')
     * @returns {string[]} - Array of output directions
     */
    getOutputDirections(inputDir) {
        if (this.type !== TILE_TYPE.PIPE) {
            return [];
        }

        // Get base connections for this shape
        const baseConnections = SHAPE_CONNECTIONS[this.shape] || [];

        // Rotate connections based on tile rotation
        const rotatedConnections = this.rotateDirections(baseConnections, this.rotation);

        // Signal cannot exit from the direction it came from
        const oppositeInput = OPPOSITE_DIR[inputDir];

        // Filter out the input direction
        return rotatedConnections.filter(dir => dir !== oppositeInput);
    }

    /**
     * Rotate a set of directions by the given angle
     * @param {string[]} directions - Array of directions
     * @param {number} angle - Rotation angle (0, 90, 180, 270)
     * @returns {string[]} - Rotated directions
     */
    rotateDirections(directions, angle) {
        const steps = angle / 90;
        const rotationMap = ['N', 'E', 'S', 'W'];

        return directions.map(dir => {
            const currentIndex = rotationMap.indexOf(dir);
            const newIndex = (currentIndex + steps) % 4;
            return rotationMap[newIndex];
        });
    }

    /**
     * Apply this tile's operator to a value
     * @param {number} value - Input value
     * @returns {number} - Calculated output value
     */
    applyOperator(value) {
        switch (this.operator) {
            case 'ADD':
                return value + this.operand;
            case 'SUB':
                return value - this.operand;
            case 'MUL':
                return value * this.operand;
            case 'DIV':
                return Math.floor(value / this.operand);
            case 'MOD':
                return value % this.operand;
            case 'POW':
                return Math.pow(value, this.operand);
            case 'NEG':
                return -value;
            case 'NONE':
            default:
                return value;
        }
    }

    /**
     * Get a display string for the operator
     * @returns {string}
     */
    getOperatorDisplay() {
        switch (this.operator) {
            case 'ADD': return `+${this.operand}`;
            case 'SUB': return `-${this.operand}`;
            case 'MUL': return `×${this.operand}`;
            case 'DIV': return `÷${this.operand}`;
            case 'MOD': return `%${this.operand}`;
            case 'POW': return `^${this.operand}`;
            case 'NEG': return '±';
            case 'NONE':
            default: return '';
        }
    }

    /**
     * Check if this tile can accept input from the given direction
     * @param {string} fromDir - Direction signal is coming from
     * @returns {boolean}
     */
    canAcceptFrom(fromDir) {
        if (this.type !== TILE_TYPE.PIPE) {
            return false;
        }

        const baseConnections = SHAPE_CONNECTIONS[this.shape] || [];
        const rotatedConnections = this.rotateDirections(baseConnections, this.rotation);
        const oppositeDir = OPPOSITE_DIR[fromDir];

        return rotatedConnections.includes(oppositeDir);
    }
}
