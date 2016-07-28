import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'whatwg-fetch';

moment.locale('ja');

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.days = {
            day1: '08-05',
            day2: '08-06',
            day3: '08-07'
        };
        this.state = {
            stages: [],
            query: {
                days: {
                    '08-05': true,
                    '08-06': true,
                    '08-07': true
                }
            }
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
    handleUpdateQuery(query) {
        this.setState({
            query: query
        });
    }
    render() {
        const stages = this.state.stages.filter((e) => {
            const date = this.days[e.day];
            return this.state.query.days[date];
        }).map((e, i) => {
            const date = this.days[e.day];
            const start = moment(`2016-${date} ${e.start}+09:00`, 'YYYY-MM-DD HHmmZ');
            const end   = moment(`2016-${date} ${e.end  }+09:00`, 'YYYY-MM-DD HHmmZ');
            return (
                <li key={i}>
                  {`${start.format('M/D(ddd)')} ${start.format('HH:mm')} - ${end.format('HH:mm')} [${e.stage}] ${e.artist}`}
                </li>
            );
        });
        return (
            <div>
              <FilteringForm onUpdateQuery={this.handleUpdateQuery.bind(this)} />
              <p>全{stages.length}件</p>
              <ul>
                {stages}
              </ul>
            </div>
        );
    }
}

class FilteringForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            days: {
                '08-05': true,
                '08-06': true,
                '08-07': true
            }
        };
    }
    handleCheck(key) {
        const days = this.state.days;
        days[key] = !days[key];
        this.setState({
            days: days
        });
        if (this.props.onUpdateQuery) {
            this.props.onUpdateQuery({
                days: days
            });
        }
    }
    render() {
        const checks = Object.keys(this.state.days).sort().map((key, i) => {
            const date = moment(`2016-${key}`, 'YYYY-MM-DD');
            return (
                <label key={i}>
                  <input
                      type="checkbox"
                      checked={this.state.days[key]}
                      onChange={this.handleCheck.bind(this, key)} />
                  {date.format('M/D(ddd)')}
                </label>
            );
        });
        return (
            <div>
              {checks}
            </div>
        );
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});
