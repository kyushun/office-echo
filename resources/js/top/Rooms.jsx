import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

const Rooms = observer(class Rooms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastUpdated: new Date()
        };
    }

    componentDidMount() {
        this.autoUpdateInterval = setInterval(() => {
            this.setState({
                lastUpdated: new Date()
            });
        }, 1 * 1000);
    }

    componentWillUnmount = () => {
        clearInterval(this.autoUpdateInterval);
    }

    untillTimeToString(time) {
        var str = '';
        var min = moment(time).diff(moment(), 'minutes') + 1;
        if (min > 60) {
            const h = moment(time).diff(moment(), 'hours');
            min = min - (h * 60);
            str += `${h}時間`;
        } else {
            str += '';
        }
        str += `${min}分`;
        return str;
    }

    untilTimeToObject(time) {
        const days = moment(time).diff(moment(), 'days');
        const hours = moment(time).diff(moment(), 'hours');
        const minutes = (moment(time).diff(moment(), 'minutes') + 1);

        return {
            days: days,
            hours: (hours - days * 24),
            minutes: minutes - hours * 60
        };
    }

    render() {
        const cals = this.props.calendarStore.getNormalizedCalendars();
        const emptyCals = cals.empty;
        const usingCals = cals.using;

        return (
            <div className="card rooms">
                <div className="card-title">会議室</div>
                <div id="resource-group" className="resource-group">
                    {emptyCals.map((cal) => {
                        let event;
                        for (let e of cal.events) {
                            if (moment().isSameOrAfter(e.end)) continue;
                            event = e;
                            break;
                        }

                        return (
                            <div key={cal.id} className="resource">
                                <Link to={`/room/${cal.id}`}>
                                    <div className="title"><div className="empty-code">空室</div>{cal.summary}</div>
                                    <div className="next">
                                        {(() => {
                                            if (event) {
                                                return (
                                                    <span>
                                                        次の予定：{moment(event.start).format('HH:mm')}〜<br />
                                                        {event.summary}
                                                    </span>
                                                )
                                            } else {
                                                return '次の予定はありません';
                                            }
                                        })()}
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                    <hr />
                    {usingCals.map((cal) => {
                        let event;

                        for (let e of cal.events) {
                            if (moment().isSameOrAfter(e.end)) continue;
                            event = e;
                            break;
                        }

                        const { days, hours, minutes } = this.untilTimeToObject(event.end);

                        return (
                            <div key={cal.id} className="resource">
                                <Link to={`/room/${cal.id}`}>
                                    <div className="title">
                                        <div className="using-code">
                                            <span className="half-span">のこり</span>
                                            {days > 0 && <span>{days}<span className="half-span">日</span></span>}
                                            {hours > 0 && <span>{hours}<span className="half-span">時間</span></span>}
                                            {minutes}<span className="half-span">分</span>
                                        </div>
                                        {cal.summary}
                                    </div>
                                    <div className="next">
                                        {(() => {
                                            const dayDiff = moment(event.end).diff(moment(event.start), 'days');
                                            if (dayDiff >= 1) {
                                                if (event.allDay) {
                                                    if (dayDiff > 1) {
                                                        return moment(event.start).format('MM/DD(ddd)') + ' - ' + moment(event.end).add(-1, 'days').format('MM/DD(ddd)');
                                                    } else {
                                                        return '[終日] ' + moment(event.start).format('MM/DD(ddd)');
                                                    }
                                                }
                                                return moment(event.start).format('MM/DD(ddd) HH:mm') + ' - ' + moment(event.end).format('MM/DD(ddd) HH:mm');
                                            } else {
                                                return moment(event.start).format('HH:mm') + ' - ' + moment(event.end).format('HH:mm');
                                            }
                                        })()}
                                        <br />
                                        {event.summary}
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
});

export default Rooms;