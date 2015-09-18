function Saint(name, power) {
    this.name = name;
    this.power = power;
    this.energyLeft = 5;
}

Saint.prototype.useEnergy = function() {
    this.energyLeft--;
};

function World() {
    this.IMAGE_WIDTH = 941;
    this.IMAGE_HEIGHT = 1009;
    this.GRID_WIDTH = 42;
    this.GRID_HEIGHT = 42;
    this.CELL_WIDTH = (this.IMAGE_WIDTH - 1) / this.GRID_WIDTH;
    this.CELL_HEIGHT = (this.IMAGE_HEIGHT - 1) / this.GRID_HEIGHT;
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.grid = new Grid(this.GRID_WIDTH, this.GRID_HEIGHT);
    this.gridImage = new Image();
    this.SeiyaImage = new Image();
    this.saints = [
        new Saint("Seiya", 1.5),
        new Saint("Shiryu", 1.4),
        new Saint("Hyoga", 1.3),
        new Saint("Shun", 1.2),
        new Saint("Ikki", 1.1)
    ];

    this.astar = null;

    this.timeElapsed = 0;
    this.position = null;
    this.loadImages();
}

World.prototype.init = function() {
    this.initGrid();
    this.position = this.grid.getStart();
};

World.prototype.loadImages = function() {
    this.gridImage.crossOrigin = 'anonymous';
    this.gridImage.src = 'images/grid.png';
    var that = this;
    this.gridImage.onload = function() {
        that.SeiyaImage.src = 'images/seiya.png';
        that.SeiyaImage.onload = function() {
            that.init();
        };
    };
};

World.prototype.initGrid = function() {
    this.context.drawImage(this.gridImage, 0, 0);
    this.populateGrid();
};

World.prototype.populateGrid = function() {
    var imageBuffer = new Uint32Array(this.context.getImageData(0, 0, this.IMAGE_WIDTH,
        this.IMAGE_HEIGHT).data.buffer);
    for (var i = 0; i < this.GRID_HEIGHT; i++) { // for each row
        var rowArray = [];
        for (var j = 0; j < this.GRID_WIDTH; j++) {
            var coords = this.getCoordsByIndex([i, j]);
            coords[0] += Math.floor(this.CELL_WIDTH / 2);
            coords[1] += Math.floor(this.CELL_HEIGHT / 4);
            rowArray.push(new Cell(CellType.getCellTypeByRGBA(imageBuffer[
                coords[0] + coords[1] * this.IMAGE_WIDTH])));
        }
        this.grid.addRow(rowArray);
    }
};

World.prototype.getCoordsByIndex = function(index) {
    var x = Math.floor(index[1] * this.CELL_WIDTH);
    var y = Math.floor(index[0] * this.CELL_HEIGHT);
    return [x, y];
};

World.prototype.render = function() {
    var coords = this.getCoordsByIndex(this.astar.currentCellIndex);
    this.context.drawImage(this.gridImage, 0, 0);
    this.context.drawImage(this.SeiyaImage,
        coords[0], coords[1] + 1);

    for (var i = 0; i < this.astar.openCellsIndexes.length; i++) {
        this.drawCrossOnIndex(this.astar.openCellsIndexes[i], "#00FF00");
        this.drawCost(this.astar.openCellsIndexes[i]);
    }
    for (var j = 0; j < this.astar.closedCellsIndexes.length; j++) {
        this.drawCrossOnIndex(this.astar.closedCellsIndexes[j], "#FF0000");
    }
    if (this.astar.path !== null) {
        for (var k = 0; k < this.astar.path.length; k++) {
            this.drawCrossOnIndex(this.astar.path[k], "#0000FF");
        }
    } else {
        var partialPath = this.astar.pathToIndex(this.astar.currentCellIndex);
        for (var l = 0; l < partialPath.length; l++) {
            this.drawCrossOnIndex(partialPath[l], "#0000FF");
        }
    }
    /* data for react */
    statusData = {
        'saints': this.saints,
        'position': this.astar.currentCellIndex,
        'steps': this.astar.steps,
    };
    renderStatus(statusData);
};

World.prototype.drawCost = function(index) {
    var coords = this.getCoordsByIndex(index);
    var cell = this.grid.getCellByIndex(index);
    coords[0] += this.GRID_WIDTH / 5;
    coords[1] += this.GRID_HEIGHT / 5;
    this.context.font = "8px monospace";
    this.context.fillText(cell.fCost, coords[0], coords[1]);
};

World.prototype.drawCrossOnIndex = function(index, color) {
    var coords = this.getCoordsByIndex(index);
    coords[0] += this.GRID_WIDTH / 4;
    coords[1] += this.GRID_HEIGHT / 4;
    this.context.beginPath();
    this.context.moveTo(coords[0], coords[1] - 5);
    this.context.lineTo(coords[0], coords[1] + 5);
    this.context.strokeStyle = color;
    this.context.stroke();
    this.context.moveTo(coords[0] - 5, coords[1]);
    this.context.lineTo(coords[0] + 5, coords[1]);
    this.context.strokeStyle = color;
    this.context.stroke();
};

World.prototype.astarEnd = function() {
    if (this.astar === null) {
        this.astar = new AStar(this.grid);
        this.astar.start();
    }
    while (this.astar.step() === null);
    this.render();
};

World.prototype.astarStep = function() {
    if (this.astar === null) {
        this.astar = new AStar(this.grid);
        this.astar.start();
    }
    this.astar.step();
    this.render();
};
