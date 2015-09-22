var PathFindStatus = React.createClass({
    render: function() {
        return (
            <div className="panel panel-primary" id="path-find-status">
                <div className="panel-heading">
                    <h2 className="panel-title">Path Find Status</h2>
                </div>
                <div className="panel-body">
                    <span>Steps: {this.props.data.steps}</span> < br />
                    <span>Path Size: {this.props.data.pathSize}</span> < br />
                    <span>Path Cost: {this.props.data.pathCost}</span> < br />
                    <span>Current Position: {this.props.data.position[0]}, {this.props.data.position[1]}</span>
                </div>
            </div>
        );
    }
});


var BossFightStatus = React.createClass({
    render: function() {
        return (
            <div className="panel panel-primary" id="boss-fight-status">
                <div className="panel-heading">
                    <h2 className="panel-title">Boss Fight Status</h2>
                </div>
                <div className="panel-body">
                    <span>Duration: {this.props.data.duration}ms</span> <br />
                    <span>Total Boss Fight Cost: {this.props.data.totalCost}</span> <br />
                    <BossFightTable data={this.props.data}/>
                </div>
            </div>
        );
    }
});


var BossFightTable = React.createClass({
    render: function() {
        var fightRows = [];
        var numberOfHouses = this.props.data.houseCosts.length;
        for (var i = 0; i < this.props.data.houseCosts.length; i++) {
                fightRows.push(<BossFightRow houseNumber = {i+1} houseCost = {this.props.data.houseCosts[numberOfHouses - 1 - i]} node = {this.props.data.nodes[i]} names = {this.props.data.saintNames} />);
        }
        return (
            <div id="boss-fight-table">
                <h2>Boss Fights</h2>
                <table className="table table-striped" id="energy-table">
                    <tr>
                        <th>
                            House Number
                        </th>
                        <th>
                            House Difficulty
                        </th>
                        <th>
                            Combination
                        </th>
                        <th>
                            Effective Cost
                        </th>
                    </tr>
                    {fightRows}
                </table>
            </div>);
    }
});

function calcEffectiveCost(houseCost, indexes, powers) {
    var totalPowers = 0;
    for (var i = 0; i < indexes.length; i++) {
        totalPowers += powers[indexes[i]];
    }
    return Math.round(houseCost / totalPowers);
}

var BossFightRow = React.createClass({
    render: function() {
        var saints = [];
        for (var i = 0; i < this.props.node.combination.length; i++) {
            var saintIndex = this.props.node.combination[i];
            saints.push(<Saint name = {this.props.names[saintIndex]} power = {this.props.node.powers[saintIndex]} energyLeft = {this.props.node.energies[saintIndex]}/>);
        }
        return (
            <tr>
                <td>{this.props.houseNumber}</td>
                <td>{this.props.houseCost}</td>
                <td>{saints}</td>
                <td>{calcEffectiveCost(this.props.houseCost, this.props.node.combination, this.props.node.powers)}</td>
            </tr>
        );
    }
});

var Saint = React.createClass({
    render: function() {
        return (
            <div class="saint">
                <span>Name: {this.props.name} </span>
                <span>Power: {this.props.power} </span>
                <span>Energy Left: {this.props.energyLeft} </span>
            </div>
        );
    }
});

function renderStatus(pathFindData, bossFightData) {
    if (pathFindData !== null) {
        React.render(<PathFindStatus data={pathFindData} />, document.getElementById("path-status"));
    }
    if (bossFightData.nodes !== null) {
        React.render(<BossFightStatus data={bossFightData} />, document.getElementById("boss-status"));
    }
}
