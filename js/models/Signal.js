export class Signal {
    constructor(x, y, value, fromDir) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.fromDir = fromDir; // Direction this signal came from
        this.pathHistory = new Set(); // For loop detection
    }

    /**
     * Clone this signal (for branching)
     * @returns {Signal}
     */
    clone() {
        const newSignal = new Signal(this.x, this.y, this.value, this.fromDir);
        // Copy path history
        newSignal.pathHistory = new Set(this.pathHistory);
        return newSignal;
    }

    /**
     * Get a unique key for current position and direction (for loop detection)
     * @returns {string}
     */
    getStateKey() {
        return `${this.x},${this.y},${this.fromDir}`;
    }

    /**
     * Check if this state has been visited before (loop detection)
     * @returns {boolean}
     */
    hasVisitedCurrentState() {
        return this.pathHistory.has(this.getStateKey());
    }

    /**
     * Record current state in history
     */
    recordCurrentState() {
        this.pathHistory.add(this.getStateKey());
    }

    /**
     * Move signal to new position
     * @param {number} newX
     * @param {number} newY
     * @param {string} newFromDir
     */
    moveTo(newX, newY, newFromDir) {
        this.x = newX;
        this.y = newY;
        this.fromDir = newFromDir;
    }
}
