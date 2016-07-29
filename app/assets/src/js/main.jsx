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
                },
                stages: {
                    'HOT STAGE':      true,
                    'SHIP STAGE':     true,
                    'DOLL FACTORY':   true,
                    'SKY STAGE':      true,
                    'SMILE GARDEN':   true,
                    'FESTIVAL STAGE': true,
                    'DREAM STAGE':    true,
                    'INFO CENTRE':    true
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
            return this.state.query.days[date] && this.state.query.stages[e.stage];
        }).map((e, i) => {
            const date = this.days[e.day];
            const start = moment(`2016-${date} ${e.start}+09:00`, 'YYYY-MM-DD HHmmZ');
            const end   = moment(`2016-${date} ${e.end  }+09:00`, 'YYYY-MM-DD HHmmZ');
            return (
                <tr key={i}>
                  <td>
                    {`${start.format('M/D(ddd)')}`} {`${start.format('HH:mm')} - ${end.format('HH:mm')}`} {`[${e.stage}] ${e.artist}`}
                  </td>
                </tr>
            );
        });
        return (
            <div className="container-fluid">
              <FilteringForm onUpdateQuery={this.handleUpdateQuery.bind(this)} />
              <hr />
              <p>全{stages.length}件</p>
              <table className="table">
                <tbody>
                  {stages}
                </tbody>
              </table>
            </div>
        );
    }
}

class FilteringForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            days: [
                [ '08-05', true ],
                [ '08-06', true ],
                [ '08-07', true ]
            ],
            stages: [
                [ 'HOT STAGE',      true ],
                [ 'SHIP STAGE',     true ],
                [ 'DOLL FACTORY',   true ],
                [ 'SKY STAGE',      true ],
                [ 'SMILE GARDEN',   true ],
                [ 'FESTIVAL STAGE', true ],
                [ 'DREAM STAGE',    true ],
                [ 'INFO CENTRE',    true ]
            ]
        };
    }
    handleCheck(key, i) {
        const items = this.state[key];
        items[i][1] = !items[i][1];
        this.setState({
            [key]: items
        }, () => {
            if (this.props.onUpdateQuery) {
                const query = {
                    days: {},
                    stages: {}
                };
                ['days', 'stages'].forEach((key) => {
                    this.state[key].forEach((e) => query[key][e[0]] = e[1]);
                });
                this.props.onUpdateQuery(query);
            }
        });
    }
    render() {
        const checks = this.state.days.map((e, i) => {
            const date = moment(`2016-${e[0]}`, 'YYYY-MM-DD');
            return (
                <label key={i} className="checkbox-inline">
                  <input
                      type="checkbox"
                      checked={e[1]}
                      onChange={this.handleCheck.bind(this, 'days', i)} />
                  {date.format('M/D(ddd)')}
                </label>
            );
        });
        const stages = this.state.stages.map((e, i) => {
            return (
                <label key={i} className="checkbox-inline" style={{ marginLeft: '0px', marginRight: '10px' }}>
                  <input
                      type="checkbox"
                      checked={e[1]}
                      onChange={this.handleCheck.bind(this, 'stages', i)} />
                  {e[0]}
                </label>
            );
        });
        return (
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-2 control-label">日付</label>
                <div className="col-sm-10">
                  {checks}
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">ステージ</label>
                <div className="col-sm-10">
                  {stages}
                </div>
              </div>
            </form>
        );
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});
