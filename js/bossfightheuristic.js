var BossFightHeuristic = {};

BossFightHeuristic.solve =
    function(houseDifficulties, saintEnergies, saintPowers) {
        var bossHouses = [];
        var saints = [];

        saintEnergies.map(function(energy, i, arr) {
            var saint = new Saint(energy, saintPowers[i], i);
            saints.push(saint);
        });
        saints.sort(function(a, b) {
            return b.power - a.power;
        }); // sort saints in descending powers

        houseDifficulties.map(function(difficulty, i, arr) {
            bossHouses.push(new BossHouse(difficulty, i + 1));
        });
        bossHouses.sort(function(a, b) {
            return b.difficulty - a.difficulty;
        }); // sort houses in descending difficulty

        var i = 0;
        var currentSaint = null;
        while ((currentSaint = BossFightHeuristic.getMostPowerfulSaintAvailable(
                saints)) !== null) {
            bossHouses[i].saints.push(currentSaint.number);
            currentSaint.energy--;
            if (++i == bossHouses.length) {
                i = 0;
            }
        }
        bossHouses.sort(function(a, b) {
            return a.number - b.number;
        }); // sort houses by number in ascending order
        return bossHouses;
    }

function BossHouse(difficulty, number) {
    this.difficulty = difficulty;
    this.number = number;
    this.saints = [];
}

function Saint(energy, power, number) {
    this.energy = energy;
    this.number = number;
    this.power = power;
}

BossFightHeuristic.getMostPowerfulSaintAvailable = function(saints) {
    var mostPowerfulSaint = null;
    var numSaintsAvailable = 0;
    saints.map(function(saint) {
        if (saint.energy > 0) {
            numSaintsAvailable++;
            if (mostPowerfulSaint === null) {
                mostPowerfulSaint = saint;
            } else {
                mostPowerfulSaint =
                    saint.power > mostPowerfulSaint.power ? saint :
                    mostPowerfulSaint;
            }
        }
    });
    if (numSaintsAvailable === 1 && mostPowerfulSaint.energy === 1) { // last saint alive
        return null;
    }
    return mostPowerfulSaint;
}
