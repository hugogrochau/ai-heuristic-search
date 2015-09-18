function Cell(cellType) {
	this.fCost = Infinity;
	this.gCost = Infinity;
	this.parentCellIndex = null;
	this.type = cellType;
}
