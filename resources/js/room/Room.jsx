import React from 'react';
import { render } from 'react-dom';
import { Link, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

const Room = observer(class Room extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.autoCloseTimeout = setTimeout(() => {
            this.props.history.push('/');
        }, 30 * 1000);
    }

    componentWillUnmount = () => {
        clearTimeout(this.autoCloseTimeout);
    }

    getNormalizedEvents = (events) => {
        var current = null, follow = [];
        events.forEach(e => {
            if (moment().isBefore(e.end)) {
                if (moment().isSameOrAfter(e.start)) {
                    current = e;
                    return;
                }
                follow.push(e);
            }
        });
        return {
            currentEvent: current,
            followEvents: follow
        };
    }

    untillTimeToString(time) {
        var str = '';
        var min = moment(time).diff(moment(), 'minutes') + 1;
        if (min > 60) {
            const h = moment(time).diff(moment(), 'hours');
            min = min - (h * 60);
            str += `${h}時間`;
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
            minutes:  (minutes - hours * 60)
        };
    }

    timeToString = (time) => {
        var date = new Date(time);
        return date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
    }

    timeDurationToString = (start, end) => {
        return this.timeToString(start) + ' - ' + this.timeToString(end);
    }

    render() {
        const id = this.props.match.params.id;
        const _cal = this.props.calendarStore.getCalendar(id);

        return (
            <div className="room-detail">
                <div className="content">
                    {(() => {
                        if (_cal.length <= 0) {
                            return (
                                <div className="main-body">予定を取得中...</div>
                            );
                        } else {
                            const cal = _cal[0];
                            const { currentEvent, followEvents } = this.getNormalizedEvents(cal.events);
                            return (
                                <div>
                                    <div className="room-summary">{cal.summary}</div>
                                    <div className="event-content">
                                        <div className="card current-event">
                                            <div className="card-title">現在の予定</div>
                                            {(() => {
                                                if (currentEvent == null) {
                                                    return (
                                                        '現在の予定はありません'
                                                    );
                                                } else {
                                                    const { days, hours, minutes } = this.untilTimeToObject(currentEvent.end);
                                                    return (
                                                        <div className="event-detail-content">
                                                            <div className="untill">
                                                                <span className="half-span">のこり</span>
                                                                {days > 0 && <span>{days}<span className="half-span">日</span></span>}
                                                                {hours > 0 && <span>{hours}<span className="half-span">時間</span></span>}
                                                                {minutes}<span className="half-span">分</span>
                                                            </div>
                                                            <div className="time">{this.timeDurationToString(currentEvent.start, currentEvent.end)}</div>
                                                            <div className="summary">{currentEvent.summary || "タイトル未設定"}</div>
                                                            <div className="sub-content">
                                                                <div>管理者：{currentEvent.manager.name}</div>
                                                                <div className="attendees-wrapper">
                                                                    <div className="attendees-description">参加者：</div>
                                                                    <div className="attendees-content">{currentEvent.attendees.map((attender) => {
                                                                        return (
                                                                            <div key={attender.email} className="">{attender.name}</div>
                                                                        );
                                                                    })}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                        <div className="card follow-event">
                                            <div className="card-title">今後の予定</div>
                                            {followEvents.map((e) => {
                                                const { days, hours, minutes } = this.untilTimeToObject(e.start);

                                                return (
                                                    <div key={e.id} className="event-detail-content">
                                                        <div className="after">
                                                            {days > 0 && <span>{days}<span className="half-span">日</span></span>}
                                                            {hours > 0 && <span>{hours}<span className="half-span">時間</span></span>}
                                                            {minutes}<span className="half-span">分後</span>
                                                        </div>
                                                        <div className="time">{this.timeDurationToString(e.start, e.end)}</div>
                                                        <div className="summary">{e.summary || "タイトル未設定"}</div>
                                                        <div className="sub-content">
                                                            <div>管理者：{e.manager.name}</div>
                                                            <div className="attendees-wrapper">
                                                                <div className="attendees-description">参加者：</div>
                                                                <div className="attendees-content">{e.attendees.map((attender) => {
                                                                    return (
                                                                        <div key={attender.email} className="">{attender.name}</div>
                                                                    );
                                                                })}</div>
                                                            </div>
                                                        </div>
                                                        <hr className="e-d-hr" />
                                                    </div>
                                                );
                                            })}
                                            {(() => {
                                                if (followEvents.length <= 0) {
                                                    return (
                                                        '今後の予定はありません'
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    <Link to="/">
                        <div className="close-btn"><div className="content">×</div></div>
                    </Link>
                </div>
            </div>
        );
    }
});

export default withRouter(Room);