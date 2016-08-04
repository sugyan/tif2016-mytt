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
        this.query = {
            days: {
                '08-05': true,
                '08-06': true,
                '08-07': true
            },
            stages: {
                'HOT STAGE':      true,
                'SHIP STAGE':     true,
                'SMILE GARDEN':   true,
                'DOLL FACTORY':   true,
                'SKY STAGE':      true,
                'FESTIVAL STAGE': true,
                'DREAM STAGE':    true,
                'INFO CENTRE':    true,
                'GREETING AREA': false,
                'GRAND MARKET':  false
            },
            keyword: ''
        };
        this.colors = {
            'HOT STAGE':      '#fb1a39',
            'SHIP STAGE':     '#363483',
            'SMILE GARDEN':   '#ff9000',
            'DOLL FACTORY':   '#ff6aa2',
            'SKY STAGE':      '#07c1fe',
            'FESTIVAL STAGE': '#9fc700',
            'DREAM STAGE':    '#009c45',
            'INFO CENTRE':    '#e4007f',
            'GREETING AREA':  '#A0A0A0',
            'GRAND MARKET':   '#505050'
        };
        this.state = {
            stages: [],
            checked: {},
            result: null
        };
    }
    normalizeStageName(stage) {
        return stage.replace(/ \(.\)/, '').replace(/縁日レーン\d/, 'GRAND MARKET');
    }
    componentDidMount() {
        fetch('/api/timetable.json').then((response) => {
            return response.json();
        }).then((json) => {
            this.data = json.map((e, i) => {
                const date = this.days[e.day];
                e.id = `#${i}`;
                e.start = moment(`2016-${date} ${e.start}+09:00`, 'YYYY-MM-DD HHmmZ');
                e.end   = moment(`2016-${date} ${e.end  }+09:00`, 'YYYY-MM-DD HHmmZ');
                return e;
            }).sort((a, b) => a.start.diff(b.start) || a.end.diff(b.end));
            this.setState({
                stages: this.data.filter((e) => {
                    return this.query.stages[this.normalizeStageName(e.stage)];
                })
            });
        }).catch((err) => {
            window.console.error(err);
        });
    }
    handleUpdateQuery(query) {
        this.query = query;
        const stages = this.data.filter((e) => {
            if (query.keyword.length > 0) {
                if (!e.artist.match(new RegExp(query.keyword, 'i'))) {
                    return false;
                }
            }
            return query.days[this.days[e.day]] && query.stages[this.normalizeStageName(e.stage)];
        });
        this.setState({
            stages: stages
        });
    }
    handleCheck(id, e) {
        const checked = this.state.checked;
        if (e.target.checked) {
            checked[id] = true;
        } else {
            delete checked[id];
        }
        this.setState({
            checked: checked
        });
    }
    handleSubmit() {
        const results = {
            day1: [],
            day2: [],
            day3: []
        };
        this.data.forEach((e) => {
            if (! this.state.checked[e.id]) {
                return;
            }
            results[e.day].push(e);
        });
        fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(results)
        }).then((response) => {
            return response.json();
        }).then((json) => {
            this.setState({ result: json.result });
        });
    }
    handleBackButton() {
        this.setState({ result: null });
    }
    render() {
        const stages = this.state.stages.map((e, i) => {
            const color = this.colors[this.normalizeStageName(e.stage)];
            return (
                <tr key={i}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="checkbox" style={{ marginTop: 0, marginBottom: 0 }}>
                      <label>
                        <input
                            type="checkbox"
                            checked={this.state.checked[e.id] ? true : false}
                            onChange={this.handleCheck.bind(this, e.id)} />
                        {`${e.start.format('M/D(ddd)')}`} {`${e.start.format('HH:mm')} - ${e.end.format('HH:mm')}`}
                      </label>
                    </div>
                  </td>
                  <td style={{ backgroundColor: color, padding: '4px', width: '100%' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '4px', borderRadius: '4px' }}>
                      <small>{e.stage}</small>
                      <br />
                      <strong>{e.artist}</strong>
                    </div>
                  </td>
                </tr>
            );
        });
        const nav = (
            <nav className="navbar navbar-default navbar-fixed-bottom">
              <div className="container-fluid">
                <div className="navbar-collapse navbar-right">
                  <button className="btn btn-primary navbar-btn" onClick={this.handleSubmit.bind(this)}>
                    選択中の
                    <strong>{Object.keys(this.state.checked).length}</strong>
                    件でタイムテーブルを生成
                  </button>
                </div>
              </div>
            </nav>
        );
        const main = (
            <div>
              <FilteringForm query={this.query} onUpdateQuery={this.handleUpdateQuery.bind(this)} />
              <hr />
              <p>全{stages.length}件</p>
              <table className="table">
                <tbody>
                  {stages}
                </tbody>
              </table>
              {Object.keys(this.state.checked).length ? nav : null}
            </div>
        );
        const result = (
            <div>
              <div>
                <img src={this.state.result} />
              </div>
              <hr />
              <button className="btn btn-default" onClick={this.handleBackButton.bind(this)}>戻る</button>
            </div>
        );
        return (
            <div>
              <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                  <div className="navbar-header">
                    <span className="navbar-brand">TIF 2016</span>
                  </div>
                </div>
              </nav>
              <div className="container-fluid">
                {this.state.result ? result : main}
              </div>
            </div>
        );
    }
}

class FilteringForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            days: [
                [ '08-05', props.query.days['08-05'] ],
                [ '08-06', props.query.days['08-06'] ],
                [ '08-07', props.query.days['08-07'] ]
            ],
            stages: [
                [ 'HOT STAGE',      props.query.stages['HOT STAGE']      ],
                [ 'SHIP STAGE',     props.query.stages['SHIP STAGE']     ],
                [ 'DOLL FACTORY',   props.query.stages['DOLL FACTORY']   ],
                [ 'SKY STAGE',      props.query.stages['SKY STAGE']      ],
                [ 'SMILE GARDEN',   props.query.stages['SMILE GARDEN']   ],
                [ 'FESTIVAL STAGE', props.query.stages['FESTIVAL STAGE'] ],
                [ 'DREAM STAGE',    props.query.stages['DREAM STAGE']    ],
                [ 'INFO CENTRE',    props.query.stages['INFO CENTRE']    ],
                [ 'GREETING AREA',  props.query.stages['GREETING AREA']  ],
                [ 'GRAND MARKET',   props.query.stages['GRAND MARKET']   ]
            ],
            keyword: props.query.keyword
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
                <label className="col-sm-2 control-label">出演者名</label>
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
