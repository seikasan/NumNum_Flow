import { CELL_SIZE } from '../constants.js';

export class InputHandler {
    constructor(canvas, grid, onTileClick) {
        this.canvas = canvas;
        this.grid = grid;
        this.onTileClick = onTileClick;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const gridX = Math.floor(x / CELL_SIZE);
            const gridY = Math.floor(y / CELL_SIZE);

            if (this.grid.isInBounds(gridX, gridY)) {
                this.onTileClick(gridX, gridY);
            }
        });
    }
}
