function Grid(width, height) {
    this.cells = [];

    this.CellType = {
        PLAIN: 0,
        MOUNTAIN: 1,
        ROCK: 2,
        START: 3,
        END: 4,
        HOUSE: 5
    };

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
            if (this.cells[i][j] == this.CellType.START) {
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
            if (this.cells[i][j] == this.CellType.END) {
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
            return this.CellType.PLAIN;
        case 128:
            return this.CellType.MOUNTAIN;
        case 191:
            return this.CellType.ROCK;
        case 255:
            return this.CellType.START;
        case 0:
            return this.CellType.END;
        default:
            return this.CellType.HOUSE;
    }
};
