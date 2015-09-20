var SaintSearch = function(numSaints, powers, energies, numHouses, houseCosts) {
    this.powers = powers;
    this.energies = energies;
    this.numSaints = numSaints;
    this.numHouses = numHouses;
    this.houseCosts = houseCosts;
    this.openNodes = [new SaintSearchNode(energies, [], 0)];
    this.openNodes[0].gCost = 0;
    this.openNodes[0].fCost = 0;
    this.closedNodes = [];
    this.path = null;
    this.averageHouseCosts = this.houseCosts.reduce(function(a, b) {
        return a + b;
    }) / this.houseCosts.length;
};

var SaintSearchNode = function(energies, saintsUsed, house) {
    this.parentNode = null;
    this.energies = energies;
    this.saintsUsed = saintsUsed;
    this.gCost = Infinity;
    this.fCost = Infinity;
    this.house = house;
};

SaintSearch.prototype.step = function() {
    if (this.openNodes.length === 0) {
        return false;
    }
    var removedNode = this.openNodes.splice(this.getBestFNode(this.openNodes),
        1)[0]; //Get lowest cost from opened nodes

    if (removedNode.house === this.numHouses) {
        return this.calculatePath(removedNode);
    }

    this.closedNodes.push(removedNode); //Add lowest fCost to the closed list

    var nextNodes = this.getNextHousePossibilities(removedNode); //Neighbors from the node

    for (var i = 0; i < nextNodes.length; i++) {
        var n = nextNodes[i];
        var tentativeGCost = removedNode.gCost + this.getHouseCost(n.saintsUsed,
            n.house);
        var closedNodesIndex = this.closedNodes.indexOf(n);
        var openNodesIndex = this.openNodes.indexOf(n);

        if (closedNodesIndex !== -1) {
            continue;
        }

        var tentativeGCostIsBest = false;
        if (openNodesIndex === -1) {
            tentativeGCostIsBest = true;
            this.openNodes.push(n);
        } else if (tentativeGCost < n.gCost) {
            tentativeGCostIsBest = true;
        }
        if (tentativeGCostIsBest) {
            n.parentNode = removedNode;
            n.gCost = tentativeGCost;
            n.fCost = tentativeGCost / n.house;
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

SaintSearch.prototype.getBestFNode = function(nodes) {
    var minNode = nodes[0];
    var index = 0;
    for (var i = 1; i < nodes.length; i++) {
        if (nodes[i].fCost < minNode.fCost) {
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
        var energies = node.energies.slice(0); // copying
        var combination = possibleCombinations[i];
        for (var j = 0; j < combination.length; j++) { /* saint indexes */
            energies[combination[j]]--;
        }
        nextNodes.push(new SaintSearchNode(energies, combination, node.house +
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
