function Grid(width, height) {
    this.cells = [];

    this.width = width;
    this.height = height;

    this.start = null;
    this.end = null;
}

Grid.prototype.getStart = function() {
    if (this.start !== null) {
        return this.start;
    }
    for (var i = 0; i < this.height; i++) {
        for (var j = 0; j < this.width; j++) {
            if (this.cells[i][j].type == CellType.START) {
                this.start = [i, j];
                return [i, j];
            }
        }
    }
};

Grid.prototype.findCellIndexFromArray = function(arr, ele) {
    for (i = 0; i < arr.length; i++) {
        if (ele[0] === arr[i][0] && ele[1] == arr[i][1]) {
            return i;
        }
    }
    return -1;
};

Grid.prototype.getCellByIndex = function(index) {
    if (index[0] < 0 || index[0] >= this.height || index[1] < 0 ||
        index[1] >= this.width) {
        return null;
    }
    return this.cells[index[0]][index[1]];
};

Grid.prototype.getEnd = function() {
    if (this.end !== null) {
        return this.end;
    }
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            if (this.cells[i][j].type == CellType.END) {
                this.end = [i, j];
                return [i, j];
            }
        }
    }
};

Grid.prototype.addRow = function(row) {
    this.cells.push(row);
};

Grid.prototype.getNeighbors = function(elem) {
    var dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];
    var neighbors = [];

    for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i];
        var iidx = elem[0] + dir[0];
        var jidx = elem[1] + dir[1];
        if ((0 <= iidx && iidx < this.height) && (0 <= jidx && jidx <
                this.width))
            neighbors.push([iidx, jidx]);
    }
    return neighbors;
};

Grid.prototype.getCellTypeByRGBA = function(data) {
    switch (data[0]) {
        case 217:
            return CellType.PLAIN;
        case 128:
            return CellType.MOUNTAIN;
        case 191:
            return CellType.ROCK;
        case 255:
            return CellType.START;
        case 0:
            return CellType.END;
        default:
            return CellType.HOUSE;
    }
};
