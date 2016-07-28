import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'whatwg-fetch';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.days = {
            day1: '08-05',
            day2: '08-06',
            day3: '08-07'
        };
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
            const start = moment(`2016-${this.days[e.day]} ${e.start}+09:00`, 'YYYY-MM-DD HHmmZ');
            const end   = moment(`2016-${this.days[e.day]} ${e.end  }+09:00`, 'YYYY-MM-DD HHmmZ');
            return (
                <div key={i}>
                  {`${start.format('M/D (ddd)')}: ${start.format('HH:mm')} - ${end.format('HH:mm')} [${e.stage}] ${e.artist}`}
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
