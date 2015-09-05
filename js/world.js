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
    this.timeElapsed = 0;
    this.position = null;
    this.loadImages();
}

World.prototype.init = function() {
    this.initGrid();
    this.position = this.grid.getStart();
    this.render();
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

World.prototype.getCoordsByIndex = function(i, j) {
    var x = Math.floor(i * this.CELL_WIDTH);
    var y = Math.floor(j * this.CELL_HEIGHT);
    return [x, y];
};

World.prototype.render = function() {
    var coords = this.getCoordsByIndex(this.position[0], this.position[1]);
    this.context.drawImage(this.gridImage, 0, 0);
    this.context.drawImage(this.SeiyaImage,
        coords[0], coords[1] + 1);
    statusData = {
        'saints': this.saints,
        'position': this.position,
        'timeElapsed': this.timeElapsed
    };
    renderStatus(statusData);
};
