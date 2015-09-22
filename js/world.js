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
    this.gridImage = new Image();
    this.seiyaImage = new Image();

    this.grid = new Grid(this.GRID_WIDTH, this.GRID_HEIGHT);

    this.saintPowers = [1.5, 1.4, 1.3, 1.2, 1.2];
    this.saintNames = ["Seiya", "Shiryu", "Hyoga", "Shun", "Ikki"];
    this.saintEnergies = [5, 5, 5, 5, 5];
    this.houseCosts = [120, 110, 100, 95, 90, 85, 80, 75, 70, 60, 55, 50];
    this.saintSearchDuration = -1;
    this.saintCombinations = null;

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
        that.seiyaImage.src = 'images/seiya.png';
        that.seiyaImage.onload = function() {
            that.init();
        };
    };
};

World.prototype.initGrid = function() {
    this.context.drawImage(this.gridImage, 0, 0);
    this.populateGrid();
};

World.prototype.populateGrid = function() {
    var imageBuffer = new Uint32Array(
        this.context.getImageData(0, 0, this.IMAGE_WIDTH, this.IMAGE_HEIGHT)
        .data.buffer);
    for (var i = 0; i < this.GRID_HEIGHT; i++) { // for each row
        var rowArray = [];
        for (var j = 0; j < this.GRID_WIDTH; j++) {
            var coords = this.getCoordsByIndex([i, j]);
            coords[0] += Math.floor(this.CELL_WIDTH / 2);
            coords[1] += Math.floor(this.CELL_HEIGHT / 4);
            rowArray.push(new Cell(CellType.getCellTypeByRGBA(
                imageBuffer[coords[0] + coords[1] * this.IMAGE_WIDTH]
            )));
        }
        this.grid.addRow(rowArray);
    }
};

World.prototype.getCoordsByIndex = function(index) {
    var x = Math.floor(index[1] * this.CELL_WIDTH);
    var y = Math.floor(index[0] * this.CELL_HEIGHT);
    return [x, y];
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
    while (this.astar.step() === true)
    ;
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

World.prototype.saintSearch = function() {
    var beforeTimestamp = (new Date()).getTime();
    var numberOfHouses = this.houseCosts.length;
    var superNode = new SaintNode(0, null, 0, this.saintEnergies,
        this.saintPowers, this.houseCosts);
    superNode.possibilities = superNode.getNextHousePossibilities();
    var currentNode = superNode;
    if (superNode.possibilities.length === 0) {
        console.log("No path found");
        return [];
    }
    var searchStepResult = superNode.searchStep(currentNode, 12);
    while (searchStepResult[0] === false) {
        currentNode = searchStepResult[1].owner;
        if (currentNode === null) { // NAO ENCONTROU NINGUEM
            return [];
        }
        searchStepResult = superNode.searchStep(currentNode, 12);
    }

    currentNode = searchStepResult[1];

    this.saintSearchDuration = (new Date()).getTime() - beforeTimestamp;
    this.saintCombinations = superNode.calculatePath(currentNode);
    this.render();
    return this.saintCombinations;
};

World.prototype.render = function() {
    var pathFindData = null;
    if (this.astar !== null) {
        var coords = this.getCoordsByIndex(this.astar.currentCellIndex);
        var pathLength = 0;
        this.context.drawImage(this.gridImage, 0, 0);
        this.context.drawImage(this.seiyaImage, coords[0], coords[1] + 1);

        for (var i = 0; i < this.astar.openCellsIndexes.length; i++) {
            this.drawCrossOnIndex(this.astar.openCellsIndexes[i], "#00FF00");
            this.drawCost(this.astar.openCellsIndexes[i]);
        }
        for (var j = 0; j < this.astar.closedCellsIndexes.length; j++) {
            this.drawCrossOnIndex(this.astar.closedCellsIndexes[j],
                "#FF0000");
        }
        if (this.astar.path !== null) {
            for (var k = 0; k < this.astar.path.length; k++) {
                this.drawCrossOnIndex(this.astar.path[k], "#0000FF");
            }
            pathLength = this.astar.path.length;
        } else {
            var partialPath = this.astar.pathToIndex(this.astar.currentCellIndex);
            for (var l = 0; l < partialPath.length; l++) {
                this.drawCrossOnIndex(partialPath[l], "#0000FF");
            }
            pathLength = partialPath.length;
        }
        /* data for react */
        pathFindData = {
            'saints': this.saints,
            'position': this.astar.currentCellIndex,
            'steps': this.astar.steps,
            'pathSize': pathLength,
            'pathCost': this.grid.getCellByIndex(this.astar.currentCellIndex)
                .gCost
        };
    }

    var bossFightData = {
        'saintNames': this.saintNames,
        'houseCosts': this.houseCosts,
        'duration': this.saintSearchDuration,
        'totalCost': this.saintCombinations[0].cost,
        'nodes': this.saintCombinations
    };
    renderStatus(pathFindData, bossFightData);
};
