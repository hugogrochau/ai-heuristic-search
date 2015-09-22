/* global methods */
function calcEffectiveCost(houseCost, indexes, powers) {
    var totalPowers = 0;
    for (var i = 0; i < indexes.length; i++) {
        totalPowers += powers[indexes[i]];
    }
    return houseCost / totalPowers;
}

function timeAlgorithms() {
    console.log("Timing A*");
    var tmp = world.render;
    var beforeTimestamp = Date.now();
    world.render = function() {};
    world.astarEnd();

    console.log("A* took " + (Date.now() - beforeTimestamp) + "ms");
    console.log("Timing Boss Fight Heuristic");
    beforeTimestamp = Date.now();
    world.saintSearch();
    console.log("Boss Fight Heuristic took " + (Date.now() -
        beforeTimestamp) + "ms");
    world.render = tmp;
}

var world = new World();

document.getElementById("astar-step")
    .addEventListener('click', function() {
        world.astarStep();
    });

document.getElementById("astar-10step")
    .addEventListener('click', function() {
        for (var i = 0; i < 10; i++)
            world.astarStep();
    });

document.getElementById("astar-end")
    .addEventListener('click', function() {
        world.astarEnd();
    });

document.getElementById("saints-combination")
    .addEventListener('click', function() {
        world.saintSearch();
    });
