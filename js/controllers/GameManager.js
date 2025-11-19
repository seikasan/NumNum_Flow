import { SimulationEngine } from './SimulationEngine.js';
import { GAME_STATE } from '../constants.js';

export class GameManager {
    constructor(stage, renderer, onNextStage) {
        this.stage = stage;
        this.renderer = renderer;
        this.onNextStage = onNextStage;
        this.state = GAME_STATE.IDLE;
        this.simulationResult = null;
    }

    /**
     * Update stage reference
     * @param {Stage} stage 
     */
    setStage(stage) {
        this.stage = stage;
        this.reset();
    }

    /**
     * Handle tile click - rotate the tile
     * @param {number} x
     * @param {number} y
     */
    onTileClick(x, y) {
        if (this.state !== GAME_STATE.IDLE) {
            return; // Cannot interact during simulation
        }

        this.stage.grid.rotateTile(x, y);
        this.renderer.drawStatic();
    }

    /**
     * Run simulation
     */
    async runSimulation() {
        if (this.state !== GAME_STATE.IDLE) {
            return;
        }

        this.state = GAME_STATE.SIMULATING;
        this.updateUI();

        const engine = new SimulationEngine(this.stage);
        this.simulationResult = engine.run();

        // Play animation
        await this.renderer.playAnimation(this.simulationResult.log);

        // Update state based on result
        this.state = this.simulationResult.status === 'clear'
            ? GAME_STATE.SUCCESS
            : GAME_STATE.FAILURE;

        this.showResult();
    }

    /**
     * Reset the game
     */
    reset() {
        this.stage.reset();
        this.state = GAME_STATE.IDLE;
        this.simulationResult = null;
        this.hideResult();
        this.renderer.drawStatic();
        this.updateUI();
    }

    /**
     * Retry the current stage without resetting grid
     */
    retry() {
        this.state = GAME_STATE.IDLE;
        this.simulationResult = null;
        this.hideResult();
        this.renderer.drawStatic(); // Clear signals
        this.updateUI(); // Re-enable buttons
    }

    /**
     * Update UI button states
     */
    updateUI() {
        const runBtn = document.getElementById('run-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (this.state === GAME_STATE.SIMULATING) {
            runBtn.disabled = true;
            resetBtn.disabled = true;
        } else {
            runBtn.disabled = false;
            resetBtn.disabled = false;
        }
    }

    /**
     * Show result overlay
     */
    showResult() {
        const overlay = document.getElementById('result-overlay');
        const title = document.getElementById('result-title');
        const message = document.getElementById('result-message');

        if (this.state === GAME_STATE.SUCCESS) {
            title.textContent = '🎉 CLEAR!';
            title.style.color = '#00ff88';
        } else {
            title.textContent = '❌ FAILED';
            title.style.color = '#ff3366';
        }

        message.textContent = this.simulationResult.reason;

        const nextBtn = document.getElementById('next-stage-btn');
        if (this.state === GAME_STATE.SUCCESS) {
            nextBtn.classList.remove('hidden');
            nextBtn.onclick = () => {
                this.hideResult();
                if (this.onNextStage) this.onNextStage();
            };
        } else {
            nextBtn.classList.add('hidden');
        }

        overlay.classList.remove('hidden');
    }

    /**
     * Hide result overlay
     */
    hideResult() {
        const overlay = document.getElementById('result-overlay');
        overlay.classList.add('hidden');
    }

    /**
     * Update stage info display
     */
    updateStageInfo() {
        const stageName = document.getElementById('stage-name');
        const inputValue = document.getElementById('input-value');
        const targetValues = document.getElementById('target-values');

        stageName.textContent = this.stage.name;

        // Display inputs
        const inputs = this.stage.getInputs();
        if (inputs.length > 0) {
            inputValue.textContent = inputs.map(i => i.value).join(', ');
        }

        // Display targets
        const targets = this.stage.outputs.map(o => o.targetValue).join(', ');
        targetValues.textContent = targets;
    }
}
