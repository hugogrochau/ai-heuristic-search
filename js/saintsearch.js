var SaintSearch = function(numSaints, powers, energies, numHouses, houseCosts) {
    this.powers = powers;
    this.energies = energies;
    this.numSaints = numSaints;
    this.numHouses = numHouses;
    this.houseCosts = houseCosts;
    this.openNodes = [new SaintSearchNode(energies, [], null, 0, 0)];
    this.closedNodes = [];
    this.path = null;
};

var SaintSearchNode = function(energies, saintsUsed, parentNode, cost, house) {
    this.parentNode = parentNode;
    this.energies = energies;
    this.saintsUsed = saintsUsed;
    this.cost = cost;
    this.house = house;
};

SaintSearch.prototype.step = function() {
    if (this.openNodes.length === 0) {
        return false;
    }
    var removedNode = this.openNodes.splice(this.getBestNode(this.openNodes),
        1)[0];
    if (removedNode.house == this.numHouses) {
        return this.calculatePath(removedNode);
    }
    this.closedNodes.push(removedNode);

    var nextNodes = this.getNextHousePossibilities(removedNode);
    for (var i = 0; i < nextNodes.length; i++) {
        var indexInClosed = this.closedNodes.indexOf(nextNodes[i]);
        var indexInOpen = this.openNodes.indexOf(nextNodes[i]);
        if (indexInClosed === -1 && indexInOpen === -1) {
            this.openNodes.push(nextNodes[i]);
        }
    }
    return true;
};

SaintSearch.prototype.calculatePath = function(node) {
    var currentNode = node;
    var path = [];
    do {
        path.push(currentNode);
        currentNode = currentNode.parentNode;
    } while (currentNode.parentNode !== null); // we don't want the epoch node
    this.path = path;
    return path;
};

SaintSearch.prototype.getBestNode = function(nodes) {
    var minNode = nodes[0];
    var index = 0;
    for (var i = 1; i < nodes.length; i++) {
        if (nodes[i].cost < minNode.cost) {
            minNode = nodes[i];
            index = i;
        }
    }
    return index;
};

SaintSearch.prototype.getNextHousePossibilities = function(node) {
    var nextNodes = [];
    var saintsAvailable = node.energies.map(function(val, index, array) {
        return val > 1 ? index : -1;
    });
    saintsAvailable = saintsAvailable.filter(function(val) {
        return val !== -1;
    });
    var possibleCombinations = this.getCombinations(saintsAvailable);
    for (var i = 0; i < possibleCombinations.length; i++) {
        var energies = node.energies.slice(0);
        var combination = possibleCombinations[i];
        for (var j = 0; j < combination.length; j++) { /* saint indexes */
            energies[j]--;
        }
        nextNodes.push(new SaintSearchNode(energies, combination, node, (
                node.cost + this.getHouseCost(combination, node.house +
                    1)) / (node.house + 1),
            node.house +
            1));
    }
    return nextNodes;
};

SaintSearch.prototype.getHouseCost = function(combination, house) {
    var totalPower = 0;
    for (var i = 0; i < combination.length; i++) {
        totalPower += this.powers[combination[i]];
    }
    return this.houseCosts[house - 1] / totalPower;
};


SaintSearch.prototype.getCombinations = function(nums) {
    var result = [];
    var f = function(prefix, nums) {
        for (var i = 0; i < nums.length; i++) {
            result.push(prefix.concat(nums[i]));
            f(prefix.concat(nums[i]), nums.slice(i + 1));
        }
    };
    f([], nums);
    return result;
};
