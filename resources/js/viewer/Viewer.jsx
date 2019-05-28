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
            lastUpdated: new Date(),
            searchModalOpen: false
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
        if (!this.state.searchModalOpen) {
            this.setState({
                modalCalId: id
            });
        }
    }

    onModalClose = () => {
        this.setState({
            modalCalId: null
        });
    }

    onSearchModalOpen = () => {
        if (!this.state.modalCalId) {
            this.setState({
                searchModalOpen: !this.state.searchModalOpen
            });
        }
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
                <div className="v-room-recom-btn" onClick={this.onSearchModalOpen}>
                    <i className="fas fa-search"></i>
                    <div>今すぐ使える<br /><strong>空き会議室を検索</strong></div>
                </div>
                <SearchRooms open={this.state.searchModalOpen} onHandleClose={this.onSearchModalOpen} calendarStore={this.props.calendarStore} />
            </div>
        );
    }
});

export default withRouter(Viewer);

const SearchRooms = observer(class SearchRooms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTime: 60
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.closeInterval = setTimeout(() => {
                this.props.onHandleClose();
            }, 30 * 1000);
            this.setState({
                searchTime: 60
            });
        } else if (this.props.open && !nextProps.open) {
            clearTimeout(this.closeInterval);
        }
    }

    setTime(time) {
        this.setState({
            searchTime: time
        });
    }

    render() {
        const cals = toJS(this.props.calendarStore.calendars);

        if (this.props.open) {
            return (
                <div className="v-room-recom-card">
                    <div className="v-room-recom-card-title">空き会議室</div>
                    <div className="v-room-recom-time-desc">利用予定時間</div>
                    <div className="v-room-recom-time">
                        <div className={this.state.searchTime == 30 ? 'active' : ''} onClick={this.setTime.bind(this, 30)}>30分</div>
                        <div className={this.state.searchTime == 60 ? 'active' : ''} onClick={this.setTime.bind(this, 60)}>60分</div>
                        <div className={this.state.searchTime == 120 ? 'active' : ''} onClick={this.setTime.bind(this, 120)}>120分</div>
                        <div className={!this.state.searchTime ? 'active' : ''} onClick={this.setTime.bind(this, null)}>終日</div>
                    </div>
                    <div className="v-room-recom-desc">
                        ここでは会議室の予約はできません。<br />
                        利用する場合は必ず予約をしてください。
                        </div>
                    <div className="v-room-recom-rooms">
                        {cals.map((cal) => {
                            const { currentEvent, followEvents } = this.props.calendarStore.getNormalizedEvents(cal.id);
                            if (!currentEvent) {
                                if ((!this.state.searchTime && followEvents.length == 0)
                                    || (this.state.searchTime &&
                                        (followEvents.length == 0 || moment(followEvents[0].start).diff(moment(), 'minutes') > this.state.searchTime))) {
                                    return (
                                        <div key={cal.id}>
                                            <div className="v-room-recom-room-summary">{cal.summary}</div>
                                            {(() => {
                                                if (followEvents.length > 0) {
                                                    return followEvents.map(fe => {
                                                        return (
                                                            <div key={fe.id} className="v-room-recom-room-next">
                                                                {moment(fe.start).format('HH:mm') + ' - '}{fe.summary || "タイトル未設定"}
                                                            </div>
                                                        );
                                                    });
                                                } else {
                                                    return <div className="v-room-recom-room-next">今後の予定なし</div>
                                                }
                                            })()}
                                        </div>
                                    );
                                }
                            }
                        })}
                    </div>
                </div>
            );
        } else {
            return <React.Fragment></React.Fragment>
        }
    }
});

const RoomDetails = observer(class RoomDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate = () => {
        clearTimeout(this.autoCloseTimeout);
        if (this.props.id != null) {
            this.autoCloseTimeout = setTimeout(() => {
                this.onClose();
            }, 30 * 1000);
        }
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