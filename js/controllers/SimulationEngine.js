import { Signal } from '../models/Signal.js';
import { DIR_OFFSETS, OPPOSITE_DIR, MAX_SIMULATION_STEPS, TILE_TYPE } from '../constants.js';

export class SimulationEngine {
    constructor(stage) {
        this.stage = stage;
    }

    /**
     * Run the simulation
     * @returns {Object} - { status: 'clear'|'fail', reason: string, log: Array }
     */
    run() {
        const activeSignals = [];
        const nextSignals = [];
        const reachedOutputs = new Map(); // "x,y" -> value
        const simulationLog = [];
        let step = 0;

        // Initialize signals from inputs
        this.stage.getInputs().forEach(input => {
            // Input sends signal in all valid directions initially
            const signal = new Signal(input.x, input.y, input.value, null);
            activeSignals.push(signal);
        });

        // Main simulation loop
        while (activeSignals.length > 0 && step < MAX_SIMULATION_STEPS) {
            const stepLog = {
                step,
                signals: []
            };

            // Check for collisions (multiple signals at same position)
            const positionMap = new Map();
            for (const signal of activeSignals) {
                const key = `${signal.x},${signal.y}`;
                if (positionMap.has(key)) {
                    return {
                        status: 'fail',
                        reason: `合流エラー: 座標(${signal.x}, ${signal.y})で複数の値が衝突しました`,
                        log: simulationLog
                    };
                }
                positionMap.set(key, signal);
            }

            // Process each active signal
            for (const signal of activeSignals) {
                const tile = this.stage.grid.getTile(signal.x, signal.y);

                if (!tile) {
                    return {
                        status: 'fail',
                        reason: `断線エラー: 座標(${signal.x}, ${signal.y})が盤外です`,
                        log: simulationLog
                    };
                }

                // Check if reached OUTPUT
                const output = this.stage.getOutputAt(signal.x, signal.y);
                if (output) {
                    const key = `${signal.x},${signal.y}`;
                    reachedOutputs.set(key, signal.value);

                    stepLog.signals.push({
                        x: signal.x,
                        y: signal.y,
                        value: signal.value,
                        type: 'output'
                    });
                    continue; // Signal consumed
                }

                // Apply operator if this is a PIPE tile
                if (tile.type === TILE_TYPE.PIPE) {
                    const oldValue = signal.value;
                    signal.value = tile.applyOperator(signal.value);

                    // Check for loop
                    if (signal.hasVisitedCurrentState()) {
                        return {
                            status: 'fail',
                            reason: `ループエラー: 座標(${signal.x}, ${signal.y})で無限ループが検出されました`,
                            log: simulationLog
                        };
                    }
                    signal.recordCurrentState();

                    stepLog.signals.push({
                        x: signal.x,
                        y: signal.y,
                        value: signal.value,
                        oldValue: oldValue,
                        operator: tile.getOperatorDisplay()
                    });

                    // Get output directions
                    let outputDirs;
                    if (signal.fromDir === null) {
                        // First step from INPUT - try all directions
                        outputDirs = ['N', 'E', 'S', 'W'];
                    } else {
                        outputDirs = tile.getOutputDirections(signal.fromDir);
                    }

                    if (outputDirs.length === 0) {
                        return {
                            status: 'fail',
                            reason: `断線エラー: 座標(${signal.x}, ${signal.y})で行き止まりです`,
                            log: simulationLog
                        };
                    }

                    // Branch signal to all output directions
                    for (const dir of outputDirs) {
                        const offset = DIR_OFFSETS[dir];
                        const newX = signal.x + offset.x;
                        const newY = signal.y + offset.y;

                        // Check if new position is in bounds
                        if (!this.stage.grid.isInBounds(newX, newY)) {
                            // Check if it's an intentional output outside grid
                            const isOutput = this.stage.outputs.some(
                                out => out.pos.x === newX && out.pos.y === newY
                            );
                            if (!isOutput) {
                                return {
                                    status: 'fail',
                                    reason: `断線エラー: 座標(${signal.x}, ${signal.y})から盤外へ接続されています`,
                                    log: simulationLog
                                };
                            }
                        }

                        const nextTile = this.stage.grid.getTile(newX, newY);
                        if (!nextTile || nextTile.type === TILE_TYPE.EMPTY) {
                            return {
                                status: 'fail',
                                reason: `断線エラー: 座標(${newX}, ${newY})にタイルがありません`,
                                log: simulationLog
                            };
                        }

                        // Check if next tile can accept from this direction
                        const oppositeDir = OPPOSITE_DIR[dir];
                        if (nextTile.type === TILE_TYPE.PIPE && !nextTile.canAcceptFrom(oppositeDir)) {
                            return {
                                status: 'fail',
                                reason: `断線エラー: 座標(${newX}, ${newY})のタイルが接続されていません`,
                                log: simulationLog
                            };
                        }

                        // Clone signal and move it
                        const newSignal = signal.clone();
                        newSignal.moveTo(newX, newY, oppositeDir);
                        nextSignals.push(newSignal);
                    }
                }
            }

            simulationLog.push(stepLog);

            // Move to next step
            activeSignals.length = 0;
            activeSignals.push(...nextSignals);
            nextSignals.length = 0;
            step++;
        }

        // Check if hit step limit (infinite loop)
        if (step >= MAX_SIMULATION_STEPS) {
            return {
                status: 'fail',
                reason: 'ループエラー: 最大ステップ数を超えました',
                log: simulationLog
            };
        }

        // Verify all outputs reached
        for (const output of this.stage.outputs) {
            const key = `${output.pos.x},${output.pos.y}`;
            if (!reachedOutputs.has(key)) {
                return {
                    status: 'fail',
                    reason: `未達エラー: 座標(${output.pos.x}, ${output.pos.y})のOUTPUTに値が到達していません`,
                    log: simulationLog
                };
            }

            // Verify value matches target
            const reachedValue = reachedOutputs.get(key);
            if (reachedValue !== output.targetValue) {
                return {
                    status: 'fail',
                    reason: `値の不一致: 座標(${output.pos.x}, ${output.pos.y})で期待値${output.targetValue}に対し${reachedValue}が出力されました`,
                    log: simulationLog
                };
            }
        }

        // All checks passed - CLEAR!
        return {
            status: 'clear',
            reason: 'すべてのOUTPUTで目標値を達成しました!',
            log: simulationLog
        };
    }
}
