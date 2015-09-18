var xlen = -1;
var ylen = -1;
var graph;

var btnGen = document.getElementById("btnGen");
btnGen.addEventListener("click", genValues);

var btnNeighbor = document.getElementById("btnNeighbor");
btnNeighbor.addEventListener("click", genNeighbors);


var Node = function(posy, posx) {
    this.posy = posy;
    this.posx = posx;
    this.fcost = -1;
    this.gcost = -1;
    this.parentNode = null;
};

function getNode(y, x) {
    var idx = y * (xlen) + x;
    return graph[idx];
}

function createGraph(xSize, ySize) {
    var graph = [];
    for (var y = 0; y < ySize; y++) {
        for (var x = 0; x < xSize; x++) {
            graph.push(new Node(y, x));
        }
    }
    xlen = xSize;
    ylen = ySize;
    return graph;
}

function getNeighbors(node) {
    var dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];
    var result = [];

    for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i];
        var xidx = node.posx + dir[1];
        var yidx = node.posy + dir[0];
        if ((0 <= yidx && yidx < ylen) && (0 <= xidx && xidx < xlen))
            result.push(getNode(yidx, xidx));
    }

    return result;
}

function manhattan_cost(source, goal) {
    var x = Math.abs(goal[1] - source[1]);
    var y = Math.abs(goal[0] - source[0]);
    return x + y;
}

function getLowest(arr) {
    var low = arr[0];
    for (var i = 1; i < arr.length; i++) {
        var elem = arr[i];
        if (elem.fcost < low.fcost)
            low = elem;
    }
    return low;
}

function myfindnode(arr, node) {
    var idx = -1;
    for (var i = 0; i < arr.length; i++) {
        var elem = arr[i];
        if (elem.posx == node.posx && elem.posy == node.posy) {
            idx = i;
            break;
        }
    }
    return idx;
}

function remove(arr, node) {
    var idx = myfindnode(arr, node);
    arr.splice(idx, 1);
    return node;
}

function asearch(source, goal) {
    var open = [];
    var close = [];
    var steps = 0;
    open.push(source);
    source.gcost = 0;
    while (open.length > 0) { //enquanto tiver node a ser explorado
        steps++;
        var current = getLowest(open); //Escolhe aquele que tem o menor valor F do array a ser explorado
        if (current.posx == goal.posx && current.posy == goal.posy) {
            console.log("Found in " + steps.toString() + " steps");
            return pathto(goal);
        }
        remove(open, current);
        close.push(current);
        var neighbors = getNeighbors(current);
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (myfindnode(close, neighbor) != -1) { //neighbor esta no closed set {
                continue;
            }

            var tmpg = current.gcost + 1; //custo do corrente + 1 do custo do movimento
            if (myfindnode(open, neighbor) != -1 || neighbor.gcost == -1 ||
                tmpg < neighbor.gcost) {
                neighbor.parentNode = current;
                neighbor.gcost = tmpg;
                neighbor.fcost = neighbor.gcost + manhattan_cost(neighbor, goal);
                if (myfindnode(open, neighbor) == -1) {
                    open.push(neighbor);
                }
            }
        }
    }
    return [];
}

function pathto(node) {
    var total_path = [node];
    var parent = node.parentNode;
    while (parent !== null) {
        total_path.push(parent);
        parent = parent.parentNode;
    }
    return total_path;
}

function genValues() {
    var txtArea = document.getElementById("txtArea");
    var edtXLen = document.getElementById("edtXLen");
    var edtYLen = document.getElementById("edtYLen");
    var xSize = parseInt(edtXLen.value);
    var ySize = parseInt(edtYLen.value);
    graph = createGraph(xSize, ySize);
    txtArea.innerHTML = "";
    for (var i = 0; i < ySize; i++) {
        for (var j = 0; j < xSize; j++) {
            var e = getNode(j, i);
            var elem = [e.posy, e.posx];
            txtArea.innerHTML = txtArea.innerHTML + " " + getFormat(elem);
        }
        txtArea.innerHTML = txtArea.innerHTML + "\n";
    }
}

function getFormat(node) {
    return "[" + node[0] + "," + node[1] + "]";
}

function genNeighbors() {
    var txtArea = document.getElementById("txtAreaNeighbor");
    var y = parseInt(document.getElementById("edtY").value);
    var x = parseInt(document.getElementById("edtX").value);
    var idx = y * (xlen) + x;
    var neighbors = getNeighbors(graph[idx]);
    txtArea.innerHTML = "";
    for (var i = 0; i < neighbors.length; i++) {
        var e = neighbors[i];
        var elem = [e.posy, e.posx];
        txtArea.innerHTML = txtArea.innerHTML + getFormat(elem) + "\n";
    }
}
