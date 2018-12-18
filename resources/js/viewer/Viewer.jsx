import React from 'react';
import { render } from 'react-dom';
import { Link, withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

const Viewer = observer(class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalCalId: null,
            lastUpdated: new Date()
        };
    }

    componentDidMount = () => {
        this.autoUpdateInterval = setInterval(() => {
            this.setState({
                lastUpdated: new Date()
            });
        }, 1 * 1000);
    }

    componentWillUnmount = () => {
        clearInterval(this.autoUpdateInterval);
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
                    const { currentEvent, followEvents } = this.props.calendarStore.getNormalizedEvents(cal.id);

                    return (
                        <div key={cal.id}>
                            <div className="card v-room-card">
                                <div className="v-room-card-title">{cal.summary}</div>
                                <div className="v-room-card-current">
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
                                                        <span className="three-quarters-size">（{currentEvent.manager.name || "使用者不明"}）</span>
                                                    </div>
                                                    <div className="v-room-card-summary">{currentEvent.summary || "タイトル未設定"}</div>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                                {(() => {
                                    if (followEvents.length > 0) {
                                        const fe = followEvents[0];
                                        return (
                                            <div className="v-room-card-follow">
                                                <span className="half-size">NEXT </span>{moment(fe.start).format('HH:mm') + ' - '}{fe.summary || "タイトル未設定"}
                                            </div>
                                        );
                                    }
                                })()}

                                <div className={`v-room-card-footer v-room-card-footer-${currentEvent ? 'using' : 'empty'}`} onClick={() => { this.onModalOpen(cal.id) }}>
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

    componentDidMount = () => {
        this.autoCloseTimeout = setTimeout(() => {
            this.onClose();
        }, 30 * 1000);
    }

    componentWillUnmount = () => {
        clearTimeout(this.autoCloseTimeout);
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

    onClose = () => {
        this.props.onModalClose();
    }

    render() {
        const id = this.props.id;
        if (!id) return [];

        const { summary, currentEvent, followEvents } = this.props.calendarStore.getNormalizedEvents(id);

        return (
            <div className="v-room-detail">
                <div className="v-room-detail-content">
                    <div className="v-room-detail-title">{summary}</div>
                    <div className="v-room-detail-current">
                        <div className="v-room-detail-desc">現在の予定</div>
                        {(() => {
                            if (currentEvent) {
                                return (
                                    <div className="v-room-detail-current-using">
                                        <div className="v-room-detail-current-using-left">
                                            <div className="v-room-detail-current-desc">時間</div>
                                            <div className="v-room-detail-current-content">
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
                                            <div className="v-room-detail-current-desc">予定管理者</div>
                                            <div className="v-room-detail-current-content">{currentEvent.manager.name || '（不明）'}</div>
                                            <div className="v-room-detail-current-desc">メモ</div>
                                            <div className="v-room-detail-current-content">{currentEvent.description || ''}</div>
                                        </div>
                                        <div className="v-room-detail-current-using-right">
                                            <div className="v-room-detail-current-desc">タイトル</div>
                                            <div className="v-room-detail-current-content">{currentEvent.summary || '（タイトル未設定）'}</div>
                                            <div className="v-room-detail-current-desc">参加者</div>
                                            <div className="v-room-detail-current-content v-room-detail-current-attendees">
                                                {currentEvent.attendees.map((at) => {
                                                    return <div className="v-room-detail-current-attender" key={at.email}>{at.name}</div>;
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="v-room-detail-current-empty">
                                        現在の予定はありません
                                    </div>
                                );
                            }
                        })()}
                    </div>

                    <div className="v-room-detail-follow">
                        <div className="v-room-detail-desc">今後の予定</div>
                        <div className="v-room-detail-follow-event">
                            <div className="time desc">時間</div>
                            <div className="summary desc">タイトル</div>
                            <div className="manager desc">管理者</div>
                        </div>
                        {(() => {
                            if (followEvents.length > 0) {
                                return (followEvents.map((e) => {
                                    return (
                                        <div key={e.id} className="v-room-detail-follow-event">
                                            <div className="time">{moment(e.start).format('HH:mm') + ' - ' + moment(e.end).format('HH:mm')}</div>
                                            <div className="summary">{e.summary}</div>
                                            <div className="manager">{e.manager.name}</div>
                                        </div>
                                    );
                                }));
                            }
                        })()}
                    </div>
                    <div className="close-btn" onClick={this.onClose}><div className="content">×</div></div>
                </div>
            </div>
        );
    }
});