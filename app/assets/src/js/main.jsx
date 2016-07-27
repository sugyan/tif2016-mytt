import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stages: []
        };
    }
    componentDidMount() {
        fetch('/api/timetable.json').then((response) => {
            return response.json();
        }).then((json) => {
            this.setState({
                stages: json
            });
        }).catch((err) => {
            window.console.error(err);
        });
    }
    render() {
        const stages = this.state.stages.map((e, i) => {
            return (
                <div key={i}>
                  {`${e.day}: ${e.start} - ${e.end} [${e.stage}] ${e.artist}`}
                </div>
            );
        });
        return (
            <div>{stages}</div>
        );
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});
