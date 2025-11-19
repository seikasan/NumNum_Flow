import { Stage } from './models/Stage.js';
import { Renderer } from './views/Renderer.js';
import { GameManager } from './controllers/GameManager.js';
import { InputHandler } from './controllers/InputHandler.js';

let allStages = {};
let currentStageId = null;
let gameManager = null;
let renderer = null;
let inputHandler = null;

// Screen Management
const SCREENS = {
    TITLE: 'title-screen',
    SELECT: 'stage-select-screen',
    GAME: 'game-screen'
};

function showScreen(screenId) {
    Object.values(SCREENS).forEach(id => {
        const element = document.getElementById(id);
        if (id === screenId) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
}

// Load stage data
async function loadStageData() {
    const response = await fetch('./js/data/stages.json');
    allStages = await response.json();
}

// Populate Stage Select Screen
function initStageSelect() {
    const grid = document.getElementById('stage-grid');
    grid.innerHTML = ''; // Clear existing

    Object.keys(allStages).forEach(id => {
        const stage = allStages[id];
        const card = document.createElement('div');
        card.className = 'stage-card';
        card.innerHTML = `
            <h3>${stage.name.split(':')[0]}</h3>
            <p>${stage.name.split(':')[1] || ''}</p>
        `;
        card.addEventListener('click', () => {
            startGame(id);
        });
        grid.appendChild(card);
    });
}

// Start Game with specific stage
function startGame(stageId) {
    try {
        if (!allStages[stageId]) return;

        currentStageId = stageId;
        const stageData = allStages[stageId];
        const stage = new Stage(stageData);

        if (!gameManager) {
            // First time initialization
            const canvas = document.getElementById('game-canvas');
            renderer = new Renderer(canvas, stage);

            gameManager = new GameManager(stage, renderer, () => {
                // On Next Stage
                const stageIds = Object.keys(allStages);
                const currentIndex = stageIds.indexOf(currentStageId);
                if (currentIndex < stageIds.length - 1) {
                    startGame(stageIds[currentIndex + 1]);
                } else {
                    alert('All stages cleared! Congratulations!');
                    showScreen(SCREENS.SELECT);
                }
            });

            inputHandler = new InputHandler(
                canvas,
                stage.grid,
                (x, y) => gameManager.onTileClick(x, y)
            );
        } else {
            // Update existing instances
            renderer.setStage(stage);
            gameManager.setStage(stage);
            inputHandler.setGrid(stage.grid);
        }

        // Initial draw and UI update
        renderer.drawStatic();
        gameManager.updateStageInfo();

        showScreen(SCREENS.GAME);
    } catch (error) {
        console.error('Error starting game:', error);
        alert('Error starting game: ' + error.message);
    }
}

// Initialize game
async function init() {
    try {
        await loadStageData();
        initStageSelect();

        // Event Listeners
        document.getElementById('start-btn').addEventListener('click', () => {
            showScreen(SCREENS.SELECT);
        });

        document.getElementById('back-to-title-btn').addEventListener('click', () => {
            showScreen(SCREENS.TITLE);
        });

        document.getElementById('back-to-select-btn').addEventListener('click', () => {
            showScreen(SCREENS.SELECT);
            gameManager.reset(); // Reset game state when leaving
        });

        // Game Controls
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
            gameManager.retry();
        });

        // Show Title Screen initially
        showScreen(SCREENS.TITLE);

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
