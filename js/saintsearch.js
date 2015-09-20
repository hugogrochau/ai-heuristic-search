var SaintNode = function(cost, owner, house, energies, powers, houseDifficulty) {
    this.cost = cost; //Accumulated cost
    this.owner = owner; //Parent node (NULL IF SUPERNODE)
    this.house = house; //Current house
    this.houseDifficulty = houseDifficulty; // Array of house difficulties
    this.energies = energies; //Array of energies in this node
    this.powers = powers; //Array of powers used in this node
    this.possibilities = []; //Array possible combination indexes
    this.combination = []; //Combination indexes used in this node
    this.possibilityInUse = null; //Index of the current possibility in use
    this.currentNode = null;
};

SaintNode.prototype.hasEnergy = function(node) { //Checks if a node has energy
    for (var i = 0; i < node.energies.length; i++) {
        if (node.energies[i] > 1)
            return true;
    }
    return false;
};

SaintNode.prototype.calcEnergies = function(node, combination) {
    var energies = node.energies.slice(0); //Create a copy of energy array
    for (var i = 0; i < combination.length; i++) {
        energies[combination[i]]--;
    }
    return energies;
};

SaintNode.prototype.search = function(objHouse) {
    //1 Passo
    var energies = [5, 5, 5, 5, 5];
    var powers = [1.5, 1.4, 1.3, 1.2, 1.1];
    var houseDifficulty = [120, 110, 100, 95, 90, 85, 80, 75, 70, 60, 55,
        50
    ];
    var superNode = new SaintNode(0, null, 0, energies, powers,
        houseDifficulty);
    superNode.possibilities = superNode.getNextHousePossibilities();
    this.currentNode = superNode;


    if (superNode.possibilities.length === 0) {
        console.log("There is no possibility. Exiting function");
        console.log("No path found");
        return [];
    }
    while (this.searchStep(this.currentNode, objHouse) === false) {
        this.currentNode = this.currentNode.owner;
        if (this.currentNode === null) { //NAO ENCONTROU NINGUEM
            return [];
        }
    }
    return this.calculatePath(this.currentNode);
};

SaintNode.prototype.calculatePath = function(node) {
    var path = [node];
    while (node.owner.owner !== null) {
        path.push(node.owner);
        node = node.owner;
    }
    return path;
};


SaintNode.prototype.searchStep = function(currentNode, objHouse) {
    while (this.currentNode.possibilities.length !== 0 && this.currentNode
        .house !==
        objHouse && this.currentNode.hasEnergy(this.currentNode)) {
        //Pega a melhor possibilidade
        var bestPossIndex = this.currentNode.getBestPossibility();
        var poss = this.currentNode.possibilities[bestPossIndex];

        //Remove a possibilidade do array de possibilidades
        this.currentNode.possibilities.splice(bestPossIndex, 1);

        //Acumula o custo
        var cost = this.currentNode.cost + this.currentNode.houseDifficulty[
            this.currentNode.house] / this.currentNode.getPossibilityValue(
            poss);
        var newNode = new SaintNode(cost, this.currentNode, this.currentNode
            .house +
            1,
            this.currentNode.calcEnergies(this.currentNode,
                poss),
            this.currentNode
            .powers,
            this.currentNode.houseDifficulty);
        newNode.combination = poss;
        newNode.possibilities = newNode.getNextHousePossibilities();
        this.currentNode = newNode;
    }

    if (this.currentNode.house == objHouse)
        return true;

    if (this.currentNode.possibilities.length === 0 || !this.currentNode
        .hasEnergy(
            this.currentNode)) {
        return false;
    } else {
        return true;
    }
};

SaintNode.prototype.getPossibilityValue = function(possibility) { //Return the sum of powers of the heroes in this possibility
    var totalPower = 0;
    for (var i = 0; i < possibility.length; i++) {
        totalPower += this.powers[possibility[i]];
    }
    return totalPower;
};

SaintNode.prototype.getBestPossibility = function() { //Return the best possibility index from the possibilities array
    var bestP = this.possibilities[0];
    var bestPPower = this.getPossibilityValue(bestP);
    var bestPIndex = 0;
    for (var i = 1; i < this.possibilities.length; i++) {
        var possibility = this.possibilities[i];
        var possibilityPower = this.getPossibilityValue(possibility);
        if (possibilityPower > bestPPower) {
            bestP = this.possibilities[i];
            bestPPower = possibilityPower;
            bestPIndex = i;
        }
    }
    return bestPIndex;
};

SaintNode.prototype.getNextHousePossibilities = function() { //Get the possibilities that a node has
    var nextNodes = [];
    var saintsAvailable = this.energies.map(function(val, index,
        array) {
        return val > 1 ? index : -1;
    });
    saintsAvailable = saintsAvailable.filter(function(val) {
        return val !== -1;
    });

    return this.getCombinations(saintsAvailable);
};

SaintNode.prototype.getCombinations = function(nums) { //Get all the combinations that is possible
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
