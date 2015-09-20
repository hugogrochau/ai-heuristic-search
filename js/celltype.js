var CellType = {
    PLAIN: 0,
    MOUNTAIN: 1,
    ROCK: 2,
    START: 3,
    END: 4,
    HOUSE: 5
};

CellType.getCost = function(cellType) {
    switch (cellType) {
        case CellType.MOUNTAIN:
            return 200;
        case CellType.ROCK:
            return 5;
        case CellType.START:
            return Infinity;
        case CellType.END:
        case CellType.PLAIN:
            return 1;
        case CellType.HOUSE:
            return 0;
        default:
            return 1;
    }
};

CellType.getCellTypeByRGBA = function(data) {
    switch (data) {
        case 0xFFD9D9D9:
            return CellType.PLAIN;
        case 0xFF808080:
            return CellType.MOUNTAIN;
        case 0xFFBFBFBF:
            return CellType.ROCK;
        case 0xFF0000FF:
            return CellType.START;
        case 0xFF50B000:
            return CellType.END;
        default:
            return CellType.HOUSE;
    }
};
