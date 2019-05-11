import React from 'react';
import { render } from 'react-dom';
import kyureki from '../qreki';
import { observer } from 'mobx-react';

const ANIMATION_INTERVAL_SEC = 10;

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: {
                year: '',
                month: '',
                date: '',
                day: ''
            },
            rokuyo: '',
            time: '',
            sec: ''
        };
        this._date = null;
    }

    componentDidMount() {
        this.updateClock();
    }

    getRokuyo() {
        var dt = new Date();
        var kr = new kyureki(dt.getJD());
        return kr.rokuyo;
    }

    updateClock = () => {
        let dt = momNow.toDate()
        let year = dt.getFullYear();
        let month = dt.getMonth();
        let date = dt.getDate();
        let days = ['日', '月', '火', '水', '木', '金', '土'];
        let day = days[dt.getDay()];
        let hour = set2fig(dt.getHours());
        let min = set2fig(dt.getMinutes());
        let sec = set2fig(dt.getSeconds());

        if (!this._date || this._date.getDate() != dt.getDate()) {
            this.setState({
                rokuyo: this.getRokuyo()
            });
            this._date = dt;
        }

        this.setState({
            date: {
                year: year,
                month: month + 1,
                date: date,
                day: day
            },
            time: `${hour}:${min}`,
            sec: `:${sec}`
        });

        function set2fig(num) {
            return num >= 10 ? num : '0' + num;
        }
    }

    render() {
        const { year, month, date, day } = this.state.date;
        return (
            <div className="header">
                <div className="header-date">
                    <div className="h-date">
                        {year}<span className="half-span">年</span>{month}<span className="half-span">月</span>{date}<span className="half-span">日</span>
                        <span className="half-span">（</span>{day}<span className="half-span">）</span>{this.state.rokuyo}
                    </div>
                    <div className="h-time">
                        {this.state.time}<div className="h-sec">{this.state.sec}</div>
                    </div>
                </div>
                <Notification trainDelaysStore={this.props.trainDelaysStore} weatherStore={this.props.weatherStore} />
            </div>
        );
    }
}

const Notification = observer(class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
        this.animationCount = 0;
    }

    componentDidMount() {
        setInterval(() => {
            this.animation();
        }, ANIMATION_INTERVAL_SEC * 1000);
    }

    animation() {
        const titleId = 'header-info-title';
        const contentId = 'header-info-content';
        const animTag = '-anim-';
        const titleParent = document.getElementById(titleId);
        const contentParent = document.getElementById(contentId);

        var tc = titleParent.children[this.animationCount];
        var tn = titleParent.children[this.animationCount + 1];
        var cc = contentParent.children[this.animationCount];
        var cn = contentParent.children[this.animationCount + 1];

        if (typeof cn !== "undefined") {
            this.animationCount++;
        } else {
            this.animationCount = 0;
            tn = titleParent.children[0];
            cn = contentParent.children[0];
        }

        if (typeof tc !== "undefined") {
            tc.classList.remove(titleId + animTag + 'in');
            tc.classList.add(titleId + animTag + 'out');
        }
        if (typeof cc !== "undefined") {
            cc.classList.remove(contentId + animTag + 'in');
            cc.classList.add(contentId + animTag + 'out');
        }

        if (typeof tn !== "undefined") {
            tn.classList.remove(titleId + animTag + 'out');
            tn.classList.add(titleId + animTag + 'in');
        }
        if (typeof cn !== "undefined") {
            cn.classList.remove(contentId + animTag + 'out');
            cn.classList.add(contentId + animTag + 'in');
        }
    }

    render() {
        const { currently, hourly, daily } = this.props.weatherStore;
        const delays = this.props.trainDelaysStore.delays;

        return (
            <div className="header-info">
                <div className="header-info-frame">
                    <div id="header-info-title" className="header-info-title-wrapper">
                        {(() => {
                            if (currently.length > 0) {
                                return (
                                    <div className="header-info-title header-info-title-anim-out">現在の天気</div>
                                );
                            }
                        })()}
                        {(() => {
                            if (hourly.length > 0) {
                                return (
                                    <div className="header-info-title header-info-title-anim-out">今後の天気</div>
                                );
                            }
                        })()}
                        {(() => {
                            if (daily.length > 0) {
                                return (
                                    <div className="header-info-title header-info-title-anim-out">一週間の天気</div>
                                );
                            }
                        })()}
                        {(() => {
                            if (delays.length > 0) {
                                return (
                                    <div className="header-info-title header-info-title-anim-out">鉄道遅延</div>
                                );
                            }
                        })()}
                        {this.state.notifications.map((_n) => {
                            return (
                                <div key={_n.title + _n.content} className="header-info-title header-info-title-anim-out">{_n.title}</div>
                            );
                        })}
                    </div>
                    <div id="header-info-content" className="header-info-content-wrapper">
                        {(() => {
                            if (currently.length > 0) {
                                return (
                                    <div className="header-info-content header-info-content-anim-out">
                                        <span className="three-quarters-size">{currently[0].summary}</span>&nbsp;
                                        <i className={`icon wi wi-forecast-io-${currently[0].icon}`} />&nbsp;&nbsp;
                                        <span className="three-quarters-size">気温&nbsp;</span>{Math.round(currently[0].temperature)}&deg;C&nbsp;&nbsp;
                                        <span className="three-quarters-size">降水確率&nbsp;</span>{Math.round(currently[0].precipProbability * 100)}%&nbsp;&nbsp;
                                        <span className="three-quarters-size">湿度&nbsp;</span>{Math.round(currently[0].humidity * 100)}%&nbsp;&nbsp;
                                        <span className="three-quarters-size">気圧&nbsp;</span>{Math.round(currently[0].pressure)}hPa
                                    </div>
                                );
                            }
                        })()}
                        {(() => {
                            if (hourly.length > 0) {
                                return (
                                    <div className="header-info-content header-info-content-anim-out">
                                        3<span className="three-quarters-size">時間後</span>&nbsp;<i className={`icon wi wi-forecast-io-${hourly[4].icon}`} />&nbsp;&nbsp;
                                        6<span className="three-quarters-size">時間後</span>&nbsp;<i className={`icon wi wi-forecast-io-${hourly[7].icon}`} />&nbsp;&nbsp;
                                        9<span className="three-quarters-size">時間後</span>&nbsp;<i className={`icon wi wi-forecast-io-${hourly[10].icon}`} />&nbsp;&nbsp;
                                        12<span className="three-quarters-size">時間後</span>&nbsp;<i className={`icon wi wi-forecast-io-${hourly[13].icon}`} />
                                    </div>
                                );
                            }
                        })()}
                        {(() => {
                            if (daily.length > 0) {
                                return (
                                    <div className="header-info-content header-info-content-anim-out">
                                        {[...Array(4)].map((val, i) => {
                                            const index = i + 1;
                                            return (
                                                <span key={daily[index].time}>
                                                    {moment.unix(daily[index].time).format('MM/DD')}&nbsp;
                                                <i className={`icon wi wi-forecast-io-${daily[index].icon}`} />
                                                    <span className="three-quarters-size">(
                                                    <span className="material-red">{Math.round(daily[index].temperatureHigh)}</span>/
                                                    <span className="material-blue">{Math.round(daily[index].temperatureLow)}</span>
                                                        )</span>&nbsp;&nbsp;
                                            </span>
                                            );
                                        })}
                                    </div>
                                );
                            }
                        })()}
                        {(() => {
                            if (delays.length > 0) {
                                return (
                                    <div className="header-info-content header-info-content-anim-out">
                                        {delays.map((line, i) => {
                                            return (i != 0 ? '・' : '') + line.name;
                                        })}
                                        <span className="three-quarters-size">で遅延が発生しています</span>
                                    </div>
                                );
                            }
                        })()}
                        {this.state.notifications.map((_n) => {
                            return (
                                <div key={_n.content} className="header-info-content header-info-content-anim-out">{_n.content}</div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
});