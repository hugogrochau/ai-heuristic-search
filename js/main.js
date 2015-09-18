/* debug methods */

function as() {
	var astar = new AStar(world.grid);
	astar.start();
	return astar;
}

var world = new World();

document.getElementById("take-energy").addEventListener('click', function() {
	world.saints[0].useEnergy();
	world.render();
});

document.getElementById("astar-step").addEventListener('click', function() {
	world.astarStep();
});

document.getElementById("astar-10step").addEventListener('click', function() {
	for (var i = 0; i < 10; i++) world.astarStep();
});

document.getElementById("astar-end").addEventListener('click', function() {
	world.astarEnd();
});
