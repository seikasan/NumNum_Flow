import { CELL_SIZE, COLORS, TILE_TYPE, ANIMATION_SPEED } from '../constants.js';

export class Renderer {
    constructor(canvas, stage) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setStage(stage);

        this.animationFrameId = null;
    }

    /**
     * Update stage reference and resize canvas
     * @param {Stage} stage 
     */
    setStage(stage) {
        this.stage = stage;
        this.canvas.width = stage.grid.width * CELL_SIZE;
        this.canvas.height = stage.grid.height * CELL_SIZE;
    }

    /**
     * Draw static elements (grid, tiles)
     */
    drawStatic() {
        this.clear();
        this.drawGrid();
        this.drawTiles();
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw grid lines
     */
    drawGrid() {
        this.ctx.strokeStyle = COLORS.GRID_LINE;
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= this.stage.grid.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CELL_SIZE, 0);
            this.ctx.lineTo(x * CELL_SIZE, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.stage.grid.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CELL_SIZE);
            this.ctx.lineTo(this.canvas.width, y * CELL_SIZE);
            this.ctx.stroke();
        }
    }

    /**
     * Draw all tiles
     */
    drawTiles() {
        for (let y = 0; y < this.stage.grid.height; y++) {
            for (let x = 0; x < this.stage.grid.width; x++) {
                const tile = this.stage.grid.getTile(x, y);
                if (tile && tile.type !== TILE_TYPE.EMPTY) {
                    this.drawTile(x, y, tile);
                }
            }
        }
    }

    /**
     * Draw a single tile
     * @param {number} x - Grid x
     * @param {number} y - Grid y
     * @param {Tile} tile
     */
    drawTile(x, y, tile) {
        const centerX = x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = y * CELL_SIZE + CELL_SIZE / 2;

        // Draw background for non-empty tiles
        if (tile.type !== TILE_TYPE.EMPTY) {
            this.ctx.fillStyle = COLORS.TILE_BG;
            this.ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        // Draw based on type
        if (tile.type === TILE_TYPE.INPUT) {
            this.drawInput(centerX, centerY);
        } else if (tile.type === TILE_TYPE.OUTPUT) {
            this.drawOutput(centerX, centerY);
        } else if (tile.type === TILE_TYPE.PIPE) {
            this.drawPipe(centerX, centerY, tile);
        }
    }

    /**
     * Draw INPUT marker
     */
    drawInput(x, y) {
        this.ctx.fillStyle = COLORS.INPUT;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('IN', x, y);
    }

    /**
     * Draw OUTPUT marker
     */
    drawOutput(x, y) {
        this.ctx.strokeStyle = COLORS.OUTPUT;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = COLORS.OUTPUT;
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('OUT', x, y);
    }

    /**
     * Draw a pipe tile with its shape and operator
     * @param {number} x - Center x
     * @param {number} y - Center y
     * @param {Tile} tile
     */
    drawPipe(x, y, tile) {
        const ctx = this.ctx;
        const rotation = tile.rotation;
        const pipeWidth = 8;
        const pipeLength = CELL_SIZE / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);

        ctx.strokeStyle = COLORS.PIPE;
        ctx.lineWidth = pipeWidth;
        ctx.lineCap = 'round';

        // Draw shape
        switch (tile.shape) {
            case 'I': // Straight
                ctx.beginPath();
                ctx.moveTo(0, -pipeLength);
                ctx.lineTo(0, pipeLength);
                ctx.stroke();
                break;

            case 'L': // L-corner
                ctx.beginPath();
                ctx.moveTo(0, -pipeLength);
                ctx.lineTo(0, 0);
                ctx.lineTo(pipeLength, 0);
                ctx.stroke();
                break;

            case 'T': // T-shape
                ctx.beginPath();
                ctx.moveTo(0, -pipeLength);
                ctx.lineTo(0, 0);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-pipeLength, 0);
                ctx.lineTo(pipeLength, 0);
                ctx.stroke();
                break;

            case '+': // Cross
                ctx.beginPath();
                ctx.moveTo(0, -pipeLength);
                ctx.lineTo(0, pipeLength);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-pipeLength, 0);
                ctx.lineTo(pipeLength, 0);
                ctx.stroke();
                break;
        }

        ctx.restore();

        // Draw operator label
        const operatorText = tile.getOperatorDisplay();
        if (operatorText) {
            ctx.fillStyle = COLORS.TEXT;
            ctx.font = 'bold 14px Rajdhani';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(operatorText, x, y);
        }
    }

    /**
     * Play animation of signal flow
     * @param {Array} log - Simulation log
     * @returns {Promise}
     */
    async playAnimation(log) {
        return new Promise((resolve) => {
            let stepIndex = 0;

            const animateStep = () => {
                if (stepIndex >= log.length) {
                    resolve();
                    return;
                }

                const stepData = log[stepIndex];
                this.drawStatic();

                // Draw signals for this step
                stepData.signals.forEach(signal => {
                    this.drawSignal(signal);
                });

                stepIndex++;
                setTimeout(animateStep, ANIMATION_SPEED);
            };

            animateStep();
        });
    }

    /**
     * Draw a signal (value moving through pipes)
     * @param {Object} signal - { x, y, value, operator, oldValue }
     */
    drawSignal(signal) {
        const centerX = signal.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = signal.y * CELL_SIZE + CELL_SIZE / 2;

        // Draw signal glow
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 5,
            centerX, centerY, 20
        );
        gradient.addColorStop(0, COLORS.SIGNAL);
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw value text
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = 'bold 16px Rajdhani';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(signal.value.toString(), centerX, centerY);

        // Show operator if available
        if (signal.operator && signal.oldValue !== undefined) {
            this.ctx.fillStyle = COLORS.TEXT_MUTED;
            this.ctx.font = '10px Rajdhani';
            this.ctx.fillText(
                `${signal.oldValue} ${signal.operator}`,
                centerX,
                centerY - 25
            );
        }
    }
}
