var Status = React.createClass({
    render: function() {
        return (
            <div id="status">
                <h2>Status</h2>
                <EnergyTable energyData = {this.props.data.saints}/>
                <span>Steps: {this.props.data.steps}</span> < br />
                <span>Path Size: {this.props.data.pathSize}</span> < br />
                <span>Path Cost: {this.props.data.pathCost}</span> < br />
                <span>Current Position: {this.props.data.position[0]}, {this.props.data.position[1]}</span>
            </div>
        );
    }
});

var EnergyTable = React.createClass({
    render: function() {
        var energyRows = this.props.energyData.map(function (row) {
            return (
                <EnergyRow name = {row.name} energy = {row.energyLeft} />
            )
        });
        return (
            <div id="energy">
                <table id="energy-table">
                    <tr>
                        <th>
                            Saints
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
                <td>{this.props.energy}</td>
            </tr>
        )
    }
});

function renderStatus(data) {
    React.render(<Status data={data} />, document.getElementById("status"));
}
