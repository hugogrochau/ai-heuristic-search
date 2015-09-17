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
    for (i = 0; i < this.width; i++) {
        for (j = 0; j < this.height; j++) {
            if (this.cells[i][j] == CellType.START) {
                this.start = [i, j];
                return [i, j];
            }
        }
    }
};

Grid.prototype.getEnd = function() {
    if (this.end !== null) {
        return this.end;
    }
    for (i = 0; i < this.width; i++) {
        for (j = 0; j < this.height; j++) {
            if (this.cells[i][j] == CellType.END) {
                this.end = [i, j];
                return [i, j];
            }
        }
    }
};

Grid.prototype.addRow = function(row) {
    this.cells.push(row);
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
