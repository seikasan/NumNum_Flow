import { CELL_SIZE } from '../constants.js';

export class InputHandler {
    constructor(canvas, grid, onTileClick) {
        this.canvas = canvas;
        this.grid = grid;
        this.onTileClick = onTileClick;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    /**
     * Handle canvas click
     * @param {MouseEvent} e
     */
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;

        // Convert to grid coordinates
        const gridX = Math.floor(canvasX / CELL_SIZE);
        const gridY = Math.floor(canvasY / CELL_SIZE);

        // Check if valid grid position
        if (this.grid.isInBounds(gridX, gridY)) {
            this.onTileClick(gridX, gridY);
        }
    }
}
