import React from 'react';
import { render } from 'react-dom';
import { Link, withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

const Viewer = observer(class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalCalId: null
        };
    }

    untilTimeToObject(time) {
        const days = moment(time).diff(moment(), 'days');
        const hours = moment(time).diff(moment(), 'hours');
        const minutes = (moment(time).diff(moment(), 'minutes') + 1);

        return {
            days: days,
            hours: (hours - days * 24),
            minutes: (minutes - hours * 60)
        };
    }

    onModalOpen = (id) => {
        this.setState({
            modalCalId: id
        });
    }

    onModalClose = () => {
        this.setState({
            modalCalId: null
        });
    }

    render() {
        const cals = toJS(this.props.calendarStore.calendars);

        return (
            <div className="v-room-wrapper">
                {cals.map((cal) => {
                    const currentEvent = this.props.calendarStore.getNormalizedEvents(cal.id).currentEvent;

                    return (
                        <div key={cal.id}>
                            <div className="card v-room-card">
                                <div className="v-room-card-title">{cal.summary}</div>
                                {(() => {
                                    if (currentEvent) {
                                        return (
                                            <div>
                                                <div className="time">
                                                    {(() => {
                                                        const dayDiff = moment(currentEvent.end).diff(moment(currentEvent.start), 'days');
                                                        if (dayDiff >= 1) {
                                                            if (currentEvent.allDay) {
                                                                if (dayDiff > 1) {
                                                                    return moment(currentEvent.start).format('MM/DD(ddd)') + ' - ' + moment(currentEvent.end).add(-1, 'days').format('MM/DD(ddd)');
                                                                } else {
                                                                    return moment(currentEvent.start).format('MM/DD(ddd)') + '【終日】';
                                                                }
                                                            }
                                                            return moment(currentEvent.start).format('MM/DD(ddd) HH:mm') + ' - ' + moment(currentEvent.end).format('MM/DD(ddd) HH:mm');
                                                        } else {
                                                            return moment(currentEvent.start).format('HH:mm') + ' - ' + moment(currentEvent.end).format('HH:mm');
                                                        }
                                                    })()}
                                                </div>
                                                <div className="v-room-card-manager">{currentEvent.manager.name || "使用者不明"}</div>
                                                <div className="v-room-card-summary">{currentEvent.summary || "タイトル未設定"}</div>
                                            </div>
                                        );
                                    }
                                })()}

                                <div className={`v-room-card-footer v-room-card-footer-${currentEvent ? 'using' : 'empty'}`} onClick={() => {this.onModalOpen(cal.id)}}>
                                    {(() => {
                                        if (currentEvent) {
                                            const { days, hours, minutes } = this.untilTimeToObject(currentEvent.end);
                                            return (
                                                <div className="untill">
                                                    <span className="half-span">のこり</span>
                                                    {days > 0 && <span>{days}<span className="half-span">日</span></span>}
                                                    {hours > 0 && <span>{hours}<span className="half-span">時間</span></span>}
                                                    {minutes}<span className="half-span">分</span>
                                                </div>
                                            );
                                        } else {
                                            return '空室';
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <RoomDetails id={this.state.modalCalId} calendarStore={this.props.calendarStore} onModalClose={this.onModalClose} />
            </div>
        );
    }
});

export default withRouter(Viewer);

const RoomDetails = observer(class RoomDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    untilTimeToObject(time) {
        const days = moment(time).diff(moment(), 'days');
        const hours = moment(time).diff(moment(), 'hours');
        const minutes = (moment(time).diff(moment(), 'minutes') + 1);

        return {
            days: days,
            hours: (hours - days * 24),
            minutes: (minutes - hours * 60)
        };
    }

    onClose = (e) => {
        this.props.onModalClose();
    }

    render() {
        const id = this.props.id;
        if (!id) return [];

        const { summary, currentEvent, followEvents } = this.props.calendarStore.getNormalizedEvents(id);
        console.log(followEvents);
        return (
            <div className="v-room-detail">
                <div className="v-room-detail-content">
                    <div className="v-room-detail-title">{summary}</div>
                    <div className="v-room-detail-current">
                        {(() => {
                            if (currentEvent) {
                                return (
                                    <div className="v-room-detail-current-using">
                                        <table className="v-room-detail-current-table">
                                            <tbody>
                                                <tr>
                                                    <th>時間</th>
                                                    <td>
                                                        {(() => {
                                                            const dayDiff = moment(currentEvent.end).diff(moment(currentEvent.start), 'days');
                                                            if (dayDiff >= 1) {
                                                                if (currentEvent.allDay) {
                                                                    if (dayDiff > 1) {
                                                                        return moment(currentEvent.start).format('MM/DD(ddd)') + ' - ' + moment(currentEvent.end).add(-1, 'days').format('MM/DD(ddd)');
                                                                    } else {
                                                                        return moment(currentEvent.start).format('MM/DD(ddd)') + '【終日】';
                                                                    }
                                                                }
                                                                return moment(currentEvent.start).format('MM/DD(ddd) HH:mm') + ' - ' + moment(currentEvent.end).format('MM/DD(ddd) HH:mm');
                                                            } else {
                                                                return moment(currentEvent.start).format('HH:mm') + ' - ' + moment(currentEvent.end).format('HH:mm');
                                                            }
                                                        })()}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>タイトル</th>
                                                    <td>{currentEvent.summary}</td>
                                                </tr>
                                                <tr>
                                                    <th>管理者</th>
                                                    <td>{currentEvent.manager.name}</td>
                                                </tr>
                                                <tr>
                                                    <th>参加者</th>
                                                    <td>{currentEvent.attendees.map((at) => {
                                                        return (at.name + '　');
                                                    })}</td>
                                                </tr>
                                                <tr>
                                                    <th>メモ</th>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="v-room-detail-current-empty">現在は空室です</div>
                                );
                            }
                        })()}
                    </div>

                    <div className="v-room-detail-follow">
                        {(() => {
                            if (followEvents.length > 0) {
                                return (followEvents.map((e) => {
                                    return (
                                        <div key={e.id} className="v-room-detail-follow-event">
                                            <div className="time">
                                                {(() => {
                                                    const dayDiff = moment(e.end).diff(moment(e.start), 'days');
                                                    if (dayDiff >= 1) {
                                                        if (e.allDay) {
                                                            if (dayDiff > 1) {
                                                                return moment(e.start).format('MM/DD(ddd)') + ' - ' + moment(e.end).add(-1, 'days').format('MM/DD(ddd)');
                                                            } else {
                                                                return moment(e.start).format('MM/DD(ddd)') + '【終日】';
                                                            }
                                                        }
                                                        return moment(e.start).format('MM/DD(ddd) HH:mm') + ' - ' + moment(e.end).format('MM/DD(ddd) HH:mm');
                                                    } else {
                                                        return moment(e.start).format('HH:mm') + ' - ' + moment(e.end).format('HH:mm');
                                                    }
                                                })()}
                                            </div>
                                            <div className="summary">{e.summary}</div>
                                            <div className="manager">{e.manager.name}</div>
                                        </div>
                                    );
                                }));
                            }
                        })()}
                    </div>
                    <div className="v-room-detail-close" onClick={this.onClose}></div>
                </div>
            </div>
        );
    }
});