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
    this.seyaImage = new Image();
}

World.prototype.init = function() {
    this.initGrid();

};

World.prototype.initGrid = function() {
    this.gridImage.crossOrigin = 'anonymous';
    this.gridImage.src = 'images/grid.png';
    var that = this;
    this.gridImage.onload = function() {
        that.context.drawImage(that.gridImage, 0, 0);
        that.populateGrid();
        that.placeSeya();
        console.log(that.grid);
    };
};

World.prototype.populateGrid = function() {
    for (i = 0; i < this.GRID_HEIGHT; i++) { // for each row
        var rowArray = [];
        var y = i * this.CELL_HEIGHT + this.CELL_HEIGHT / 4;
        y = Math.floor(y);
        for (j = 0; j < this.GRID_WIDTH; j++) {
            var x = j * this.CELL_WIDTH + this.CELL_WIDTH / 2;
            x = Math.floor(x);
            rowArray.push(this.grid.getCellTypeByRGBA(this.context.getImageData(
                x,
                y,
                1, 1).data));
            // drawCross(x, y, context);
        }
        this.grid.addRow(rowArray);
    }
};

World.prototype.placeSeya = function() {
    this.seyaImage.src = 'images/seya.png';
    var that = this;
    this.seyaImage.onload = function() {
        var index = that.grid.getStart();
        var coords = that.getCoordsByIndex(index[0], index[1]);
        console.log(coords);
        that.context.drawImage(that.seyaImage,
            coords[0], coords[1] + 1);
    };
};

World.prototype.getCoordsByIndex = function(i, j) {
    var x = Math.floor(i * this.CELL_WIDTH);
    var y = Math.floor(j * this.CELL_HEIGHT);
    return [x, y];
};
