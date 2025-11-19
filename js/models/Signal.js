export class Signal {
    constructor(x, y, value, fromDir, history = null) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.fromDir = fromDir; // Direction entered FROM

        // History of visited states to detect loops
        // State key: "x,y,fromDir"
        this.history = history ? new Set(history) : new Set();
    }

    /**
     * Create a copy of the signal
     */
    clone() {
        return new Signal(this.x, this.y, this.value, this.fromDir, this.history);
    }

    /**
     * Move signal to new position
     * @param {number} x 
     * @param {number} y 
     * @param {string} fromDir - Direction entering FROM
     */
    moveTo(x, y, fromDir) {
        this.x = x;
        this.y = y;
        this.fromDir = fromDir;
    }

    /**
     * Record current state in history
     */
    recordCurrentState() {
        this.history.add(this.getCurrentStateKey());
    }

    /**
     * Check if current state has been visited
     */
    hasVisitedCurrentState() {
        return this.history.has(this.getCurrentStateKey());
    }

    /**
     * Generate unique key for current state
     */
    getCurrentStateKey() {
        return `${this.x},${this.y},${this.fromDir}`;
    }
}
