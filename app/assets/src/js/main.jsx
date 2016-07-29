import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'whatwg-fetch';

moment.locale('ja');

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.data = [];
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
            this.data = json;
            this.setState({
                stages: this.data
            });
        }).catch((err) => {
            window.console.error(err);
        });
    }
    handleUpdateQuery(query) {
        const stages = this.data.filter((e) => {
            if (query.keyword.length > 0) {
                if (!e.artist.match(new RegExp(query.keyword, 'i'))) {
                    return false;
                }
            }
            return query.days[this.days[e.day]] && query.stages[e.stage];
        });
        this.setState({
            stages: stages
        });
    }
    render() {
        const stages = this.state.stages.map((e, i) => {
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
            ],
            keyword: ''
        };
    }
    handleCheck(key, i) {
        const items = this.state[key];
        items[i][1] = !items[i][1];
        this.setState({
            [key]: items
        }, () => {
            if (this.props.onUpdateQuery) {
                this.props.onUpdateQuery(this.createQuery());
            }
        });
    }
    handleChangeText(e) {
        this.setState({
            keyword: e.target.value
        }, () => {
            if (this.props.onUpdateQuery) {
                this.props.onUpdateQuery(this.createQuery());
            }
        });
    }
    createQuery() {
        const query = {
            days: {},
            stages: {},
            keyword: this.state.keyword
        };
        ['days', 'stages'].forEach((key) => {
            this.state[key].forEach((e) => query[key][e[0]] = e[1]);
        });
        return query;
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
            <form className="form-horizontal" onSubmit={(e) => e.preventDefault()}>
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
              <div className="form-group">
                <label className="col-sm-2 control-label">キーワード</label>
                <div className="col-sm-10">
                  <input
                      className="form-control"
                      type="text"
                      value={this.state.keyword}
                      onChange={this.handleChangeText.bind(this) }/>
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
