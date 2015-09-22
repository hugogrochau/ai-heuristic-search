/* global methods */
function calcEffectiveCost(houseCost, indexes, powers) {
    var totalPowers = 0;
    for (var i = 0; i < indexes.length; i++) {
        totalPowers += powers[indexes[i]];
    }
    return houseCost / totalPowers;
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
