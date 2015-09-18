function AStar(grid) {
    this.grid = grid;
    this.openCellsIndexes = [];
    this.closedCellsIndexes = [];
    this.currentCellIndex = [];
    this.path = null;
    this.steps = 0;
}

AStar.prototype.pathToEnd = function() {
    var end = this.grid.getEnd();
    this.path = this.pathToIndex(end);
    return this.path;
};

AStar.prototype.pathToIndex = function(index) {
    var totalPath = [index];
    var parentIndex = this.grid.getCellByIndex(index).parentCellIndex;
    if (parentIndex === null) {
        return totalPath;
    }
    var parentCell = this.grid.getCellByIndex(parentIndex);
    while (parentCell !== null) {
        totalPath.push(parentIndex);
        parentIndex = parentCell.parentCellIndex;
        if (parentIndex === null) {
            break;
        }
        parentCell = this.grid.getCellByIndex(parentIndex);
    }
    return totalPath;
};

AStar.prototype.calculateManhattan = function(index) {
    var end = this.grid.getEnd();
    var idir = Math.abs(end[0] - index[0]);
    var jdir = Math.abs(end[1] - index[1]);
    return idir + jdir;
};

AStar.prototype.getLowestFCostCell = function(cells) {
    var minCell = this.grid.getCellByIndex(cells[0]);
    var index = 0;
    for (var i = 0; i < cells.length; i++) {
        var cell = this.grid.getCellByIndex(cells[i]);
        if (cell.fCost < minCell.fCost) {
            minCell = cell;
            index = i;
        }
    }
    return cells[index];
};

AStar.prototype.start = function() {
    var start = this.grid.getStart();
    var end = this.grid.getEnd();
    this.openCellsIndexes = [start];
    this.grid.getCellByIndex(start).gCost = 0;
};

AStar.prototype.step = function() {
    if (this.openCellsIndexes.length <= 0) { // if there are no more opened cells
        return [];
    }
    if (this.path !== null) {
        return this.path;
    }
    var end = this.grid.getEnd();

    this.steps++;

    this.currentCellIndex = this.getLowestFCostCell(this.openCellsIndexes); // Get the lowest f-value from opened nodes
    var currentCell = this.grid.getCellByIndex(this.currentCellIndex);

    if (end[0] === this.currentCellIndex[0] && end[1] === this.currentCellIndex[
            1]) { // Found completed path
        return this.pathToEnd();
    }

    this.openCellsIndexes.splice(this.grid.findCellIndexFromArray(
            this.openCellsIndexes,
            this.currentCellIndex),
        1); // remove current cell from open cells list

    this.closedCellsIndexes.push(this.currentCellIndex); // add current cell to closed cells list

    var neighbors = this.grid.getNeighbors(this.currentCellIndex); // get neighbors
    for (var i = 0; i < neighbors.length; i++) {
        var neighborIndex = neighbors[i];
        var neighborCell = this.grid.getCellByIndex(neighborIndex);
        if (this.grid.findCellIndexFromArray(this.closedCellsIndexes,
                neighborIndex) !=
            -1) { // if neighbor is in the closed set
            continue;
        }
        var effectiveGCost = currentCell.gCost + CellType.getCost(
            neighborCell.type);
        //    console.log("EffectiveGCost : " + effectiveGCost.toString());
        if (this.grid.findCellIndexFromArray(this.openCellsIndexes,
                neighborIndex) !==
            -1 || neighborCell.gCost === Infinity || effectiveGCost <
            neighborCell.gCost) { // if neighbor is in the opened set or if its cost is infinite
            neighborCell.parentCellIndex = this.currentCellIndex;
            neighborCell.gCost = effectiveGCost;
            neighborCell.fCost = effectiveGCost + this.calculateManhattan(
                neighborIndex);
            //        console.log("Manhattan : " + this.calculateManhattan(
            //            neighborIndex).toString());
            //        console.log(neighborCell.fCost);
            if (this.grid.findCellIndexFromArray(this.openCellsIndexes,
                    neighborIndex) ==
                -1) {
                this.openCellsIndexes.push(neighborIndex);
            }
        }
    }
    return null;
};
