
const fs = require('fs');

const SHAPES = ['I', 'L', 'T', '+'];
const ROTATIONS = [0, 90, 180, 270];

function getRandomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

function getRandomRotation() {
    return ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
}

function createDummyTile(x, y) {
    return {
        pos: { x, y },
        shape: getRandomShape(),
        operator: 'NONE',
        operand: 0,
        rotation: getRandomRotation(),
        fixed: false
    };
}

const stages = {
    "stage001": {
        "name": "Tutorial: 基本の演算",
        "gridSize": { "width": 5, "height": 5 },
        "inputs": [
            { "pos": { "x": -1, "y": 2 }, "value": 10 }
        ],
        "outputs": [
            { "pos": { "x": 5, "y": 2 }, "targetValue": 4 }
        ],
        "tiles": []
    },
    "stage002": {
        "name": "Stage 2: MODを使おう",
        "gridSize": { "width": 6, "height": 5 },
        "inputs": [
            { "pos": { "x": -1, "y": 2 }, "value": 17 }
        ],
        "outputs": [
            { "pos": { "x": 6, "y": 2 }, "targetValue": 3 }
        ],
        "tiles": []
    },
    "stage003": {
        "name": "Stage 3: 分岐の力",
        "gridSize": { "width": 7, "height": 7 },
        "inputs": [
            { "pos": { "x": 3, "y": -1 }, "value": 8 }
        ],
        "outputs": [
            { "pos": { "x": 7, "y": 3 }, "targetValue": 16 },
            { "pos": { "x": -1, "y": 3 }, "targetValue": 4 }
        ],
        "tiles": []
    },
    "stage004": {
        "name": "Stage 4: 複雑な回路",
        "gridSize": { "width": 7, "height": 7 },
        "inputs": [
            { "pos": { "x": -1, "y": 0 }, "value": 5 }
        ],
        "outputs": [
            { "pos": { "x": 7, "y": 6 }, "targetValue": 7 }
        ],
        "tiles": []
    }
};

// Helper to add tile if not exists
function addTile(stageKey, tile) {
    const stage = stages[stageKey];
    const existingIndex = stage.tiles.findIndex(t => t.pos.x === tile.pos.x && t.pos.y === tile.pos.y);
    if (existingIndex >= 0) {
        stage.tiles[existingIndex] = tile;
    } else {
        stage.tiles.push(tile);
    }
}

// --- Stage 1 ---
// Path: (0,2)->(1,2)->(2,2)->(3,2)->(4,2)
addTile("stage001", { pos: { x: 0, y: 2 }, shape: "I", operator: "NONE", operand: 0, rotation: 90, fixed: false });
addTile("stage001", { pos: { x: 1, y: 2 }, shape: "I", operator: "SUB", operand: 3, rotation: 90, fixed: false });
addTile("stage001", { pos: { x: 2, y: 2 }, shape: "I", operator: "DIV", operand: 2, rotation: 90, fixed: false });
addTile("stage001", { pos: { x: 3, y: 2 }, shape: "I", operator: "ADD", operand: 1, rotation: 90, fixed: false });
addTile("stage001", { pos: { x: 4, y: 2 }, shape: "I", operator: "NONE", operand: 0, rotation: 90, fixed: false });

// Fill Stage 1
for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
        if (!stages.stage001.tiles.find(t => t.pos.x === x && t.pos.y === y)) {
            addTile("stage001", createDummyTile(x, y));
        }
    }
}

// --- Stage 2 ---
// Path: (0,2)->(1,2)->(2,2)->(3,2)->(4,2)->(5,2)
addTile("stage002", { pos: { x: 0, y: 2 }, shape: "I", operator: "NONE", operand: 0, rotation: 90, fixed: false });
addTile("stage002", { pos: { x: 1, y: 2 }, shape: "I", operator: "ADD", operand: 4, rotation: 90, fixed: false });
addTile("stage002", { pos: { x: 2, y: 2 }, shape: "I", operator: "MOD", operand: 7, rotation: 90, fixed: false });
addTile("stage002", { pos: { x: 3, y: 2 }, shape: "I", operator: "MUL", operand: 2, rotation: 90, fixed: false });
addTile("stage002", { pos: { x: 4, y: 2 }, shape: "I", operator: "SUB", operand: 3, rotation: 90, fixed: false });
addTile("stage002", { pos: { x: 5, y: 2 }, shape: "I", operator: "NONE", operand: 0, rotation: 90, fixed: false });

// Fill Stage 2
for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 6; x++) {
        if (!stages.stage002.tiles.find(t => t.pos.x === x && t.pos.y === y)) {
            addTile("stage002", createDummyTile(x, y));
        }
    }
}

// --- Stage 3 ---
// Path: (3,0)->(3,1)->(3,2)->(3,3)->Split((2,3)->(1,3)->(0,3), (4,3)->(5,3)->(6,3))
addTile("stage003", { pos: { x: 3, y: 0 }, shape: "I", operator: "NONE", operand: 0, rotation: 0, fixed: false });
addTile("stage003", { pos: { x: 3, y: 1 }, shape: "I", operator: "NONE", operand: 0, rotation: 0, fixed: false });
addTile("stage003", { pos: { x: 3, y: 2 }, shape: "I", operator: "NONE", operand: 0, rotation: 0, fixed: false });
addTile("stage003", { pos: { x: 3, y: 3 }, shape: "T", operator: "NONE", operand: 0, rotation: 0, fixed: true });
addTile("stage003", { pos: { x: 2, y: 3 }, shape: "I", operator: "DIV", operand: 2, rotation: 90, fixed: false });
addTile("stage003", { pos: { x: 1, y: 3 }, shape: "I", operator: "NONE", operand: 0, rotation: 90, fixed: false });
addTile("stage003", { pos: { x: 0, y: 3 }, shape: "I", operator: "NONE", operand: 0, rotation: 90, fixed: false }); // New exit
addTile("stage003", { pos: { x: 4, y: 3 }, shape: "I", operator: "MUL", operand: 2, rotation: 90, fixed: false });
addTile("stage003", { pos: { x: 5, y: 3 }, shape: "I", operator: "NONE", operand: 0, rotation: 90, fixed: false });
addTile("stage003", { pos: { x: 6, y: 3 }, shape: "I", operator: "NONE", operand: 0, rotation: 90, fixed: false }); // New exit

// Fill Stage 3
for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
        if (!stages.stage003.tiles.find(t => t.pos.x === x && t.pos.y === y)) {
            addTile("stage003", createDummyTile(x, y));
        }
    }
}

// --- Stage 4 ---
// Path: (0,0)->(1,0)->(2,0)->(2,1)->(2,2)->(3,2)->(4,2)->(4,3)->(4,4)->(5,4)->(6,4)->(6,5)->(6,6)
addTile("stage004", { pos: { x: 0, y: 0 }, shape: "I", operator: "NONE", operand: 0, rotation: 90, fixed: false }); // New entry
addTile("stage004", { pos: { x: 1, y: 0 }, shape: "I", operator: "MUL", operand: 3, rotation: 90, fixed: false });
addTile("stage004", { pos: { x: 2, y: 0 }, shape: "L", operator: "NONE", operand: 0, rotation: 90, fixed: false });
addTile("stage004", { pos: { x: 2, y: 1 }, shape: "I", operator: "ADD", operand: 2, rotation: 0, fixed: false });
addTile("stage004", { pos: { x: 2, y: 2 }, shape: "L", operator: "NONE", operand: 0, rotation: 0, fixed: false });
addTile("stage004", { pos: { x: 3, y: 2 }, shape: "I", operator: "MOD", operand: 10, rotation: 90, fixed: false });
addTile("stage004", { pos: { x: 4, y: 2 }, shape: "L", operator: "NONE", operand: 0, rotation: 90, fixed: false });
addTile("stage004", { pos: { x: 4, y: 3 }, shape: "I", operator: "SUB", operand: 3, rotation: 0, fixed: false });
addTile("stage004", { pos: { x: 4, y: 4 }, shape: "L", operator: "NONE", operand: 0, rotation: 0, fixed: false });
addTile("stage004", { pos: { x: 5, y: 4 }, shape: "I", operator: "ADD", operand: 3, rotation: 90, fixed: false });
addTile("stage004", { pos: { x: 6, y: 4 }, shape: "L", operator: "NONE", operand: 0, rotation: 90, fixed: false });
addTile("stage004", { pos: { x: 6, y: 5 }, shape: "I", operator: "NONE", operand: 0, rotation: 0, fixed: false });
addTile("stage004", { pos: { x: 6, y: 6 }, shape: "I", operator: "NONE", operand: 0, rotation: 0, fixed: false }); // New exit

// Fill Stage 4
for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
        if (!stages.stage004.tiles.find(t => t.pos.x === x && t.pos.y === y)) {
            addTile("stage004", createDummyTile(x, y));
        }
    }
}

fs.writeFileSync('js/data/stages.json', JSON.stringify(stages, null, 2));
console.log('Stages generated successfully.');
