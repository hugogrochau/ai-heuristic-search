var SaintNode = function(cost, owner, house, energies, powers,
                         houseDifficulty) {
  this.cost = cost;                       // Accumulated cost
  this.owner = owner;                     // Parent node (NULL IF SUPERNODE)
  this.house = house;                     // Current house
  this.houseDifficulty = houseDifficulty; // Array of house difficulties
  this.energies = energies;               // Array of energies in this node
  this.powers = powers;                   // Array of powers used in this node
  this.possibilities = [];                // Array possible combination indexes
  this.combination = [];        // Combination indexes used in this node
  this.possibilityInUse = null; // Index of the current possibility in use
  currentNode = null;
};

SaintNode.prototype.hasEnergy = function(node) { // Checks if a node has energy
  for (var i = 0; i < node.energies.length; i++) {
    if (node.energies[i] > 1)
      return true;
  }
  return false;
};

SaintNode.prototype.calcEnergies = function(node, combination) {
  var energies = node.energies.slice(0); // Create a copy of energy array
  for (var i = 0; i < combination.length; i++) {
    energies[combination[i]]--;
  }
  return energies;
};

SaintNode.prototype.calculatePath = function(node) {
  var path = [ node ];
  while (node.owner.owner !== null) {
    path.push(node.owner);
    node = node.owner;
  }
  return path;
};

SaintNode.prototype.searchStep = function(currentNode, objHouse) {
  while (currentNode.possibilities.length !== 0 &&
         currentNode.house !== objHouse && currentNode.hasEnergy(currentNode)) {
    // Pega a melhor possibilidade
    var bestPossIndex = currentNode.getBestPossibility();
    var poss = currentNode.possibilities[bestPossIndex];

    // Remove a possibilidade do array de possibilidades
    currentNode.possibilities.splice(bestPossIndex, 1);

    // Acumula o custo
    var cost = currentNode.cost +
               currentNode.houseDifficulty[currentNode.house] /
                   currentNode.getPossibilityValue(poss);
    var newNode =
        new SaintNode(cost, currentNode, currentNode.house + 1,
                      currentNode.calcEnergies(currentNode, poss),
                      currentNode.powers, currentNode.houseDifficulty);
    newNode.combination = poss;
    newNode.possibilities = newNode.getNextHousePossibilities();
    currentNode = newNode;
  }

  if (currentNode.house == objHouse)
    return [ true, currentNode ];

  if (currentNode.possibilities.length === 0 ||
      !currentNode.hasEnergy(currentNode)) {
    return [ false, currentNode ];
  } else {
    return [ true, currentNode ];
  }
};

SaintNode.prototype.getPossibilityValue = function(
    possibility) { // Return the sum of powers of the heroes in this possibility
  var totalPower = 0;
  for (var i = 0; i < possibility.length; i++) {
    totalPower += this.powers[possibility[i]];
  }
  return totalPower;
};

SaintNode.prototype.getBestPossibility = function() { // Return the best
                                                      // possibility index from
                                                      // the possibilities array
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

SaintNode.prototype.getNextHousePossibilities =
    function() { // Get the possibilities that a node has
  var nextNodes = [];
  var saintsAvailable = this.energies.map(function(val, index, array) {
    return val > 1 ? index : -1;
  });
  saintsAvailable =
      saintsAvailable.filter(function(val) { return val !== -1; });

  return this.getCombinations(saintsAvailable);
};

SaintNode.prototype.getCombinations = function(
    nums) { // Get all the combinations that is possible
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
