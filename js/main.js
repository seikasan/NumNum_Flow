import { Stage } from './models/Stage.js';
import { Renderer } from './views/Renderer.js';
import { GameManager } from './controllers/GameManager.js';
import { InputHandler } from './controllers/InputHandler.js';

// Load stage data
async function loadStageData(stageId) {
    const response = await fetch('./js/data/stages.json');
    const allStages = await response.json();
    return allStages[stageId];
}

// Initialize game
async function init() {
    try {
        // Load first stage
        const stageData = await loadStageData('stage001');
        const stage = new Stage(stageData);

        // Setup canvas
        const canvas = document.getElementById('game-canvas');
        const renderer = new Renderer(canvas, stage);

        // Setup game manager
        const gameManager = new GameManager(stage, renderer);

        // Setup input handler
        const inputHandler = new InputHandler(
            canvas,
            stage.grid,
            (x, y) => gameManager.onTileClick(x, y)
        );

        // Setup UI buttons
        const runBtn = document.getElementById('run-btn');
        const resetBtn = document.getElementById('reset-btn');
        const continueBtn = document.getElementById('continue-btn');

        runBtn.addEventListener('click', () => {
            gameManager.runSimulation();
        });

        resetBtn.addEventListener('click', () => {
            gameManager.reset();
        });

        continueBtn.addEventListener('click', () => {
            gameManager.reset();
        });

        // Initial draw
        renderer.drawStatic();
        gameManager.updateStageInfo();

        console.log('NumNum Flow initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
}

// Start game when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
