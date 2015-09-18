/** @jsx React.createElement */
var Status = React.createClass({
    render: function() {
        return (
            <div className="panel panel-primary" id="status">
                <div className="panel-heading">
                    <h2 className="panel-title">Status</h2>
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

var EnergyTable = React.createClass({
    render: function() {
        var energyRows = this.props.energyData.map(function (row) {
            return (
                <EnergyRow name = {row.name} power = {row.power} energy = {row.energyLeft} />
            );
        });
        return (
            <div id="energy">
                <table className="table table-striped" id="energy-table">
                    <tr>
                        <th>
                            Saints
                        </th>
                        <th>
                            Power
                        </th>
                        <th>
                            Energy
                        </th>
                    </tr>
                    {energyRows}
                </table>
            </div>);
    }
});

var EnergyRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.power}</td>
                <td>{this.props.energy}</td>
            </tr>
        );
    }
});

function renderStatus(data) {
    React.render(<Status data={data} />, document.getElementById("information"));
    React.render(<EnergyTable energyData={data.saints}/>, document.getElementById("energy"));
}
