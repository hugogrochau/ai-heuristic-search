/* debug methods */

function drawCross(x, y, context) {
	context.beginPath();
	context.moveTo(x, y - 5);
	context.lineTo(x, y + 5);
	context.strokeStyle = '#ff0000';
	context.stroke();
	context.moveTo(x - 5, y);
	context.lineTo(x + 5, y);
	context.strokeStyle = '#ff0000';
	context.stroke();
}

var world = new World();

document.getElementById("take-energy").addEventListener('click', function() {
	world.saints[0].useEnergy();
	world.render();
});
